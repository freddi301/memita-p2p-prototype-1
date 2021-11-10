import Hyperswarm from "hyperswarm";
import { store } from "../../../logic/domain";

const swarm = new Hyperswarm();

const GLOBAL_TOPIC = Buffer.alloc(32).fill("sms-desktop-global-topic");

swarm.join(GLOBAL_TOPIC, {
  server: true,
  client: true,
});

swarm.on("connection", (connection, info) => {
  const pushIntervalId = setInterval(() => {
    const serialized = JSON.stringify(store.currentState.messageMap);
    connection.write(Buffer.from(serialized));
  }, 100);
  connection.on("data", (data) => {
    for (const message of Object.values(JSON.parse(data.toString())) as any) {
      store.command.Message(message.senderPublicKey, message.recipientPublicKey, message.createdAtEpoch, message.text);
    }
  });
  connection.on("close", () => {
    clearInterval(pushIntervalId);
  });
  connection.on("error", () => {
    clearInterval(pushIntervalId);
  });
});
