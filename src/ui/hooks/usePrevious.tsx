import React from "react";

export function usePrevious<Value>(value: Value) {
  const ref = React.useRef<Value>(value);
  React.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
