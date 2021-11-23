import { LOCAL_RPC_WEBSOCKET_PATH } from "../../../rpc/local/websocket/common";

export function fileSrcWebsocket(hash: string) {
  return `${LOCAL_RPC_WEBSOCKET_PATH}/${hash}`;
}
