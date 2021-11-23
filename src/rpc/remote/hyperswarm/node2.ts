import Hyperswarm from "hyperswarm";
import { JSONB } from "../../../other/JSONB";
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
import { cpus } from "os";
import { filter, isEmpty, takeWhile } from "../../../other/asyncIteratorOperators";

const swarm = new Hyperswarm();

const GLOBAL_TOPIC = Buffer.alloc(32).fill("sms-desktop-global-topic");

// TODO join topics based on contacts shared secret
swarm.join(GLOBAL_TOPIC, {
  server: true,
  client: true,
});

swarm.on("connection", (connection, info) => {
  console.log("connection");
  let receivedRootHash: Hash | null = null;
  let sentRootHash: Hash | null = null;
  let fileHashes: Array<Hash> = [];
  const send = (deserialized: Protocol) => {
    if (!isConnectionAlive) return;
    const serialized = serialize(deserialized);
    if (serialized.length > MAX_SERIALIZED_BYTES) throw new Error();
    connection.write(serialized);
  };
  connection.on("data", async (data) => {
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
  });
  let isConnectionAlive = true;
  let cpuUsagePercentage = 0;
  const requiredMessageHashes = new Set<Hash>();
  const requiredFileHashes = new Set<Hash>();
  async function loop() {
    if (!isConnectionAlive) return;
    const measureCpuUsage = startMeasureCpuUsage();
    if (cpuUsagePercentage <= 30) {
      if (receivedRootHash) {
        const missingHashes = messagesFactory.missing(receivedRootHash);
        const requireableHashes = filter(missingHashes, async (hash) => !requiredMessageHashes.has(hash));
        const limitedRequireableHashes = takeWhile(requireableHashes, async () => requiredMessageHashes.size <= 10);
        for await (const hash of limitedRequireableHashes) {
          send({ scope: "messages", type: "require", hash });
          requiredMessageHashes.add(hash);
        }
      }
    }
    if (cpuUsagePercentage <= 20) {
      // try download files
      for (const fileHash of fileHashes) {
        const missingHashes = filesFactory.missing(fileHash);
        const requireableHashes = filter(missingHashes, async (hash) => !requiredFileHashes.has(hash));
        const limitedRequireableHashes = takeWhile(requireableHashes, async () => requiredFileHashes.size <= 100);
        for await (const hash of limitedRequireableHashes) {
          send({ scope: "files", type: "require", hash });
          requiredFileHashes.add(hash);
        }
      }
      // try materialize files
      for (const fileHash of fileHashes) {
        if (await isEmpty(filesFactory.missing(fileHash))) {
          const temptFilePath = path.join(filesFolderPath, fileHash + ".materializing");
          await fs.promises.writeFile(temptFilePath, filesFactory.from(fileHash));
          const filePath = path.join(filesFolderPath, fileHash);
          await fs.promises.rename(temptFilePath, filePath).catch(() => {
            /* TODO */
          });
        }
      }
    }
    cpuUsagePercentage = Math.trunc(measureCpuUsage() * 100);
    // console.log(`${cpuUsagePercentage}%`);
    if (isConnectionAlive) setTimeout(loop, 10);
  }
  loop();
  const unsubscribe = store.subscribe(async (state) => {
    const messages = Object.values(state.messageMap);
    const hash = await messagesFactory.to(messages);
    if (hash !== sentRootHash) {
      send({ scope: "messages", type: "update", hash });
      sentRootHash = hash;
    }
    fileHashes = messages.flatMap((message) => message.attachments.map((attachment) => attachment.contentHash));
  });
  connection.on("close", () => {
    isConnectionAlive = false;
    unsubscribe();
  });
  connection.on("error", () => {
    isConnectionAlive = false;
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
  if (!isValidProtocolMessage(deserialized)) throw new Error();
  const stringified = JSONB.stringify(deserialized);
  const serialized = Buffer.from(stringified);
  if (serialized.byteLength > MAX_SERIALIZED_BYTES) throw new Error();
  return serialized;
}

function deserialize(serialized: Buffer): Protocol {
  if (serialized.byteLength > MAX_SERIALIZED_BYTES) throw new Error();
  const stringified = serialized.toString();
  const deserialized = JSONB.parse(stringified);
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

const cores = cpus().length;
function startMeasureCpuUsage() {
  const startTimeNanoSeconds = process.hrtime.bigint();
  const startCpuUsage = process.cpuUsage();
  function endMeasureCpuUsage() {
    const endTimeNanoSeconds = process.hrtime.bigint();
    const deltaTimeNanoSeconds = endTimeNanoSeconds - startTimeNanoSeconds;
    const deltaTimeMicroSeconds = Number(deltaTimeNanoSeconds / BigInt(1000));
    const deltaCpuUsage = process.cpuUsage(startCpuUsage);
    const deltaCpuTimeMicroSeconds = deltaCpuUsage.user + deltaCpuUsage.system;
    const percentage = deltaCpuTimeMicroSeconds / deltaTimeMicroSeconds / cores;
    return percentage;
  }
  return endMeasureCpuUsage;
}
