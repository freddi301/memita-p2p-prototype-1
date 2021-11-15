import Hyperswarm from "hyperswarm";
import { store } from "../../../logic/domain";
import * as merkle from "../../../logic/merkle/merkle";
import cbor from "cbor";

// TODO refactor syncronisation mechanism
// TODO implement state of already asked hashes
// TODO validate incoming msg

const swarm = new Hyperswarm();

const GLOBAL_TOPIC = Buffer.alloc(32).fill("sms-desktop-global-topic");

// TODO join topics based on contacts shared secret
swarm.join(GLOBAL_TOPIC, {
  server: true,
  client: true,
});

swarm.on("connection", (connection, info) => {
  console.log("connection");
  let receivedRootHash: merkle.Hash | null = null;
  let sentRootHash: merkle.Hash | null = null;
  connection.on("data", (data) => {
    const msg = deserialize(data);
    console.dir(msg, { depth: null });
    switch (msg.type) {
      case "update": {
        receivedRootHash = msg.hash;
        acquire();
        break;
      }
      case "require": {
        const fromRepo = merkle.repo.from(msg.hash);
        if (fromRepo.type === "found") {
          connection.write(serialize({ type: "provide", block: fromRepo.value }));
        }
        break;
      }
      case "provide": {
        merkle.repo.to(msg.block);
        if (msg.block.type === "leaf") {
          const { senderPublicKey, recipientPublicKey, createdAtEpoch, text } = JSON.parse(msg.block.data);
          store.command.Message(senderPublicKey, recipientPublicKey, createdAtEpoch, text);
        }
      }
    }
  });
  function acquire() {
    if (receivedRootHash) {
      for (const hash of merkle.factory.missing(receivedRootHash).slice(0, 32)) {
        connection.write(serialize({ type: "require", hash }));
      }
    }
  }
  function update() {
    const hash = merkle.factory.to(
      Object.values(store.currentState.messageMap).map((message) => JSON.stringify(message))
    );
    if (sentRootHash === null || !merkle.equalsHash(sentRootHash, hash)) {
      connection.write(serialize({ type: "update", hash }));
      sentRootHash = hash;
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
      hash: merkle.Hash;
    }
  | {
      type: "require";
      hash: merkle.Hash;
    }
  | {
      type: "provide";
      block: merkle.Block;
    };

function serialize(msg: Protocol): Buffer {
  return cbor.encode(msg);
}

function deserialize(msg: Buffer): Protocol {
  return cbor.decode(msg);
}
