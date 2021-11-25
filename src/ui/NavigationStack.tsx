import React from "react";
import { rootRouting, Routing } from "./Routing";

export function useNavigationStack() {
  const [state, setState] = React.useState<{ stack: Array<Routing>; lastAction: "push" | "pop" }>({
    stack: [rootRouting],
    lastAction: "push",
  });
  const current = state.stack[state.stack.length - 1] as Routing;
  const push = React.useCallback((next: Routing) => {
    setState((state) => ({
      stack: [...state.stack, next],
      lastAction: "push",
    }));
  }, []);
  const pop = React.useCallback(() => {
    setState((state) => ({
      stack: state.stack.length > 1 ? state.stack.slice(0, -1) : state.stack,
      lastAction: "pop",
    }));
  }, []);
  React.useLayoutEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        pop();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [pop]);
  return { push, pop, current, lastAction: state.lastAction };
}

export type NavigationStackContextValue = {
  push(next: Routing): void;
  pop(): void;
};

export const NavigationContext = React.createContext<NavigationStackContextValue>(null as any);
