import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faSave,
  faTimes,
  faUser,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";

export const theme = {
  colors: {
    text: {
      primary: "hsl(0, 0%, 80%)",
      secondary: "hsl(0, 0%, 55%)",
    },
    background: {
      passive: "hsl(0, 0%, 15%)",
      active: "hsl(0, 0%, 10%)",
      focus: "hsl(0, 0%, 20%)",
    },
  },
  spacing: {
    text: {
      horizontal: "16px",
      vertical: "8px",
    },
    input: {
      horizontal: "8px",
    },
    gap: "8px",
    border: {
      size: "2.5px",
      radius: "20px",
    },
  },
  font: {
    family: "Roboto",
    size: {
      normal: "16px",
      big: "24px",
    },
    weight: {
      normal: "400",
      bold: "500",
    },
  },
  sizes: {
    row: {
      height: "40px",
    },
  },
  transitions: {
    input: {
      duration: "0.25s",
    },
  },
  icons: {
    CreateAccount: <FontAwesomeIcon icon={faUserPlus} />,
    Cancel: <FontAwesomeIcon icon={faTimes} />,
    Home: <FontAwesomeIcon icon={faHome} />,
    Save: <FontAwesomeIcon icon={faSave} />,
    Account: <FontAwesomeIcon icon={faUser} />,
  },
};
