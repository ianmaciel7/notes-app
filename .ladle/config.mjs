/** @type {import('@ladle/react').UserConfig} */
export default {
  stories: ["src/**/*.stories.@(js|jsx|ts|tsx|mdx)", "docs/**/*.stories.@(js|jsx|ts|tsx|mdx)"],
  defaultStory: "docs--architecture--overview",
  storyOrder: ["docs--*", "ui--*", "editor--*", "components--*", "*"],
  appendToHead: `<style>
    .ladle-aside [role="treeitem"] > div { text-transform: capitalize; }
    .ladle-aside [role="tree"] > [title="Ui"] > div { text-transform: uppercase; }
  </style>`,
};
