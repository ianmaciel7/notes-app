"use client";

import dynamic from "next/dynamic";
import * as React from "react";

const INTERACTION_SOUNDS_STORAGE_KEY = "notes-app-interaction-sounds";
const INTERACTION_SOUNDS_VOLUME = 0.45;
const AGENTATION_ENDPOINT = "http://localhost:4747";

const AgentationToolbar = dynamic(() => import("agentation").then((module) => module.Agentation), {
  ssr: false,
});

function shouldEnableInteractionSounds(
  storedPreference: string | null,
  prefersReducedMotion: boolean,
) {
  return storedPreference !== "off" && !prefersReducedMotion;
}

function shouldRenderAgentationToolbar(
  environment = process.env.NODE_ENV,
  agentationEnabled = process.env.NEXT_PUBLIC_AGENTATION_ENABLED,
) {
  return environment === "development" && ["1", "true"].includes(agentationEnabled ?? "");
}

function InteractionSoundBinder() {
  React.useEffect(() => {
    let disposed = false;
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const applySoundPreference = async () => {
      const { bind, setEnabled, setVolume } = await import("cuelume");

      if (disposed) return;

      setVolume(INTERACTION_SOUNDS_VOLUME);
      setEnabled(
        shouldEnableInteractionSounds(
          window.localStorage.getItem(INTERACTION_SOUNDS_STORAGE_KEY),
          reducedMotionQuery.matches,
        ),
      );
      bind();
    };

    const handlePreferenceChange = () => {
      void applySoundPreference();
    };

    void applySoundPreference();
    window.addEventListener("storage", handlePreferenceChange);
    reducedMotionQuery.addEventListener("change", handlePreferenceChange);

    return () => {
      disposed = true;
      window.removeEventListener("storage", handlePreferenceChange);
      reducedMotionQuery.removeEventListener("change", handlePreferenceChange);
    };
  }, []);

  return null;
}

function InteractionSoundTools() {
  return (
    <>
      <InteractionSoundBinder />
      {shouldRenderAgentationToolbar() ? (
        <AgentationToolbar endpoint={AGENTATION_ENDPOINT} />
      ) : null}
    </>
  );
}

export {
  INTERACTION_SOUNDS_STORAGE_KEY,
  InteractionSoundTools,
  shouldEnableInteractionSounds,
  shouldRenderAgentationToolbar,
};
