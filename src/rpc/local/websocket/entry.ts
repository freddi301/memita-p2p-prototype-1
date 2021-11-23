import libsodium from "libsodium-wrappers";

require("source-map-support").install(); // need for node

(async () => {
  await libsodium.ready;
  await import("../../../other/persistance");
  await import("./server");
  await import("../../remote/hyperswarm/node2");

  await import("../../../other/fileHash/websocket/server");
  await import("../../../other/fileSrc/websocket/server");
})();
