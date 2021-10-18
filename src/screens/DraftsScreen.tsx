import React from "react";
import {
  Fab,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import { Cached, Create } from "@mui/icons-material";
import { FixedSizeList } from "react-window";
import { AutoSizer } from "react-virtualized";
import { FullScreenNavigationLayout } from "../components/FullScreenNavigationLayout";
import { useAllDrafts } from "../data-hooks";

type DraftsScreenProps = {
  onCreate(): void;
  onUpdate(id: string): void;
};
export function DraftsScreen({ onCreate, onUpdate }: DraftsScreenProps) {
  const drafts = useAllDrafts();
  return (
    <React.Fragment>
      <FullScreenNavigationLayout
        top={
          <AppBar position="static">
            <Toolbar>
              <div style={{ flexGrow: 1 }}></div>
              <IconButton
                size="large"
                aria-label="display more actions"
                edge="end"
                color="inherit"
                onClick={() => drafts.reload()}
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
                  itemCount={drafts.data.length}
                  overscanCount={5}
                >
                  {({ index, style }) => {
                    const draft = drafts.data[index];
                    return (
                      <ListItem
                        style={style}
                        key={index}
                        component="div"
                        disablePadding
                        onClick={() => onUpdate(draft.id)}
                      >
                        <ListItemButton>
                          <ListItemText
                            primary={"no recipient"}
                            secondary={
                              draft.text ? (
                                <TruncatedLine
                                  text={draft.text.split("\n")[0]}
                                />
                              ) : (
                                "empty"
                              )
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
        <Fab color="primary" aria-label="add" onClick={onCreate}>
          <Create />
        </Fab>
      </Box>
    </React.Fragment>
  );
}

function TruncatedLine({ text }: { text: string }) {
  return (
    <span style={{ position: "relative", display: "block" }}>
      <span style={{ color: "transparent" }}>X</span>
      <span
        style={{
          display: "block",
          position: "absolute",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          width: "100%",
          top: 0,
        }}
      >
        {text}
      </span>
    </span>
  );
}
