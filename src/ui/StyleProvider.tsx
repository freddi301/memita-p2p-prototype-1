import React from "react";
import { useMediaQuery } from "react-responsive";
import { theme } from "./theme";
import "@fontsource/roboto/100.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./index.css";

type StyleContextValue = {
  theme: typeof theme;
  showLeftPanel: boolean;
};
export const StyleContext = React.createContext<StyleContextValue>({
  theme: theme,
  showLeftPanel: true,
});

export function useStyleProvider() {
  const isSmall = useMediaQuery({ query: "(max-width: 600px)" });
  const showLeftPanel = useMediaQuery({ query: "(min-width: 900px)" });
  const value = React.useMemo((): StyleContextValue => {
    return {
      theme,
      showLeftPanel,
    };
  }, [showLeftPanel]);
  return value;
}
