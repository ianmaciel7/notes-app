# Enforce Module Boundaries with Dependency Cruiser

We needed automated enforcement of application layering and dependency flow to prevent architectural erosion. We adopted dependency-cruiser configured via `.dependency-cruiser.cjs` to validate module boundaries across `src` and fail builds on circular dependencies.
