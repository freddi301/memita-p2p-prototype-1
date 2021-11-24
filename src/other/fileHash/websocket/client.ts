import { LOCAL_RPC_WEBSOCKET_PATH } from "../../../rpc/local/websocket/common";

export async function fileHashClient(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(LOCAL_RPC_WEBSOCKET_PATH, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error();
  const hash = response.text();
  return hash;
}
