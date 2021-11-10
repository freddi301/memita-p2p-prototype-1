import libsodium from "libsodium-wrappers";

require("source-map-support").install(); // need for node

(async () => {
  await libsodium.ready;
  await import("./server");
  await import("../../remote/hyperswarm/node");
})();
