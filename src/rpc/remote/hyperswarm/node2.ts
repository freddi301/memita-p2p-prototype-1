import Hyperswarm from "hyperswarm";
import { isAlternative, isLiteral, isObject } from "../../../other/assertion";
import { store } from "../../../other/domain";
import {
  FileData,
  filesFactory,
  filesRepo,
  Hash,
  isValidFileBlock,
  isValidHash,
  isValidMessageBlock,
  MessageData,
  messagesFactory,
  messagesRepo,
} from "../../../other/asyncMerkle/asyncMerkle";
import { Tree } from "../../../other/asyncMerkle/AsynMerkleTree";
import fs from "fs";
import { filesFolderPath } from "../../../other/folderPaths";
import path from "path";
import { filter, isEmpty, takeWhile } from "../../../other/asyncIteratorOperators";
import cbor from "cbor";
import { checkFileExists } from "../../../other/fileUtils";
import { startMeasureCpuUsage } from "../../../other/startMeasureCpuUsage";

const TRUST_SELF = true;

const swarm = new Hyperswarm();

const GLOBAL_TOPIC = Buffer.alloc(32).fill("sms-desktop-global-topic");

// TODO join topics based on contacts shared secret
swarm.join(GLOBAL_TOPIC, {
  server: true,
  client: true,
});

swarm.on("connection", (connection, info) => {
  console.log("connection");
  let isConnectionAlive = true;
  let receivedRootHash: Hash | null = null;
  let sentRootHash: Hash | null = null;
  const requiredMessageHashes = new Set<Hash>();
  let fileHashes: Array<Hash> = [];
  const requiredFileHashes = new Set<Hash>();
  const send = (deserialized: Protocol) => {
    if (!isConnectionAlive) return;
    const serialized = serialize(deserialized);
    if (serialized.length > MAX_SERIALIZED_BYTES) throw new Error();
    connection.write(serialized);
  };
  connection.on("data", async (data) => {
    loop.wake();
    if (data.length > MAX_SERIALIZED_BYTES) throw new Error();
    const deserialized = deserialize(data);
    switch (deserialized.scope) {
      case "messages": {
        switch (deserialized.type) {
          case "require": {
            const fromRepo = await messagesRepo.from(deserialized.hash);
            if (fromRepo.type === "found") {
              send({ scope: "messages", type: "provide", block: fromRepo.value });
            }
            break;
          }
          case "provide": {
            const hash = await messagesRepo.to(deserialized.block);
            requiredMessageHashes.delete(hash);
            if (deserialized.block.type === "leaf") {
              const { senderPublicKey, recipientPublicKey, createdAtEpoch, text, attachments } =
                deserialized.block.data;
              store.command.Message(senderPublicKey, recipientPublicKey, createdAtEpoch, text, attachments);
            }
            break;
          }
          case "update": {
            receivedRootHash = deserialized.hash;
            break;
          }
        }
        break;
      }
      case "files": {
        switch (deserialized.type) {
          case "require": {
            const fromRepo = await filesRepo.from(deserialized.hash);
            if (fromRepo.type === "found") {
              send({ scope: "files", type: "provide", block: fromRepo.value });
            }
            break;
          }
          case "provide": {
            const hash = await filesRepo.to(deserialized.block);
            requiredFileHashes.delete(hash);
            break;
          }
        }
        break;
      }
    }
    loop.wake();
  });
  const unsubscribe = store.subscribe(async (state) => {
    const messages = Object.values(state.messageMap);
    const hash = await messagesFactory.to(messages);
    if (hash !== sentRootHash) {
      send({ scope: "messages", type: "update", hash });
      sentRootHash = hash;
    }
    fileHashes = messages.flatMap((message) => message.attachments.map((attachment) => attachment.contentHash));
  });
  const loop = new Loop(async (cpuUsagePercentage) => {
    if (!isConnectionAlive) return;
    if (receivedRootHash) {
      const missingHashes = messagesFactory.missing(receivedRootHash);
      const requireableHashes = filter(missingHashes, async (hash) => !requiredMessageHashes.has(hash));
      const limitedRequireableHashes = takeWhile(requireableHashes, async () => requiredMessageHashes.size <= 10);
      for await (const hash of limitedRequireableHashes) {
        send({ scope: "messages", type: "require", hash });
        requiredMessageHashes.add(hash);
      }
    }
    for (const fileHash of fileHashes) {
      const temptFilePath = path.join(filesFolderPath, fileHash + ".materializing");
      const filePath = path.join(filesFolderPath, fileHash);
      if (!(await checkFileExists(temptFilePath)) && !(await checkFileExists(filePath))) {
        // try download files
        const missingHashes = filesFactory.missing(fileHash);
        const requireableHashes = filter(missingHashes, async (hash) => !requiredFileHashes.has(hash));
        const limitedRequireableHashes = takeWhile(requireableHashes, async () => requiredFileHashes.size <= 10);
        for await (const hash of limitedRequireableHashes) {
          send({ scope: "files", type: "require", hash });
          requiredFileHashes.add(hash);
        }
        // try materialize files
        if (await isEmpty(filesFactory.missing(fileHash))) {
          await fs.promises.writeFile(temptFilePath, filesFactory.from(fileHash));
          await fs.promises.rename(temptFilePath, filePath);
        }
      }
    }
  });
  const wakeIntervalId = setInterval(() => {
    loop.wake();
  }, 100);
  connection.on("close", () => {
    isConnectionAlive = false;
    clearInterval(wakeIntervalId);
    unsubscribe();
  });
  connection.on("error", () => {
    isConnectionAlive = false;
    clearInterval(wakeIntervalId);
    unsubscribe();
  });
});

