"use client";

import { useState } from "react";
import type { AllowedSpaceIcon } from "@/lib/validators/space";

function useCreateSpaceFormState() {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<AllowedSpaceIcon>("folder");
  const [error, setError] = useState<string | null>(null);

  return { name, setName, selectedIcon, setSelectedIcon, error, setError };
}

export { useCreateSpaceFormState };
