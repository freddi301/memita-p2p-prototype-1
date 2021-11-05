import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressBook,
  faEnvelope,
  faFileExport,
  faFileImport,
  faHome,
  faPaperPlane,
  faSave,
  faShareAlt,
  faTimes,
  faUser,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";

const hue = 240;
const saturation = 10;

export const theme = {
  colors: {
    text: {
      primary: `hsl(${hue}, ${saturation}%, 90%)`,
      secondary: `hsl(${hue}, ${saturation}%, 55%)`,
    },
    background: {
      passive: `hsl(${hue}, ${saturation}%, 15%)`,
      active: `hsl(${hue}, ${saturation}%, 10%)`,
      focus: `hsl(${hue}, ${saturation}%, 20%)`,
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
    Share: <FontAwesomeIcon icon={faShareAlt} />,
    Export: <FontAwesomeIcon icon={faFileExport} />,
    Import: <FontAwesomeIcon icon={faFileImport} />,
    Contacts: <FontAwesomeIcon icon={faAddressBook} />,
    CreateContact: <FontAwesomeIcon icon={faUserPlus} />,
    Send: <FontAwesomeIcon icon={faPaperPlane} />,
    Conversation: <FontAwesomeIcon icon={faEnvelope} />,
  },
};
