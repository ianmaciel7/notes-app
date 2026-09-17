/** @type {import('@ladle/react').UserConfig} */
export default {
  addons: {
    theme: {
      enabled: true,
      defaultState: "light",
    },
  },
  stories: "src/**/*.stories.{js,jsx,ts,tsx,mdx}",
  outDir: "build/ladle",
};
