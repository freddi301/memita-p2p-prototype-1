import React from "react";
import {
  Avatar,
  Badge,
  Fab,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
} from "@mui/material";
import { FixedSizeList } from "react-window";
import { AutoSizer } from "react-virtualized";
import { FullScreenNavigationLayout } from "../components/FullScreenNavigationLayout";
import { Box } from "@mui/system";
import { Create } from "@mui/icons-material";

type ConversationsScreenProps = {
  onCompose(): void;
};
export function ConversationsScreen({ onCompose }: ConversationsScreenProps) {
  return (
    <React.Fragment>
      <FullScreenNavigationLayout
        middle={
          <AutoSizer>
            {({ width, height }) => {
              return (
                <FixedSizeList
                  width={width}
                  height={height}
                  itemSize={72}
                  itemCount={conversations.length}
                  overscanCount={5}
                >
                  {({ index, style }) => {
                    const conversation = conversations[index];
                    return (
                      <ListItem
                        style={style}
                        key={index}
                        component="div"
                        disablePadding
                      >
                        <ListItemButton>
                          <ListItemAvatar>
                            <Avatar>
                              {conversation.contactName[0].toUpperCase()}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={conversation.contactName}
                            secondary={conversation.lastMessageText}
                          />
                          <ListItemSecondaryAction>
                            <Badge badgeContent={4} color="primary">
                              2021-1-1
                            </Badge>
                          </ListItemSecondaryAction>
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
      <Box sx={{ position: "fixed", bottom: 16, right: 16 }}>
        <Fab color="primary" aria-label="add" onClick={onCompose}>
          <Create />
        </Fab>
      </Box>
    </React.Fragment>
  );
}

const conversations = [
  {
    contactName: "Pippo",
    lastMessageText: "Hi",
    lastMessageDate: new Date("2019"),
    newMessageCount: 1,
  },
  {
    contactName: "Pluto",
    lastMessageText: "Hello",
    lastMessageDate: new Date("2020"),
    newMessageCount: 2,
  },
  {
    contactName: "Paperino",
    lastMessageText: "Bye",
    lastMessageDate: new Date("2021"),
    newMessageCount: 3,
  },
];
