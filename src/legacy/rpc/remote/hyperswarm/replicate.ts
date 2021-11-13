// import { DateTime } from "luxon";
// import { myAccountPublicKey } from "../../../myAccountPublicKey";
// import { prisma } from "../../prisma";
// import { AccountPublicKey } from "../../local/definition";
// import { RemoteRpcHyperswarmClient } from "./client";

// export async function replicate(remoteRpcHyperswarmClient: RemoteRpcHyperswarmClient) {
//   const other = await remoteRpcHyperswarmClient.whoAreYou(null);
//   while (true) {
//     const messageToSend = await prisma.message.findFirst({
//       where: {
//         sender: myAccountPublicKey.toHex(),
//         recipient: other.accountPublicKey.toHex(),
//         MessageReplication: {
//           none: {
//             device: other.device,
//           },
//         },
//       },
//     });
//     if (messageToSend) {
//       await remoteRpcHyperswarmClient.replicateMessage({
//         sender: AccountPublicKey.fromHex(messageToSend.sender),
//         recipient: AccountPublicKey.fromHex(messageToSend.recipient),
//         text: messageToSend.text,
//         createdAt: DateTime.fromJSDate(messageToSend.createdAt),
//       });
//       await prisma.messageReplication.create({
//         data: {
//           hash: messageToSend.hash,
//           device: other.device,
//           deliveredAt: new Date(),
//         },
//       });
//     } else {
//       await new Promise((resolve) => setTimeout(resolve, 100));
//     }
//   }
// }
