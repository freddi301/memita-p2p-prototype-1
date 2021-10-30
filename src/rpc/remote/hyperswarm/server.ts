import Hyperswarm from "hyperswarm";
import { DateTime } from "luxon";
import { myAccountPublicKey } from "../../../myAccountPublicKey";
import { prisma } from "../../prisma";
import { AccountPublicKey } from "../../local/definition";
import { remoteRpcServerAdapter } from "../adapter";
import { makeRemoteRpcHyperswarmClient } from "./client";

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
  (async () => {
    const other = await remoteRpcHyperswarmClient.whoAreYou(null);
    while (true) {
      const messageToSend = await prisma.message.findFirst({
        where: {
          sender: myAccountPublicKey.toHex(),
          recipient: other.accountPublicKey.toHex(),
          MessageReplication: {
            none: {
              device: other.device,
            },
          },
        },
      });
      if (messageToSend) {
        await remoteRpcHyperswarmClient.replicateMessage({
          sender: AccountPublicKey.fromHex(messageToSend.sender),
          recipient: AccountPublicKey.fromHex(messageToSend.recipient),
          text: messageToSend.text,
          createdAt: DateTime.fromJSDate(messageToSend.createdAt),
        });
        await prisma.messageReplication.create({
          data: {
            hash: messageToSend.hash,
            device: other.device,
            deliveredAt: new Date(),
          },
        });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  })();
});
