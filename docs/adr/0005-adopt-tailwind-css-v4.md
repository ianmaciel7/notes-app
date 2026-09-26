# Adopt Tailwind CSS v4

We required a high-performance, modern styling engine with native CSS token theming support. We adopted Tailwind CSS v4 using `@tailwindcss/postcss` and configured CSS `@theme` variables directly in `src/app/globals.css`, eliminating legacy JavaScript configuration files while enabling compile-time stylesheet optimization.
