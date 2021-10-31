import React from "react";
import { useMediaQuery } from "react-responsive";
import { LargeScreen } from "./large/LargeScreen";
import { SmallScreen } from "./small/SmallScreen";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./index.css";
import { css } from "styled-components/macro";

export function App() {
  const isSmall = useMediaQuery({ query: "(max-width: 600px)" });
  return (
    <div
      css={css`
        font-family: Roboto;
        color: #abb2bf;
      `}
    >
      {isSmall ? <SmallScreen /> : <LargeScreen />}
    </div>
  );
}
