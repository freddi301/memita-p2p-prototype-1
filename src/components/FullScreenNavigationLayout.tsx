import React from "react";

type FullScreenBottomNavigationLayoutProps = {
  top?: React.ReactNode;
  middle?: React.ReactNode;
  bottom?: React.ReactNode;
};
export function FullScreenNavigationLayout({
  top,
  middle,
  bottom,
}: FullScreenBottomNavigationLayoutProps) {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "grid",
        gridTemplateColumns: "100%",
        gridTemplateRows: "min-content 1fr min-content",
      }}
    >
      {top && <div style={{ gridColumn: 1, gridRow: 1 }}>{top}</div>}
      {middle && <div style={{ gridColumn: 1, gridRow: 2 }}>{middle}</div>}
      {bottom && <div style={{ gridColumn: 1, gridRow: 3 }}>{bottom}</div>}
    </div>
  );
}
