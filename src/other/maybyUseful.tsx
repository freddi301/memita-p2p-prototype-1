import React from "react";

function useResizeObserver(
  ref: React.MutableRefObject<any>,
  onSizeChange: (size: { width: number; height: number }) => void
) {
  React.useLayoutEffect(() => {
    if (ref.current) {
      const element = ref.current;
      onSizeChange?.({ width: element.clientWidth, height: element.clientHeight });
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          onSizeChange?.({ width, height });
        }
      });
      observer.observe(element);
      return () => {
        observer.unobserve(element);
      };
    }
    return;
  }, [onSizeChange, ref]);
}

function usePrevious<Value>(value: Value) {
  const ref = React.useRef<Value>(value);
  React.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

function stringToUint8Array(string: string) {
  return new TextEncoder().encode(string);
}

function chunkUint8Array(data: Uint8Array, chunkSize: number): Array<Uint8Array> {
  const blockCount = Math.ceil(data.length / chunkSize);
  const chunks: Array<Uint8Array> = [];
  for (let i = 0; i < blockCount; i++) {
    const chunk = data.slice(i * chunkSize, i * chunkSize + chunkSize);
    chunks.push(chunk);
  }
  return chunks;
}

function equalsUint8Array(typedArrayA: Uint8Array, typedArrayB: Uint8Array) {
  if (typedArrayA === typedArrayB) return true;
  if (typedArrayA.byteLength !== typedArrayB.byteLength) return false;
  const dataViewA = new DataView(typedArrayA.buffer);
  const dataViewB = new DataView(typedArrayB.buffer);
  for (let i = 0; i < typedArrayA.byteLength; i++) {
    if (dataViewA.getUint8(i) !== dataViewB.getUint8(i)) return false;
  }
  return true;
}
