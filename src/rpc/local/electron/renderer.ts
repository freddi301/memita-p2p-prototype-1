// window.rendererIpc.subscribe

import { LOCAL_RCP_ELECTRON_CHANNEL } from "./common";

window.rendererIpc.send(LOCAL_RCP_ELECTRON_CHANNEL, {});

const unsubscribe = window.rendererIpc.subscribe(LOCAL_RCP_ELECTRON_CHANNEL, (arg) => {});
