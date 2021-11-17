import libsodium from "libsodium-wrappers";

require("source-map-support").install(); // need for node

(async () => {
  await libsodium.ready;
  await import("../../../logic/persistance");
  await import("./main");
  await import("../../remote/hyperswarm/node");

  await import("../../../other/fileDialog/electron/main");
  await import("../../../other/fileHash/electron/main");
  await import("../../../other/fileSrc/electron/main");
})();
