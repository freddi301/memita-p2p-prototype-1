import React from "react";
import { rootRouting, Routing } from "./Routing";

export function useNavigationStack() {
  const [stack, setStack] = React.useState<Array<Routing>>([]);
  const [lastAction, setLastAction] = React.useState<"push" | "pop">("push");
  const current = stack[stack.length - 1] ?? rootRouting;
  const push = React.useCallback((next: Routing) => {
    setStack((stack) => [...stack, next]);
    setLastAction("push");
  }, []);
  const pop = React.useCallback(() => {
    setStack((stack) => {
      return stack.slice(0, -1);
    });
    setLastAction("pop");
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
  return { push, pop, current, lastAction };
}

export type NavigationStackContextValue = {
  push(next: Routing): void;
  pop(): void;
};

export const NavigationContext = React.createContext<NavigationStackContextValue>(null as any);
