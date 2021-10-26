import React from "react";
import ReactDOM from "react-dom";
import libsodium from "libsodium-wrappers";

(async () => {
  await libsodium.ready;
  const { App } = await import("./App");
  ReactDOM.render(<App />, document.getElementById("root"));
})();
