import type { Story } from "@ladle/react";
import { NextIntlClientProvider } from "next-intl";

import { AppSidebarObjectTypeStudio } from "./app-sidebar-object-type-studio";

const messages = {
  workspace: {
    objectTypeStudio: {
      trigger: "Create Object Type",
      title: "Object Type Studio",
      description: "Customize and create object types",
      createOwn: "Create Custom Type",
      basicTypes: "Basic Types",
      intro: {
        title: "Object Types",
        body: "Object types define structures in your workspace.",
        learnMore: "Learn more",
      },
      details: {
        customTitle: "Custom Object Type",
        customDescription: "Define custom attributes",
        learnMore: "Learn more",
        name: "Name",
        namePlaceholder: "e.g. Recipe",
        pluralName: "Plural Name",
        pluralNamePlaceholder: "e.g. Recipes",
        icon: "Icon",
        color: "Color",
        customHint: "Properties can be configured later",
        settings: "Settings",
        settingsDescription: "Edit type settings",
        save: "Save",
        delete: "Delete",
        confirm: "Create Object Type",
        close: "Close",
        properties: "Properties",
        propertyNames: {
          title: "Title",
          description: "Description",
          tags: "Tags",
          notes: "Notes",
          cover: "Cover",
          author: "Author",
          rating: "Rating",
          recommendedBy: "Recommended By",
          medium: "Medium",
        },
        previewHint: "Preview of structure",
        previewDescription: "Preview structure description",
      },
      objectTypes: {
        book: "Book",
        person: "Person",
        area: "Area",
        meeting: "Meeting",
        quote: "Quote",
        definition: "Definition",
        idea: "Idea",
        place: "Place",
        project: "Project",
        organization: "Organization",
        "atomic-note": "Atomic note",
        media: "Media",
        travel: "Travel",
        page: "Page",
        tag: "Tag",
        image: "Image",
        weblink: "Weblink",
        pdf: "PDF",
        audio: "Audio",
        file: "File",
        tweet: "Tweet",
        "ai-chat": "AI chat",
        table: "Table",
        task: "Task",
        query: "Query",
      },
    },
  },
};

export const StudioDialog: Story = () => (
  <NextIntlClientProvider locale="en" messages={messages}>
    <div className="p-4">
      <AppSidebarObjectTypeStudio
        onCreateFromPreset={(presetId) => alert(`Preset selected: ${presetId}`)}
        onCreateCustom={(input) => alert(`Custom created: ${input.singularName}`)}
      />
    </div>
  </NextIntlClientProvider>
);
