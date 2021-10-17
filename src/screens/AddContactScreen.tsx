import React from "react";
import {
  Box,
  TextField,
  List,
  ListItem,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Fab,
} from "@mui/material";
import { Close, Save } from "@mui/icons-material";

type AddContactScreenProps = {
  onCancel(): void;
  onSave(name: string): void;
};
export function AddContactScreen({ onCancel, onSave }: AddContactScreenProps) {
  const [name, setName] = React.useState("");
  return (
    <React.Fragment>
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
            Add new contact
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="form" autoComplete="off">
        <List>
          <ListItem>
            <TextField
              required={true}
              id="name"
              label="name"
              fullWidth={true}
              value={name}
              onChange={(event) => setName(event.currentTarget.value)}
            />
          </ListItem>
          <ListItem>
            <TextField
              required={true}
              id="id"
              label="id"
              multiline
              maxRows={4}
              fullWidth={true}
            />
          </ListItem>
        </List>
      </Box>
      <Box sx={{ position: "fixed", bottom: 16, right: 16 }}>
        <Fab color="primary" aria-label="add" onClick={() => onSave(name)}>
          <Save />
        </Fab>
      </Box>
    </React.Fragment>
  );
}
