import { ipcMain } from "electron";
import { store } from "../../../logic/domain";
import { LOCAL_RCP_ELECTRON_CHANNEL } from "./common";

const subscriptionMap: Record<string, () => void> = {};

ipcMain.on(LOCAL_RCP_ELECTRON_CHANNEL, (event, parsed) => {
  switch (parsed.type) {
    case "command": {
      (store.command as any)[parsed.name](...parsed.args);
      break;
    }
    case "query": {
      subscriptionMap[parsed.id] = (store.query as any)[parsed.name](...parsed.args)((value: any) => {
        event.reply(LOCAL_RCP_ELECTRON_CHANNEL, { id: parsed.id, value });
      });
      break;
    }
    case "unsubscribe": {
      subscriptionMap[parsed.id]?.();
      delete subscriptionMap[parsed.id];
    }
  }
});
