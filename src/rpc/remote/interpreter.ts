import {
  DescriptionImplementation,
  ensureRpcInterpreter,
} from "../framework/rpc-framework";
import { remoteRpcDefinition } from "./definition";

export const remoteRpcInterpreter = <Serialized>(
  descriptionImplementation: DescriptionImplementation<Serialized>
) =>
  ensureRpcInterpreter(
    descriptionImplementation,
    remoteRpcDefinition(descriptionImplementation),
    {
      async replicate(text) {
        // TODO
        return null;
      },
    }
  );
