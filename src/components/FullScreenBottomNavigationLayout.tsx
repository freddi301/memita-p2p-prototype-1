import React from "react";

type FullScreenBottomNavigationLayoutProps = {
  top: React.ReactNode;
  bottom: React.ReactNode;
};
export function FullScreenBottomNavigationLayout({
  top,
  bottom,
}: FullScreenBottomNavigationLayoutProps) {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "grid",
        gridTemplateColumns: "100%",
        gridTemplateRows: "1fr min-content",
      }}
    >
      <div style={{ gridColumn: 1, gridRow: 1 }}>{top}</div>
      <div style={{ gridColumn: 1, gridRow: 2 }}>{bottom}</div>
    </div>
  );
}
