import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressBook,
  faAngleDoubleDown,
  faAngleLeft,
  faAsterisk,
  faCheck,
  faCommentAlt,
  faEnvelope,
  faFileExport,
  faFileImport,
  faLock,
  faPaperclip,
  faPaperPlane,
  faPlus,
  faQrcode,
  faSave,
  faShareAlt,
  faSmile,
  faTimes,
  faTrash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

export type IconName = keyof typeof theme["icons"];

export const theme = {
  colors: {
    text: {
      primary: `hsl(0, 0%, 90%)`,
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
      small: "14px",
      normal: "16px",
      big: "24px",
    },
    weight: {
      normal: "400",
      bold: "700",
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
    Create: <FontAwesomeIcon icon={faPlus} />,
    Save: <FontAwesomeIcon icon={faSave} />,
    Delete: <FontAwesomeIcon icon={faTrash} />,
    Import: <FontAwesomeIcon icon={faFileImport} />,
    Export: <FontAwesomeIcon icon={faFileExport} />,
    Share: <FontAwesomeIcon icon={faShareAlt} />,
    Account: <FontAwesomeIcon icon={faUser} />,
    Contacts: <FontAwesomeIcon icon={faAddressBook} />,
    Conversation: <FontAwesomeIcon icon={faEnvelope} />,
    Conversations: <FontAwesomeIcon icon={faCommentAlt} />,
    ReadOnly: <FontAwesomeIcon icon={faLock} />,
    Required: <FontAwesomeIcon icon={faAsterisk} />,
    Close: <FontAwesomeIcon icon={faTimes} />,
    UseAccount: <FontAwesomeIcon icon={faCheck} />,
    ScrollToBottom: <FontAwesomeIcon icon={faAngleDoubleDown} />,
    Send: <FontAwesomeIcon icon={faPaperPlane} />,
    Emoji: <FontAwesomeIcon icon={faSmile} />,
    Attachment: <FontAwesomeIcon icon={faPaperclip} />,
    QRCode: <FontAwesomeIcon icon={faQrcode} />,
    Back: <FontAwesomeIcon icon={faAngleLeft} />,
  },
};
