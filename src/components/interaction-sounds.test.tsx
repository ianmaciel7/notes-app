import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  shouldEnableInteractionSounds,
  shouldRenderAgentationToolbar,
} from "@/components/interaction-sounds";

describe("interaction sounds", () => {
  it("enables Cuelume unless the user has muted interaction sounds", () => {
    expect(shouldEnableInteractionSounds(null, false)).toBe(true);
    expect(shouldEnableInteractionSounds("off", false)).toBe(false);
    expect(shouldEnableInteractionSounds(null, true)).toBe(false);
  });

  it("adds declarative Cuelume press and release sounds to shared buttons", () => {
    const markup = renderToStaticMarkup(<Button>Save</Button>);

    expect(markup).toContain("data-cuelume-press");
    expect(markup).toContain("data-cuelume-release");
  });

  it("adds declarative Cuelume toggle sounds to shared tabs", () => {
    const markup = renderToStaticMarkup(
      <Tabs defaultValue="notes">
        <TabsList>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
      </Tabs>,
    );

    expect(markup).toContain("data-cuelume-toggle");
  });

  it("keeps Agentation development-only", () => {
    expect(shouldRenderAgentationToolbar("development")).toBe(true);
    expect(shouldRenderAgentationToolbar("production")).toBe(false);
    expect(shouldRenderAgentationToolbar("test")).toBe(false);
  });
});
