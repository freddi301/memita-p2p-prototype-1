export type Routing =
  | { screen: "home" }
  | {
      screen: "account-list";
    }
  | {
      screen: "create-account";
    }
  | {
      screen: "account";
      publicKey: string;
    }
  | {
      screen: "contact-list";
    }
  | {
      screen: "create-contact";
    }
  | {
      screen: "contact";
      publicKey: string;
    }
  | {
      screen: "conversation";
      otherPublicKey: string;
    }
  | {
      screen: "conversation-list";
    }
  | { screen: "select-account" }
  | {
      screen: "conversation-detail";
      otherPublicKey: string;
    };

export const rootRouting: Routing = { screen: "home" };
