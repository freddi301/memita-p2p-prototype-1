import { createReadStream } from "fs";

export async function* readFileByChunks(path: string) {
  const chunkSize = 256000;
  for await (const piece_ of createReadStream(path)) {
    const piece = piece_ as Buffer;
    let i = 0;
    for (; i + chunkSize < piece.length; i += chunkSize) {
      yield Uint8Array.from(piece.slice(i, i + chunkSize));
    }
    yield Uint8Array.from(piece.slice(i)); // TODO manage leftover
  }
}
