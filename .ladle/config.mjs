/** @type {import('@ladle/react').UserConfig} */
export default {
  stories: ["src/**/*.stories.@(js|jsx|ts|tsx|mdx)", "docs/**/*.stories.@(js|jsx|ts|tsx|mdx)"],
  defaultStory: "ui--button--default",
  storyOrder: ["components--*", "ui--*", "docs--*", "*"],
  // Ladle reconstructs labels from lowercase IDs. Style only its navigation;
  // do not mutate React's DOM, patch dependencies, or change application CSS.
  appendToHead: `<style>
    .ladle-aside [role="treeitem"] > div { text-transform: capitalize; }
    .ladle-aside [role="tree"] > [title="Ui"] > div { text-transform: uppercase; }
  </style>`,
};
