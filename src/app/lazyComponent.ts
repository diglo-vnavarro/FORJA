import type { ComponentType } from "react";

export function lazyComponent<TModule, TKey extends keyof TModule>(
  loader: () => Promise<TModule>,
  exportName: TKey,
) {
  return async () => {
    const module = await loader();
    return { Component: module[exportName] as ComponentType };
  };
}
