import Hyperswarm from "hyperswarm";
import { remoteRpcServerAdapter } from "../adapter";
import { makeRemoteRpcHyperswarmClient } from "./client";
import { replicate } from "./replicate";

const swarm = new Hyperswarm();

const GLOBAL_TOPIC = Buffer.alloc(32).fill("sms-desktop-global-topic");

swarm.join(GLOBAL_TOPIC, {
  server: true,
  client: true,
});

swarm.on("connection", (connection, info) => {
  const remoteRpcHyperswarmClient = makeRemoteRpcHyperswarmClient(connection);
  connection.on("data", (data) => {
    remoteRpcServerAdapter(JSON.parse(data.toString()), (response) => {
      connection.write(Buffer.from(JSON.stringify(response)));
    });
  });
  replicate(remoteRpcHyperswarmClient);
});
