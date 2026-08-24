import { Extension } from "@tiptap/core";

const ParagraphSizeExtension = Extension.create({
  name: "paragraphSize",

  addGlobalAttributes() {
    return [
      {
        types: ["paragraph"],
        attributes: {
          size: {
            default: null,
            parseHTML: (element) =>
              element.getAttribute("data-text-size") === "small" ? "small" : null,
            renderHTML: (attributes) =>
              attributes.size === "small"
                ? { "data-text-size": "small" }
                : {},
          },
        },
      },
    ];
  },
});

export { ParagraphSizeExtension };
