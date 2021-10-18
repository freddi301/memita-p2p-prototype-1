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
import { MainBottomNavigation } from "../components/MainBottomNavigation";
import { useAllContacts } from "../data-hooks";

type ContactScreenProps = {
  onAdd(): void;
  onConversations(): void;
  onContacts(): void;
};
export function ContactsScreen({
  onAdd,
  onConversations,
  onContacts,
}: ContactScreenProps) {
  const contacts = useAllContacts();
  return (
    <React.Fragment>
      <FullScreenNavigationLayout
        top={
          <AppBar>
            <Toolbar>
              <div style={{ flexGrow: 1 }}></div>
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
                  itemCount={contacts.data.length}
                  overscanCount={5}
                >
                  {({ index, style }) => {
                    if (index === 0) {
                      return (
                        <ListItem
                          style={style}
                          key={index}
                          component="div"
                          disablePadding
                        >
                          <ListItemButton>
                            <ListItemText secondary="Refresh" />
                          </ListItemButton>
                        </ListItem>
                      );
                    }
                    const contact = contacts.data[index - 1];
                    return (
                      <ListItem
                        style={style}
                        key={index}
                        component="div"
                        disablePadding
                      >
                        <ListItemButton>
                          <ListItemAvatar>
                            <Avatar>{contact.name[0].toUpperCase()}</Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={contact.name}
                            secondary={contact.accountPublicKey.toHex()}
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
        bottom={
          <MainBottomNavigation
            selected="contacts"
            onContacts={onContacts}
            onConversations={onConversations}
          />
        }
      />
      <Box sx={{ position: "fixed", bottom: 56 + 16, right: 16 }}>
        <Fab color="primary" aria-label="add" onClick={onAdd}>
          <Add />
        </Fab>
      </Box>
    </React.Fragment>
  );
}
