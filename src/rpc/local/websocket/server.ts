import { WebSocketServer } from "ws";
import { LOCAL_RPC_WEBSOCKET_PORT } from "./common";
import { store } from "../../../logic/domain";
import { readFile, writeFile, mkdir } from "fs";

const wss = new WebSocketServer({ port: LOCAL_RPC_WEBSOCKET_PORT }, () => {
  console.log(`server started on port ${LOCAL_RPC_WEBSOCKET_PORT}`);
});

wss.on("connection", (ws) => {
  const subscriptionMap: Record<string, () => void> = {};
  ws.on("message", async (message) => {
    const parsed = JSON.parse(message.toString());
    switch (parsed.type) {
      case "command": {
        (store.command as any)[parsed.name](...parsed.args);
        break;
      }
      case "query": {
        subscriptionMap[parsed.id] = (store.query as any)[parsed.name](...parsed.args)((value: any) => {
          ws.send(JSON.stringify({ id: parsed.id, value }));
        });
        break;
      }
      case "unsubscribe": {
        subscriptionMap[parsed.id]?.();
        delete subscriptionMap[parsed.id];
      }
    }
  });
});

if (!process.env["USER_FOLDER"]) throw new Error(`USER_FOLDER not specified`);
const userFolderPath = `user-data/${process.env["USER_FOLDER"]}`;
const userFilePath = `${userFolderPath}/dump.json`;
mkdir(userFolderPath, { recursive: true }, (err) => {
  if (err) throw err;
});
readFile(userFilePath, (error, data) => {
  if (!error) {
    try {
      store.currentState = JSON.parse(data.toString());
    } catch (error) {}
  }
  persist();
});
function persist() {
  writeFile(userFilePath, JSON.stringify(store.currentState, null, 2), () => {
    setTimeout(persist, 1000);
  });
}
