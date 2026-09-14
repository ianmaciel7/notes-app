import type { Story, StoryDefault } from "@ladle/react";
import { ArchiveIcon, CopyIcon, DownloadIcon, SaveIcon } from "lucide-react";
import {
  SplitButton,
  SplitButtonAction,
  SplitButtonContent,
  SplitButtonGroup,
  SplitButtonItem,
  SplitButtonSeparator,
  SplitButtonTrigger,
} from "./split-button";

export default {
  title: "UI / Split Button",
} satisfies StoryDefault;

export const Default: Story = () => (
  <SplitButton>
    <SplitButtonGroup aria-label="Save options">
      <SplitButtonAction>
        <SaveIcon aria-hidden="true" />
        Save
      </SplitButtonAction>
      <SplitButtonSeparator orientation="vertical" />
      <SplitButtonTrigger aria-label="More save options" />
      <SplitButtonContent>
        <SplitButtonItem>
          <CopyIcon aria-hidden="true" />
          Save a copy
        </SplitButtonItem>
        <SplitButtonItem>
          <DownloadIcon aria-hidden="true" />
          Export
        </SplitButtonItem>
      </SplitButtonContent>
    </SplitButtonGroup>
  </SplitButton>
);

export const Variants: Story = () => (
  <div className="flex flex-wrap items-center gap-4">
    <SplitButton>
      <SplitButtonGroup aria-label="Archive options">
        <SplitButtonAction variant="outline">
          <ArchiveIcon aria-hidden="true" />
          Archive
        </SplitButtonAction>
        <SplitButtonSeparator orientation="vertical" />
        <SplitButtonTrigger aria-label="More archive options" variant="outline" />
        <SplitButtonContent>
          <SplitButtonItem>Archive selected</SplitButtonItem>
          <SplitButtonItem>Archive all read</SplitButtonItem>
        </SplitButtonContent>
      </SplitButtonGroup>
    </SplitButton>

    <SplitButton>
      <SplitButtonGroup aria-label="Export options">
        <SplitButtonAction variant="secondary">
          <DownloadIcon aria-hidden="true" />
          Export
        </SplitButtonAction>
        <SplitButtonSeparator orientation="vertical" />
        <SplitButtonTrigger aria-label="More export options" variant="secondary" />
        <SplitButtonContent>
          <SplitButtonItem>Export as Markdown</SplitButtonItem>
          <SplitButtonItem>Export as PDF</SplitButtonItem>
        </SplitButtonContent>
      </SplitButtonGroup>
    </SplitButton>
  </div>
);

export const Sizes: Story = () => (
  <div className="flex flex-wrap items-center gap-4">
    <SplitButton>
      <SplitButtonGroup aria-label="Small save options">
        <SplitButtonAction size="sm">Small</SplitButtonAction>
        <SplitButtonSeparator orientation="vertical" />
        <SplitButtonTrigger aria-label="More small save options" size="icon-sm" />
        <SplitButtonContent>
          <SplitButtonItem>Duplicate</SplitButtonItem>
          <SplitButtonItem>Move</SplitButtonItem>
        </SplitButtonContent>
      </SplitButtonGroup>
    </SplitButton>

    <SplitButton>
      <SplitButtonGroup aria-label="Default save options">
        <SplitButtonAction>Default</SplitButtonAction>
        <SplitButtonSeparator orientation="vertical" />
        <SplitButtonTrigger aria-label="More default save options" />
        <SplitButtonContent>
          <SplitButtonItem>Duplicate</SplitButtonItem>
          <SplitButtonItem>Move</SplitButtonItem>
        </SplitButtonContent>
      </SplitButtonGroup>
    </SplitButton>
  </div>
);
