import React from "react";
import {
  Avatar,
  Fab,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Box,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import { Add, Cached } from "@mui/icons-material";
import { FixedSizeList } from "react-window";
import { AutoSizer } from "react-virtualized";
import { FullScreenNavigationLayout } from "../components/FullScreenNavigationLayout";
import { useReadRpcCall } from "../data-hooks";
import { AccountPublicKey } from "../../rpc/local/definition";
import { TruncatedLine } from "../components/TruncatedLine";

type ContactScreenProps = {
  onAdd(): void;
  onConversation(accountPublicKey: AccountPublicKey): void;
};
export function ContactsScreen({ onAdd, onConversation }: ContactScreenProps) {
  const contacts = useReadRpcCall(
    "allContacts",
    React.useMemo(
      () => ({
        orderBy: { type: "name-ascending", payload: null },
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
                onClick={() => contacts.reload()}
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
                  itemCount={contacts.response.length}
                  overscanCount={5}
                >
                  {({ index, style }) => {
                    const contact = contacts.response[index];
                    return (
                      <ListItem
                        style={style}
                        key={index}
                        component="div"
                        disablePadding
                      >
                        <ListItemButton
                          onClick={() =>
                            onConversation(contact.accountPublicKey)
                          }
                        >
                          <ListItemAvatar>
                            <Avatar>{contact.name[0].toUpperCase()}</Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={contact.name}
                            secondary={
                              <TruncatedLine
                                text={contact.accountPublicKey.toHex()}
                              />
                            }
                          />
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
        <Fab color="primary" aria-label="add" onClick={onAdd}>
          <Add />
        </Fab>
      </Box>
    </React.Fragment>
  );
}
