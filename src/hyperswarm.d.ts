// import type { Writable, Readable } from "stream";

declare module "hyperswarm" {
  export default Hyperswarm;
  declare class Hyperswarm {
    on(
      event: "connection",
      callback: (connection: Connection, info: PeerInfo) => void
    ): void;
    join(topic: Buffer, options: { server: boolean; client: boolean }): void;
  }
  export type Connection = {
    write(data: Buffer): void;
    on(event: "data", callback: (data: Buffer) => void): void;
    on(event: "error", callback: (error: unknown) => void): void;
    on(event: "close", callback: () => void): void;
    end(): void;
    destroy(): void;
  };
  type PeerInfo = {
    pulicKey: Buffer;
    ban(): void;
  };
}