type Protocol =
  | {
      scope: "messages";
      type: "require";
      hash: Hash;
    }
  | {
      scope: "messages";
      type: "provide";
      block: Tree<Hash, MessageData>;
    }
  | {
      scope: "messages";
      type: "update";
      hash: Hash;
    }
  | {
      scope: "files";
      type: "require";
      hash: Hash;
    }
  | {
      scope: "files";
      type: "provide";
      block: Tree<Hash, FileData>;
    };

const MAX_SERIALIZED_BYTES = 512000;

function serialize(deserialized: Protocol): Buffer {
  if (TRUST_SELF) {
    const serialized = cbor.encodeOne(deserialized, { highWaterMark: 512000 } as any);
    if (serialized.byteLength > MAX_SERIALIZED_BYTES) throw new Error();
    return serialized;
  } else {
    if (!isValidProtocolMessage(deserialized)) throw new Error();
    const serialized = cbor.encode(deserialized, { highWaterMark: 512000 } as any);
    if (serialized.byteLength > MAX_SERIALIZED_BYTES) throw new Error();
    return serialized;
  }
}

function deserialize(serialized: Buffer): Protocol {
  if (serialized.byteLength > MAX_SERIALIZED_BYTES) throw new Error();
  const deserialized = cbor.decodeFirstSync(serialized, { highWaterMark: 512000 } as any);
  if (!isValidProtocolMessage(deserialized)) throw new Error();
  return deserialized;
}

const isValidProtocolMessage = isAlternative([
  isObject({
    scope: isAlternative([isLiteral("messages")]),
    type: isLiteral("require"),
    hash: isValidHash,
  }),
  isObject({
    scope: isAlternative([isLiteral("messages")]),
    type: isLiteral("provide"),
    block: isValidMessageBlock,
  }),
  isObject({
    scope: isLiteral("messages"),
    type: isLiteral("update"),
    hash: isValidHash,
  }),
  isObject({
    scope: isAlternative([isLiteral("files")]),
    type: isLiteral("require"),
    hash: isValidHash,
  }),
  isObject({
    scope: isAlternative([isLiteral("files")]),
    type: isLiteral("provide"),
    block: isValidFileBlock,
  }),
]);

class Loop {
  constructor(private loop: (cpuUsagePercentage: number) => Promise<void>) {}
  private isExecuting = false;
  private scheduleNext = false;
  private cpuUsagePercentage = 0;
  wake() {
    if (this.isExecuting) {
      this.scheduleNext = true;
    } else {
      this.isExecuting = true;
      const measureCpuUsage = startMeasureCpuUsage();
      this.loop(this.cpuUsagePercentage).then(() => {
        this.cpuUsagePercentage = Math.trunc(measureCpuUsage() * 100);
        this.isExecuting = false;
        if (this.scheduleNext) {
          this.scheduleNext = false;
          this.wake();
        }
      });
    }
  }
}
