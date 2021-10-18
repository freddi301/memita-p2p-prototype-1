import { Close, Send } from "@mui/icons-material";
import {
  AppBar,
  Fab,
  IconButton,
  List,
  ListItem,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { FullScreenNavigationLayout } from "../components/FullScreenNavigationLayout";
import { AccountPublicKey } from "../rpc/localRpcDefinition";
import { useDraftEdit } from "../data-hooks";

type CompositionScreenProps = {
  draftId: string;
  onCancel(): void;
  onSend(recipient: AccountPublicKey, text: string): void;
};
export function CompositionScreen({
  draftId,
  onCancel,
  onSend,
}: CompositionScreenProps) {
  const [recipient, setRecipient] = React.useState<AccountPublicKey | null>();
  const draftEdit = useDraftEdit(draftId);
  const canSend = draftEdit.text.trim().length > 0 && recipient;
  return (
    <React.Fragment>
      <FullScreenNavigationLayout
        top={
          <AppBar position="static">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={onCancel}
              >
                <Close />
              </IconButton>
              <Typography variant="h6" component="div">
                Write message
              </Typography>
            </Toolbar>
          </AppBar>
        }
        middle={
          <Box component="form" autoComplete="off">
            <List>
              <ListItem>
                <TextField
                  id="text"
                  label="message"
                  multiline
                  fullWidth={true}
                  value={draftEdit.text}
                  onChange={(event) =>
                    draftEdit.setText(event.currentTarget.value)
                  }
                />
              </ListItem>
            </List>
          </Box>
        }
      />
      <Box sx={{ position: "fixed", bottom: 16, right: 16 }}>
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => {
            if (canSend && recipient) {
              onSend(recipient, draftEdit.text);
            }
          }}
          disabled={!canSend}
        >
          <Send />
        </Fab>
      </Box>
    </React.Fragment>
  );
}
