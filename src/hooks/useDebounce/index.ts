import React from "react";

export const useDebounce = (v: string, ms: number = 1000) => {
  const [value, setValue] = React.useState("");
  React.useEffect(() => {
    const id = setTimeout(() => {
      setValue(v);
    }, ms);
    return () => clearTimeout(id);
  }, [ms, v]);
  return value;
};
