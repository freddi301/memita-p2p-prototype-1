import { myAccountPublicKey } from "../../myAccountPublicKey";
import { hashMessage } from "../common";
import { prisma } from "../prisma";
import { DescriptionImplementation, ensureRpcInterpreter } from "../framework/rpc-framework";
import { remoteRpcDefinition } from "./definition";

export const remoteRpcInterpreter = <Serialized>(descriptionImplementation: DescriptionImplementation<Serialized>) =>
  ensureRpcInterpreter(descriptionImplementation, remoteRpcDefinition(descriptionImplementation), {
    async replicateMessage({ sender, recipient, text, createdAt }) {
      const hash = hashMessage({ sender, recipient, text, createdAt });
      await prisma.message.upsert({
        where: { hash },
        update: {},
        create: {
          hash,
          sender: sender.toHex(),
          recipient: recipient.toHex(),
          text,
          createdAt: createdAt.toJSDate(),
        },
      });
      return null;
    },
    async whoAreYou() {
      return {
        accountPublicKey: myAccountPublicKey,
        device: "1",
      };
    },
  });
