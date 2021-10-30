import React from "react";
import {
  AppBar,
  Avatar,
  Badge,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { FixedSizeList } from "react-window";
import { AutoSizer } from "react-virtualized";
import { FullScreenNavigationLayout } from "../components/FullScreenNavigationLayout";
import { Box } from "@mui/system";
import { Cached } from "@mui/icons-material";
import { AccountPublicKey } from "../rpc/local/definition";
import { useReadRpcCall } from "../data-hooks";
import { DateTime } from "luxon";
import { myAccountPublicKey } from "../myAccountPublicKey";
import { TruncatedLine } from "../components/TruncatedLine";
import { isEqual } from "lodash";

type ConversationsScreenProps = {
  onConversation(accountPublicKey: AccountPublicKey): void;
};
export function ConversationsScreen({
  onConversation,
}: ConversationsScreenProps) {
  const conversations = useReadRpcCall(
    "allConversations",
    React.useMemo(
      () => ({
        myAccountPublicKey,
        orderBy: { type: "date-descending", payload: null },
      }),
      []
    ),
    []
  );
  const { reload } = conversations;
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      reload();
    }, 300);
    return () => clearInterval(intervalId);
  }, [reload]);
  return (
    <React.Fragment>
      <FullScreenNavigationLayout
        top={
          <AppBar position="static">
            <Toolbar>
              <Box sx={{ flexGrow: 1 }}></Box>
              {/* <IconButton
                size="large"
                aria-label="display more actions"
                edge="end"
                color="inherit"
                onClick={() => conversations.reload()}
              >
                <Cached />
              </IconButton> */}
            </Toolbar>
          </AppBar>
        }
        middle={
          <AutoSizer>
            {({ width, height }) => {
              return (
                <FixedSizeList
                  width={width}
                  height={height}
                  itemData={{
                    conversations: conversations.response,
                    onConversation,
                  }}
                  itemSize={72}
                  itemCount={conversations.response.length}
                  overscanCount={5}
                >
                  {ConversationItemMemo}
                </FixedSizeList>
              );
            }}
          </AutoSizer>
        }
      />
    </React.Fragment>
  );
}

type ItemData = {
  conversations: Array<{
    contact: { name: string; accountPublicKey: AccountPublicKey };
    lastMessage: { text: string; createdAt: DateTime };
    newMessagesCount: number;
  }>;
  onConversation(accountPublicKey: AccountPublicKey): void;
};
type ConversationItemProps = {
  data: ItemData;
  index: number;
  style: React.CSSProperties;
};
const ConversationItemMemo = React.memo(ConversationItem, isEqual);
function ConversationItem({
  index,
  style,
  data: { conversations, onConversation },
}: ConversationItemProps) {
  const conversation = conversations[index];
  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemButton
        onClick={() => onConversation(conversation.contact.accountPublicKey)}
      >
        <ListItemAvatar>
          <Avatar>{conversation.contact.name.slice(0, 1).toUpperCase()}</Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={conversation.contact.name}
          secondary={<TruncatedLine text={conversation.lastMessage.text} />}
        />
        <Box>
          <Badge badgeContent={conversation.newMessagesCount} color="primary">
            <Stack alignItems="end">
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  fontWeight: 400,
                  fontSize: "0.875rem",
                }}
              >
                {conversation.lastMessage.createdAt.toLocaleString(
                  DateTime.DATE_SHORT
                )}
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  fontWeight: 400,
                  fontSize: "0.875rem",
                }}
              >
                {conversation.lastMessage.createdAt.toLocaleString(
                  DateTime.TIME_WITH_SECONDS
                )}
              </Typography>
            </Stack>
          </Badge>
        </Box>
      </ListItemButton>
    </ListItem>
  );
}
