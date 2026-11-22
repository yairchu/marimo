/* Copyright 2026 Marimo. All rights reserved. */

import { createStore } from "jotai";
import { describe, expect, it } from "vitest";
import {
  configOverridesAtom,
  resolvedMarimoConfigAtom,
  userConfigAtom,
} from "../config";

describe("language server configuration", () => {
  it("suppresses LSP providers only while the server opts out", () => {
    const store = createStore();
    store.set(configOverridesAtom, {
      server: { lsp: false },
      language_servers: { pylsp: { enabled: true } },
      completion: { copilot: "github" },
    });

    expect(store.get(resolvedMarimoConfigAtom).language_servers).toEqual({});
    expect(store.get(resolvedMarimoConfigAtom).completion.copilot).toBe(false);

    store.set(configOverridesAtom, { server: { lsp: false } });
    store.set(userConfigAtom, (config) => ({
      ...config,
      completion: { ...config.completion, copilot: "custom" },
    }));
    expect(store.get(resolvedMarimoConfigAtom).completion.copilot).toBe(
      "custom",
    );
  });
});
