import React from "react";
import { StyleContext } from "../StyleProvider";
import { theme } from "../theme";

export function Icon({ icon }: { icon: keyof typeof theme["icons"] }) {
  const { theme } = React.useContext(StyleContext);
  return <React.Fragment>{theme.icons[icon]}</React.Fragment>;
}
