import {
  DescriptionImplementation,
  ensureRpcInterpreter,
} from "./framework/rpc-framework";
import { AccountPublicKey, localRpcDefinition } from "./localRpcDefinition";
import { PrismaClient } from "@prisma/client";

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
          data: { name, accountPublicKey: accountPublicKey.toBase64() },
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
    }
  );
