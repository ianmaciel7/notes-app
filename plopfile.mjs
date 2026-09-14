import { execSync } from "node:child_process";

export default function (plop) {
  // Helpers
  plop.setHelper("titleCase", (str) =>
    str
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
  );

  // Component & Story Generator
  plop.setGenerator("component", {
    description: "Generate a new component and its Ladle story",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Component name (e.g. space-card):",
      },
      {
        type: "list",
        name: "category",
        message: "Category folder:",
        choices: ["ui", "space", "objects", "editor", "common"],
        default: "ui",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/components/{{category}}/{{dashCase name}}.tsx",
        templateFile: "plop-templates/component.tsx.hbs",
      },
      {
        type: "add",
        path: "src/components/{{category}}/{{dashCase name}}.stories.tsx",
        templateFile: "plop-templates/story.tsx.hbs",
      },
      function updateGraphify() {
        try {
          execSync("graphify update .", { stdio: "inherit" });
          return "Graphify knowledge graph updated.";
        } catch (err) {
          return `Graphify update skipped: ${err.message}`;
        }
      },
    ],
  });
}
