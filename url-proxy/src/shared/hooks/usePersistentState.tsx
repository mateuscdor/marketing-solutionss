import React, { Dispatch, SetStateAction, useState } from "react";

export type UsePersistentStateOptions<Type = any> = {
  defaultValue: Type | (() => Type);
};

export type UsePersistentState<S> = [S, Dispatch<SetStateAction<S>>];
export default function usePersistentState<Type>(
  key: string,
  options: UsePersistentStateOptions<Type>
) {
  const [value, func] = useState<Type>(options.defaultValue);

  return [
    value,
    func as React.Dispatch<React.SetStateAction<Type>>,
  ] as UsePersistentState<Type>;
}
