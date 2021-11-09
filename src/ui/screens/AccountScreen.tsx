import React from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Textarea } from "../components/Textarea";
import { HeaderContentControlsLayout } from "../components/HeaderContentControlsLayout";
import { Text } from "../components/Text";
import { Icon } from "../components/Icon";
import { ButtonGroup } from "../components/ButtonGroup";
import { css } from "styled-components/macro";
import { StyleContext } from "../StyleProvider";
import { FrontendFacade } from "../../logic/FrontendFacade";

type AccountScreenProps = {
  publicKey: string;
  onCancel(): void;
};

export function AccountScreen({ onCancel, publicKey }: AccountScreenProps) {
  const { theme } = React.useContext(StyleContext);
  const [name, setName] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const account = FrontendFacade.useAccountByPublicKey(publicKey);
  const [isLoaded, setIsLoaded] = React.useState(false);
  React.useEffect(() => {
    if (!isLoaded && account) {
      setName(account.name);
      setNotes(account.notes);
      setIsLoaded(true);
    }
  }, [account, isLoaded]);
  const onSave = React.useCallback(() => {
    FrontendFacade.doUpdateAccount(publicKey, name, notes);
  }, [name, notes, publicKey]);
  return (
    <HeaderContentControlsLayout
      header={<Text text="Account" color="primary" weight="bold" size="big" />}
      content={
        <div
          css={css`
            display: grid;
            grid-auto-flow: row;
            grid-auto-columns: auto;
            padding: ${theme.spacing.text.vertical} ${theme.spacing.text.horizontal};
            row-gap: ${theme.spacing.gap};
          `}
        >
          <Input label="Name" value={name} onChange={setName} />
          <Input label="Public Key" value={"xxx"} />
          <Textarea label="Notes" value={notes} onChange={setNotes} rows={5} />
        </div>
      }
      controls={
        <ButtonGroup>
          <Button label="Share" icon={<Icon icon="Share" />} onClick={() => {}} enabled={false} />
          <Button label="Export" icon={<Icon icon="Export" />} onClick={() => {}} enabled={false} />
          <Button label="Back" icon={<Icon icon="Cancel" />} onClick={onCancel} enabled={true} />
          <Button label="Save" icon={<Icon icon="Save" />} onClick={onSave} enabled={true} />
        </ButtonGroup>
      }
    />
  );
}
