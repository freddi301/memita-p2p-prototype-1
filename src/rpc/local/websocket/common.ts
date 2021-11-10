if (!process.env.PORT) throw new Error("PORT not specified");
export const LOCAL_RPC_WEBSOCKET_PORT = Number(process.env.PORT) + 1;
export const LOCAL_RPC_WEBSOCKET_HOST = "localhost";
