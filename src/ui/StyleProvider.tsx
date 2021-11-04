import React from "react";
import { useMediaQuery } from "react-responsive";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./index.css";
import { css } from "styled-components/macro";
import { theme } from "./theme";

type StyleProviderProps = {
  children: React.ReactNode;
};
export function StyleProvider({ children }: StyleProviderProps) {
  const isSmall = useMediaQuery({ query: "(max-width: 600px)" });
  const value = React.useMemo((): StyleContextValue => {
    return { theme, showButtonIcon: true, showButtonLabel: !isSmall };
  }, [isSmall]);
  return (
    <StyleContext.Provider value={value}>{children}</StyleContext.Provider>
  );
}

type StyleContextValue = {
  theme: typeof theme;
  showButtonIcon: boolean;
  showButtonLabel: boolean;
};
export const StyleContext = React.createContext<StyleContextValue>({
  theme: theme,
  showButtonIcon: true,
  showButtonLabel: true,
});
