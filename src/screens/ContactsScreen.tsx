import React from "react";
import {
  Avatar,
  Fab,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Box,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { FixedSizeList } from "react-window";
import { AutoSizer } from "react-virtualized";
import { FullScreenBottomNavigationLayout } from "../components/FullScreenBottomNavigationLayout";
import { MainBottomNavigation } from "../components/MainBottomNavigation";

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
  return (
    <React.Fragment>
      <FullScreenBottomNavigationLayout
        top={
          <AutoSizer>
            {({ width, height }) => {
              return (
                <FixedSizeList
                  width={width}
                  height={height}
                  itemSize={72}
                  itemCount={contacts.length}
                  overscanCount={5}
                >
                  {({ index, style }) => {
                    const name = contacts[index];
                    return (
                      <ListItem
                        style={style}
                        key={index}
                        component="div"
                        disablePadding
                      >
                        <ListItemButton>
                          <ListItemAvatar>
                            <Avatar>{name[0].toUpperCase()}</Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={name}
                            secondary={"description"}
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

const contacts = ["Pippo", "Pluto", "Paperino"];
