import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressBook,
  faEnvelope,
  faFileExport,
  faFileImport,
  faHome,
  faLock,
  faPaperPlane,
  faSave,
  faShareAlt,
  faTimes,
  faUser,
  faUserMinus,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";

export const theme = {
  colors: {
    text: {
      primary: `hsl(0, 0%, 80%)`,
      secondary: `hsl(0, 0%, 55%)`,
    },
    background: {
      passive: `hsl(0, 0%, 10%)`,
      active: `hsl(0, 0%, 5%)`,
      focus: `hsl(0, 0%, 15%)`,
    },
  },
  spacing: {
    text: {
      horizontal: "16px",
      vertical: "8px",
    },
    gap: "8px",
    border: {
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
      normal: "300",
      bold: "500",
    },
  },
  transitions: {
    input: {
      duration: "0.25s",
    },
  },
  sizes: {
    vertical: "40px",
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
    ReadOnly: <FontAwesomeIcon icon={faLock} />,
    DeleteContact: <FontAwesomeIcon icon={faUserMinus} />,
  },
};
