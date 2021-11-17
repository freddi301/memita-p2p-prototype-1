import Hyperswarm from "hyperswarm";
import { store } from "../../../logic/domain";
import * as asyncMerkle from "../../../logic/asyncMerkle/asyncMerkle";
import { JSONB } from "../../JSONB";

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
  let receivedRootHash: asyncMerkle.Hash | null = null;
  let sentRootHash: asyncMerkle.Hash | null = null;
  connection.on("data", async (data) => {
    const msg = deserialize(data.toString());
    switch (msg.type) {
      case "update": {
        receivedRootHash = msg.hash;
        break;
      }
      case "require": {
        const fromRepo = await asyncMerkle.messagesRepo.from(msg.hash);
        if (fromRepo.type === "found") {
          connection.write(Buffer.from(serialize({ type: "provide", block: fromRepo.value })));
        }
        break;
      }
      case "provide": {
        await asyncMerkle.messagesRepo.to(msg.block);
        if (msg.block.type === "leaf") {
          const { senderPublicKey, recipientPublicKey, createdAtEpoch, text, attachments } = JSONB.parse(
            msg.block.data
          );
          store.command.Message(senderPublicKey, recipientPublicKey, createdAtEpoch, text, attachments);
        }
      }
    }
  });
  let connectionAlive = true;
  async function acquire() {
    if (receivedRootHash) {
      for (const hash of (await asyncMerkle.messagesFactory.missing(receivedRootHash)).slice(0, 32)) {
        connection.write(Buffer.from(serialize({ type: "require", hash })));
      }
    }
    if (connectionAlive) setTimeout(acquire, 100);
  }
  async function update() {
    const hash = await asyncMerkle.messagesFactory.to(
      Object.values(store.currentState.messageMap).map((message) => JSONB.stringify(message))
    );
    if (sentRootHash === null || !asyncMerkle.equalsHash(sentRootHash, hash)) {
      connection.write(Buffer.from(serialize({ type: "update", hash })));
      sentRootHash = hash;
    }
    if (connectionAlive) setTimeout(update, 100);
  }
  acquire();
  update();
  connection.on("close", () => {
    connectionAlive = false;
  });
  connection.on("error", () => {
    connectionAlive = false;
  });
});

type Protocol =
  | {
      type: "update";
      hash: asyncMerkle.Hash;
    }
  | {
      type: "require";
      hash: asyncMerkle.Hash;
    }
  | {
      type: "provide";
      block: asyncMerkle.MessageBlock;
    };

function serialize(msg: Protocol): string {
  return JSONB.stringify(msg);
}

function deserialize(msg: string): Protocol {
  return JSONB.parse(msg);
}
