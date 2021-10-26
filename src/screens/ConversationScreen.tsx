import { Close, Send } from "@mui/icons-material";
import {
  Paper,
  Stack,
  TextField,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Box,
} from "@mui/material";
import { Cached } from "@mui/icons-material";
import { VariableSizeList } from "react-window";
import { AutoSizer } from "react-virtualized";
import { DateTime } from "luxon";
import React from "react";
import { FullScreenNavigationLayout } from "../components/FullScreenNavigationLayout";
import { doWriteRpcCall, useReadRpcCall } from "../data-hooks";
import { AccountPublicKey } from "../rpc/localRpcDefinition";

export const myAccountPublicKey = AccountPublicKey.fromHex(
  "0000000000000000000000000000000000000000000000000000000000000001"
);

type ConversationScreenProps = {
  recipient: AccountPublicKey;
  onCancel(): void;
};
export function ConversationScreen({
  recipient,
  onCancel,
}: ConversationScreenProps) {
  const contact = useReadRpcCall(
    "contactByAccountPublicKey",
    React.useMemo(() => ({ accountPublicKey: recipient }), [recipient]),
    null
  );
  const conversation = useReadRpcCall(
    "conversation",
    React.useMemo(
      () => ({
        myAccountPublicKey,
        otherAccountPublicKey: recipient,
      }),
      [recipient]
    ),
    []
  );
  const [text, setText] = React.useState("");
  const listRef = React.useRef<VariableSizeList<any>>();
  return (
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
              {contact.response?.name}
            </Typography>
            <Box sx={{ flexGrow: 1 }}></Box>
            <IconButton
              size="large"
              aria-label="display more actions"
              edge="end"
              color="inherit"
              onClick={() => conversation.reload()}
            >
              <Cached />
            </IconButton>
          </Toolbar>
        </AppBar>
      }
      middle={
        <AutoSizer>
          {({ width, height }) => {
            return (
              <VariableSizeList
                ref={listRef as any}
                width={width}
                height={height}
                itemSize={(index) => {
                  const message = conversation.response[index];
                  return message.text.split("\n").length * 24 + 8 + 4;
                }}
                itemCount={conversation.response.length}
                overscanCount={5}
              >
                {({ index, style }) => {
                  const message = conversation.response[index];
                  if (message.recipient.equals(myAccountPublicKey)) {
                    return (
                      <Box key={index} style={style}>
                        <Message
                          type="received"
                          text={message.text}
                          createdAt={message.createdAt}
                        />
                      </Box>
                    );
                  }
                  if (message.sender.equals(myAccountPublicKey)) {
                    return (
                      <Box key={index} style={style}>
                        <Message
                          type="sent"
                          text={message.text}
                          createdAt={message.createdAt}
                        />
                      </Box>
                    );
                  }
                  throw new Error();
                }}
              </VariableSizeList>
            );
          }}
        </AutoSizer>
      }
      bottom={
        <Stack
          direction="row"
          spacing={1}
          alignItems="flex-end"
          sx={{ padding: "8px" }}
        >
          <TextField
            id="text"
            multiline
            fullWidth={true}
            value={text}
            onChange={(event) => {
              setText(event.currentTarget.value);
            }}
          />
          <IconButton
            aria-label="send"
            color="primary"
            onClick={async () => {
              setText("");
              await doWriteRpcCall("sendMessage", {
                sender: myAccountPublicKey,
                recipient,
                text,
                createdAt: DateTime.now(),
              });
              conversation.reload();
              // listRef.current?.scrollToItem(1000000000000, "start");
            }}
          >
            <Send />
          </IconButton>
        </Stack>
      }
    />
  );
}

type MessageProps = {
  type: "sent" | "received";
  text: string;
  createdAt: DateTime;
};
function Message({ type, text, createdAt }: MessageProps) {
  const { elevation, margin } = (() => {
    switch (type) {
      case "sent":
        return { elevation: 1, margin: "4px 8px 4px 40px" };
      case "received":
        return { elevation: 3, margin: "4px 40px 4px 8px" };
      default:
        throw new Error();
    }
  })();
  return (
    <Paper
      elevation={elevation}
      sx={{
        margin,
        padding: "4px 8px",
        whiteSpace: "pre-line",
        wordBreak: "break-word",
      }}
    >
      {text}
    </Paper>
  );
}
