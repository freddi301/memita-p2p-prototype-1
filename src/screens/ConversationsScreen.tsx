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
  return (
    <React.Fragment>
      <FullScreenNavigationLayout
        top={
          <AppBar position="static">
            <Toolbar>
              <Box sx={{ flexGrow: 1 }}></Box>
              <IconButton
                size="large"
                aria-label="display more actions"
                edge="end"
                color="inherit"
                onClick={() => conversations.reload()}
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
                <FixedSizeList
                  width={width}
                  height={height}
                  itemSize={72}
                  itemCount={conversations.response.length}
                  overscanCount={5}
                >
                  {({ index, style }) => {
                    const conversation = conversations.response[index];
                    return (
                      <ListItem
                        style={style}
                        key={index}
                        component="div"
                        disablePadding
                      >
                        <ListItemButton
                          onClick={() =>
                            onConversation(
                              conversation.contact.accountPublicKey
                            )
                          }
                        >
                          <ListItemAvatar>
                            <Avatar>
                              {conversation.contact.name
                                .slice(0, 1)
                                .toUpperCase()}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={conversation.contact.name}
                            secondary={
                              <TruncatedLine
                                text={conversation.lastMessage.text}
                              />
                            }
                          />
                          <Box>
                            <Badge
                              badgeContent={conversation.newMessagesCount}
                              color="primary"
                            >
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
                  }}
                </FixedSizeList>
              );
            }}
          </AutoSizer>
        }
      />
    </React.Fragment>
  );
}
