import Hyperswarm from "hyperswarm";
import { store } from "../../../logic/domain";
import * as merkle from "../../../merkle";

const swarm = new Hyperswarm();

const GLOBAL_TOPIC = Buffer.alloc(32).fill("sms-desktop-global-topic");

swarm.join(GLOBAL_TOPIC, {
  server: true,
  client: true,
});

const blocks: Record<string, merkle.Block> = {};

swarm.on("connection", (connection, info) => {
  let receiveRootHash: string | null = null;
  let sentRootHash: string | null = null;
  const write = (msg: Protocol) => {
    connection.write(Buffer.from(JSON.stringify(msg)));
  };
  connection.on("data", (data) => {
    const msg = JSON.parse(data.toString()) as Protocol;
    switch (msg.type) {
      case "update": {
        receiveRootHash = msg.hash;
        acquire();
        break;
      }
      case "require": {
        const block = blocks[msg.hash];
        if (block) {
          write({ type: "provide", block });
        }
        break;
      }
      case "provide": {
        const hash = merkle.calculateBlockHash(msg.block);
        blocks[hash] = msg.block;
        if (msg.block.type === "leaf") {
          const { senderPublicKey, recipientPublicKey, createdAtEpoch, text } = JSON.parse(msg.block.data);
          store.command.Message(senderPublicKey, recipientPublicKey, createdAtEpoch, text);
        }
      }
    }
  });
  function acquire() {
    if (receiveRootHash) {
      for (const hash of merkle.missingFromMerkle(receiveRootHash, blocks).slice(0, 32)) {
        write({ type: "require", hash });
      }
    }
  }
  function update() {
    const messageSetMerkle = merkle.merkleFromSet(
      Object.values(store.currentState.messageMap).map((message) => JSON.stringify(message)),
      32
    );
    if (sentRootHash !== messageSetMerkle.hash) {
      // console.dir(messageSetMerkle, { depth: null });
      Object.assign(blocks, messageSetMerkle.blocks);
      write({ type: "update", hash: messageSetMerkle.hash });
      sentRootHash = messageSetMerkle.hash;
    }
  }
  const acquireIntervalId = setInterval(acquire, 100);
  const updateIntervalId = setInterval(update, 100);
  connection.on("close", () => {
    clearInterval(acquireIntervalId);
    clearInterval(updateIntervalId);
  });
  connection.on("error", () => {
    clearInterval(acquireIntervalId);
    clearInterval(updateIntervalId);
  });
});

type Protocol =
  | {
      type: "update";
      hash: string;
    }
  | {
      type: "require";
      hash: string;
    }
  | {
      type: "provide";
      block: merkle.Block;
    };
