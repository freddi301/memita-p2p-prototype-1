import React from "react";
import { css } from "styled-components/macro";
import { StyleContext } from "../StyleProvider";
import easyqrcodejs from "easyqrcodejs";
import logo from "./ContactQRCodeLogo.svg";

type contactQRCodeProps = { text: string };
export function ContactQRcode({ text }: contactQRCodeProps) {
  const size = 200;
  const { theme } = React.useContext(StyleContext);
  const ref = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    if (ref.current) {
      new easyqrcodejs(ref.current, {
        text,
        logo,
        width: size,
        height: size,
        quietZone: 10,
        colorDark: theme.colors.background.active,
        colorLight: theme.colors.text.primary,
        correctLevel: easyqrcodejs.CorrectLevel.H,
      });
    }
  }, [text, theme.colors.background.active, theme.colors.text.primary, theme.colors.text.secondary]);
  return (
    <div
      ref={ref}
      css={css`
        border-radius: calc(${theme.sizes.vertical} / 2);
        overflow: hidden;
        width: ${size}px;
        height: ${size}px;
      `}
    ></div>
  );
}
