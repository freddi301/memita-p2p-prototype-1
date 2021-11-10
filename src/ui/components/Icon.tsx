import React from "react";
import { StyleContext } from "../StyleProvider";
import { theme } from "../theme";

type IconName = keyof typeof theme["icons"];

export function Icon({ icon }: { icon: IconName }) {
  const { theme } = React.useContext(StyleContext);
  return <React.Fragment>{theme.icons[icon]}</React.Fragment>;
}
