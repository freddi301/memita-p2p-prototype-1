import React from "react";
import { Button } from "../components/Button";
import { HeaderContentControlsLayout } from "../components/HeaderContentControlsLayout";
import { Text } from "../components/Text";
import { Virtuoso } from "react-virtuoso";
import { Clickable } from "../components/Clickable";
import { Icon } from "../components/Icon";
import { ButtonGroup } from "../components/ButtonGroup";
import { css } from "styled-components/macro";
import { StyleContext } from "../StyleProvider";

type AccountListScreenProps = {
  onCreate(): void;
  onHome(): void;
  onAccount(): void;
};
export function AccountListScreen({ onCreate, onHome, onAccount }: AccountListScreenProps) {
  const { theme } = React.useContext(StyleContext);
  return (
    <HeaderContentControlsLayout
      header={<Text text="Accounts" color="primary" weight="bold" size="big" />}
      content={
        <Virtuoso
          style={{ height: "100%" }}
          totalCount={200}
          itemContent={(index) => (
            <Clickable onClick={onAccount}>
              <div
                css={css`
                  display: grid;
                  grid-auto-flow: row;
                  grid-auto-columns: auto;
                  padding: ${theme.spacing.text.vertical} ${theme.spacing.text.horizontal};
                `}
              >
                <Text color="primary" size="normal" weight="bold" text={`Account Name ${index}`} />
                <Text color="secondary" size="normal" weight="normal" text={`xxxx ${index}`} />
              </div>
            </Clickable>
          )}
        />
      }
      controls={
        <ButtonGroup>
          <Button label="Home" icon={<Icon icon="Home" />} onClick={onHome} enabled={true} />
          <Button label="Import" icon={<Icon icon="Import" />} onClick={() => {}} enabled={true} />
          <Button label="Create" icon={<Icon icon="CreateAccount" />} onClick={onCreate} enabled={true} />
        </ButtonGroup>
      }
    />
  );
}
