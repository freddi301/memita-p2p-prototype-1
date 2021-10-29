import Hyperswarm from "hyperswarm";

const swarm = new Hyperswarm();

const GLOBAL_TOPIC = Buffer.alloc(32).fill("sms-desktop-global-topic");

swarm.join(GLOBAL_TOPIC, {
  server: true,
  client: true,
});

swarm.on("connection", (connection, info) => {
  // const rpcHyperswarmClient = makeRpcHyperswarmClient(connection);
});

// TODO
