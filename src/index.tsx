import React from "react";
import ReactDOM from "react-dom";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import {
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { Restore, Favorite, Archive } from "@mui/icons-material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

ReactDOM.render(<App />, document.getElementById("root"));

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <MessagesScreen />
      <ContactsScreen />
      <ConversationScreen />
      <ConversationsScreen />
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={"haha"}
          onChange={(event, newValue) => {
            console.log(newValue);
          }}
        >
          <BottomNavigationAction label="Recents" icon={<Restore />} />
          <BottomNavigationAction label="Favorites" icon={<Favorite />} />
          <BottomNavigationAction label="Archive" icon={<Archive />} />
        </BottomNavigation>
      </Paper>
    </ThemeProvider>
  );
}

function ContactsScreen() {
  return (
    <div>
      <h1>Contacts</h1>
      <ul>
        <li>Pippo</li>
        <li>Pluto</li>
        <li>Frederik</li>
      </ul>
    </div>
  );
}

function ConversationScreen() {
  return (
    <div>
      <h2>Pippo</h2>
      <p style={{ textAlign: "right", backgroundColor: "green" }}>hello</p>
      <p style={{ textAlign: "left" }}>hello</p>
      <p style={{ textAlign: "right", backgroundColor: "lightgreen" }}>
        how are you?
      </p>
      <p style={{ textAlign: "left" }}>bad</p>
      <p style={{ textAlign: "left" }}>bitch</p>
    </div>
  );
}

function ConversationsScreen() {
  return (
    <div>
      <h2>Conversations</h2>
      <ul>
        <li>
          <h3>Pippo</h3>
          <p>bitch</p>
        </li>
        <li>
          <h3>Alice</h3>
          <p>amore</p>
        </li>
        <li>
          <h3>Frederik</h3>
          <p>bella</p>
        </li>
        <li>
          <h3>Pluto</h3>
          <p>woff woff</p>
        </li>
      </ul>
    </div>
  );
}

function MessagesScreen() {
  return (
    <div>
      <h2>Messages</h2>
      <ul>
        <li>
          <h3>Pippo</h3>
          <p>bitch</p>
        </li>
        <li>
          <h3>Pippo</h3>
          <p>bitch</p>
        </li>
        <li>
          <h3>Pippo</h3>
          <p>eo</p>
        </li>
        <li>
          <h3>Pluto</h3>
          <p>woff woff</p>
        </li>
      </ul>
    </div>
  );
}
