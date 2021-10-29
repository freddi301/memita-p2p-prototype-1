import {
  DescriptionImplementation,
  ensureRpcInterpreter,
} from "../framework/rpc-framework";
import { AccountPublicKey, localRpcDefinition } from "./localRpcDefinition";
import { PrismaClient, Message, Contact } from "@prisma/client";
import { DateTime } from "luxon";

const prisma = new PrismaClient();

export const localRpcInterpreter = <Serialized>(
  descriptionImplementation: DescriptionImplementation<Serialized>
) =>
  ensureRpcInterpreter(
    descriptionImplementation,
    localRpcDefinition(descriptionImplementation),
    {
      async saveContact({ name, accountPublicKey }) {
        await prisma.contact.create({
          data: { name, accountPublicKey: accountPublicKey.toHex() },
        });
        return null;
      },
      async allContacts({ orderBy }) {
        const all = await prisma.contact.findMany({ orderBy: { name: "asc" } });
        return all.map((contact) => {
          return {
            name: contact.name,
            accountPublicKey: AccountPublicKey.fromHex(
              contact.accountPublicKey
            ),
          };
        });
      },
      async contactByAccountPublicKey({ accountPublicKey }) {
        const contact = await prisma.contact.findFirst({
          where: {
            accountPublicKey: accountPublicKey.toHex(),
          },
        });
        if (!contact) throw new Error();
        return {
          name: contact.name,
          accountPublicKey: AccountPublicKey.fromHex(contact.accountPublicKey),
        };
      },
      async allConversations({ myAccountPublicKey, orderBy }) {
        // TODO better performance
        const messages = await prisma.message.findMany({});
        const byConversation: Record<string, Array<Message>> = {};
        for (const message of messages) {
          if (message.sender === myAccountPublicKey.toHex()) {
            const key = message.recipient;
            if (!byConversation[key]) byConversation[key] = [];
            byConversation[key].push(message);
          }
          if (message.recipient === myAccountPublicKey.toHex()) {
            const key = message.sender;
            if (!byConversation[key]) byConversation[key] = [];
            byConversation[key].push(message);
          }
        }
        for (const messages of Object.values(byConversation)) {
          messages.sort(
            (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
          );
        }
        return Promise.all(
          Object.entries(byConversation).map(async ([key, messages]) => {
            const { text, createdAt } = messages[messages.length - 1];
            const contact = (await prisma.contact.findFirst({
              where: {
                accountPublicKey: key,
              },
            })) as Contact;
            return {
              contact: {
                name: contact.name,
                accountPublicKey: AccountPublicKey.fromHex(key),
              },
              lastMessage: {
                text,
                createdAt: DateTime.fromJSDate(createdAt),
              },
              newMessagesCount: 0,
            };
          })
        );
      },
      async sendMessage({ sender, recipient, text, createdAt }) {
        await prisma.message.create({
          data: {
            sender: sender.toHex(),
            recipient: recipient.toHex(),
            text,
            createdAt: createdAt.toJSDate(),
          },
        });
        return null;
      },
      async conversation({ myAccountPublicKey, otherAccountPublicKey }) {
        const messages = await prisma.message.findMany({
          where: {
            OR: [
              {
                sender: myAccountPublicKey.toHex(),
                recipient: otherAccountPublicKey.toHex(),
              },
              {
                sender: otherAccountPublicKey.toHex(),
                recipient: myAccountPublicKey.toHex(),
              },
            ],
          },
          orderBy: {
            createdAt: "asc",
          },
        });
        return messages.map((message) => {
          return {
            sender: AccountPublicKey.fromHex(message.sender),
            recipient: AccountPublicKey.fromHex(message.recipient),
            text: message.text,
            createdAt: DateTime.fromJSDate(message.createdAt),
          };
        });
      },
    }
  );
