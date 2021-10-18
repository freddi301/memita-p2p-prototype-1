import {
  DescriptionImplementation,
  ensureRpcInterpreter,
} from "./framework/rpc-framework";
import { AccountPublicKey, localRpcDefinition } from "./localRpcDefinition";
import { PrismaClient } from "@prisma/client";
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
        const id = String(Math.random());
        await prisma.contact.create({
          data: { id, name, accountPublicKey: accountPublicKey.toBase64() },
        });
        return null;
      },
      async allContacts({ orderBy }) {
        const all = await prisma.contact.findMany({ orderBy: { name: "asc" } });
        return all.map((contact) => {
          return {
            name: contact.name,
            accountPublicKey: AccountPublicKey.fromBase64(
              contact.accountPublicKey
            ),
          };
        });
      },
      async createDraft({ text }) {
        const id = String(Math.random());
        await prisma.draft.create({
          data: { id, text },
        });
        return { id: id };
      },
      async updateDraft({ id, text }) {
        await prisma.draft.update({
          where: { id },
          data: { text },
        });
        return null;
      },
      async allDrafts({ orderBy }) {
        const all = await prisma.draft.findMany({
          orderBy: { lastUpdate: "desc" },
        });
        return all.map((draft) => {
          return {
            id: draft.id,
            text: draft.text,
            updatedAt: DateTime.fromJSDate(draft.lastUpdate),
          };
        });
      },
      async draftById({ id }) {
        const draft = await prisma.draft.findFirst({
          where: { id },
        });
        if (!draft) throw new Error();
        return {
          id: draft.id,
          text: draft.text,
          updatedAt: DateTime.fromJSDate(draft.lastUpdate),
        };
      },
    }
  );
