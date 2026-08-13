# Graph Report - notes-app  (2026-08-13)

## Corpus Check
- 269 files · ~163,737 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1080 nodes · 1553 edges · 118 communities (79 shown, 39 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 41 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4f1ff693`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- combobox.tsx
- devDependencies
- sidebar.tsx
- sheet.tsx
- biome.json
- workspace-shell.tsx
- dependencies
- Server-only Data Access Layer
- Persistent Knowledge Graph Pipeline
- menubar.tsx
- compilerOptions
- cn
- Authorized Search Index
- Production CI/CD Pipeline Proposal
- components.json
- Maintaining AGENTS.md
- Knowledge Object Model Change
- item.tsx
- Agent Loop Engineering Contract
- context-menu.tsx
- drawer.tsx
- carousel.tsx
- field.tsx
- Vitest
- alert-dialog.tsx
- chart.tsx
- toast.tsx
- Main Agent Loop
- attachment.tsx
- questionnaire.tsx
- Vitest Concurrency and Parallelism
- In-App Knowledge Base
- Workspace Visual Experience Specification
- toggle-group.tsx
- navigation-menu.tsx
- progress.tsx
- Agent Governance Pipeline
- Knowledge Graph Interface
- OpenSpec Apply Change
- OPSX Continue Workflow
- Spec-Driven Workspace Foundation Change
- pagination.tsx
- table.tsx
- Software and OpenSpec Verification Separation
- shadcn Composition Requirement
- breadcrumb.tsx
- utils.ts
- empty.tsx
- page.tsx
- bubble.tsx
- message.tsx
- button.tsx
- scripts
- alert.tsx
- tabs.tsx
- @biomejs/biome
- input-otp.tsx
- marker.tsx
- tailwindcss
- OpenSpec Onboarding
- Measure Before Context Infrastructure
- Pull Request Quality Gates
- AI Trust Boundaries
- Phased Implementation Order
- Spec-Driven Workspace Navigation Change
- Space Data Segregation
- File Document Icon
- Window Icon
- Harness Engineering
- MCP Connections
- Vitest Expect API
- Verification Engineering Design
- Main Agent as Loop Controller
- Help as Product Surface
- Vercel Logo Mark
- Codex MCP and Plugin Configuration Parity
- OpenSpec Requirements Lifecycle
- Vitest Describe API
- Semantic Versioning and Release Tags
- OIDC Workload Identity Federation
- Accessible Workspace Interactions
- Editorial Productivity UI
- Canonical Verification Command
- Spec-Driven Agent Configuration Change
- Safe Object Creation
- Justified Optional Architecture Patterns
- Relationship Context Panels
- Keyboard and Document Navigation
- Workspace Onboarding Proposal
- Space Isolation
- postcss.config.mjs
- Protected Branch Workflow
- Intelligent Delta Spec Merge
- Collections Search Calendar Change Metadata
- Competitive Reference Audit Change Metadata
- Data Portability Offline Quality Change Metadata
- Complete Object Action Surface
- Workspace Visual Experience Change Metadata
- Globe Icon
- Next.js Wordmark
- check-graphify.mjs
- Graphify Infrastructure
- @tailwindcss/postcss
- package.json
- hover-card.tsx
- @testing-library/dom
- rules/graphify.md
- workflows/graphify.md
- @testing-library/jest-dom
- GEMINI.md
- @types/node
- @types/react
- typescript
- @vitest/coverage-v8

## God Nodes (most connected - your core abstractions)
1. `cn()` - 361 edges
2. `Button()` - 17 edges
3. `compilerOptions` - 16 edges
4. `scripts` - 14 edges
5. `Persistent Knowledge Graph Pipeline` - 10 edges
6. `buttonVariants` - 9 edges
7. `Server-only Data Access Layer` - 9 edges
8. `includes` - 8 edges
9. `Graphify Infrastructure` - 8 edges
10. `Seven-document Codebase Contract` - 8 edges

## Surprising Connections (you probably didn't know these)
- `Unverified Deployment Trigger` --semantically_similar_to--> `Deployment Automation Non-goal`  [INFERRED] [semantically similar]
  docs/DEPLOYMENT.md → openspec/changes/add-production-ci-cd-pipeline/proposal.md
- `Three-dimensional OpenSpec Verification` --semantically_similar_to--> `Software and OpenSpec Verification Separation`  [INFERRED] [semantically similar]
  .agents/workflows/opsx-verify.md → docs/TESTING.md
- `Production CI/CD Pipeline Proposal` --conceptually_related_to--> `CodeQL Security Pipeline`  [EXTRACTED]
  openspec/changes/add-production-ci-cd-pipeline/proposal.md → .github/workflows/security.yml
- `High-impact Human Gates` --conceptually_related_to--> `Protected Branch Delivery Workflow`  [INFERRED]
  AGENTS.md → CONTRIBUTING.md
- `Canonical Verification Command` --conceptually_related_to--> `Native Build Allowlist`  [INFERRED]
  openspec/specs/verification-harness/spec.md → pnpm-workspace.yaml

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Agent Governance Control Flow** — _agents_skills_agent_governance_skill_semantic_intent_classification, _agents_skills_agent_governance_skill_governance_policy, _agents_skills_agent_governance_skill_tool_level_governance, _agents_skills_agent_governance_skill_audit_trail [EXTRACTED 1.00]
- **Agent Loop Safety Contract** — openspec_changes_archive_2026_08_11_improve_agent_loop_engineering_design_main_agent_loop_controller, openspec_changes_archive_2026_08_11_improve_agent_loop_engineering_specs_agent_loop_engineering_spec_separate_verification, openspec_changes_archive_2026_08_11_improve_agent_loop_engineering_specs_agent_loop_engineering_spec_bounded_retries, openspec_changes_archive_2026_08_11_improve_agent_loop_engineering_specs_agent_loop_engineering_spec_human_gates [EXTRACTED 1.00]
- **Agentic Evaluation Refinement Flow** — _agents_skills_agentic_eval_skill_agentic_evaluation_patterns, _agents_skills_agentic_eval_skill_basic_reflection, _agents_skills_agentic_eval_skill_evaluator_optimizer, _agents_skills_agentic_eval_skill_code_specific_reflection [EXTRACTED 1.00]
- **AI Assistant Trust Contract** — openspec_changes_define_ai_assistant_specs_ai_assistant_spec_context_aware_conversation, openspec_changes_define_ai_assistant_specs_ai_assistant_spec_ai_trust_boundaries, openspec_changes_define_ai_assistant_specs_ai_assistant_spec_ai_input_safety, openspec_changes_define_ai_assistant_design_confirm_persistent_changes [EXTRACTED 1.00]
- **CI Quality Gate Jobs** — _github_workflows_ci_split_ci_pipeline, _github_workflows_ci_quality_gate, docs_testing_coverage_as_quality_signal, contributing_required_quality_check [EXTRACTED 1.00]
- **Codebase Knowledge Document Set** — _agents_skills_acquire_codebase_knowledge_assets_templates_stack_stack_template, _agents_skills_acquire_codebase_knowledge_assets_templates_structure_structure_template, _agents_skills_acquire_codebase_knowledge_assets_templates_architecture_architecture_template, _agents_skills_acquire_codebase_knowledge_assets_templates_conventions_conventions_template, _agents_skills_acquire_codebase_knowledge_assets_templates_integrations_integrations_template, _agents_skills_acquire_codebase_knowledge_assets_templates_testing_testing_template, _agents_skills_acquire_codebase_knowledge_assets_templates_concerns_concerns_template [EXTRACTED 1.00]
- **Collections Search Calendar Discovery Surfaces** — openspec_changes_define_collections_search_calendar_specs_collections_and_views_spec_saved_configurable_views, openspec_changes_define_collections_search_calendar_specs_search_and_calendar_spec_search_and_calendar, openspec_changes_define_collections_search_calendar_specs_search_and_calendar_spec_authorized_search_index [EXTRACTED 1.00]
- **Competitive Evidence Safety Model** — openspec_changes_define_competitive_reference_audit_design_evidence_classification, openspec_changes_define_competitive_reference_audit_specs_competitive_reference_audit_spec_consequential_action_safety, openspec_changes_define_competitive_reference_audit_specs_competitive_reference_audit_spec_reference_audit [EXTRACTED 1.00]
- **Graph Engineering Capabilities** — _agents_skills_graph_orchestrator_assets_banner_nodes, _agents_skills_graph_orchestrator_assets_banner_edges, _agents_skills_graph_orchestrator_assets_banner_schema, _agents_skills_graph_orchestrator_assets_banner_memory, _agents_skills_graph_orchestrator_assets_banner_routing [EXTRACTED 1.00]
- **Graphify Extraction and Analysis Pipeline** — _agents_skills_graphify_skill_structural_extraction, _agents_skills_graphify_skill_semantic_extraction, _agents_skills_graphify_skill_community_analysis, _agents_skills_graphify_skill_graph_health_check [EXTRACTED 1.00]
- **Harness Reliability Surfaces** — _agents_skills_harness_engineering_skill_harness_engineering, _agents_skills_harness_engineering_skill_failure_memory, _agents_skills_harness_engineering_skill_drift_checks [EXTRACTED 1.00]
- **Object-First Onboarding Journey** — openspec_changes_define_workspace_onboarding_education_design_object_first_methodology, openspec_changes_define_workspace_onboarding_education_design_progressive_education, openspec_changes_define_workspace_onboarding_education_specs_workspace_onboarding_education_spec_guided_first_object_journey, openspec_changes_define_workspace_onboarding_education_specs_workspace_onboarding_education_spec_onboarding_progress_dismissal [EXTRACTED 1.00]
- **OpenSpec Change Lifecycle** — _agents_skills_openspec_explore_skill_openspec_explore, _agents_skills_openspec_new_change_skill_openspec_new_change, _agents_skills_openspec_continue_change_skill_openspec_continue_change, _agents_skills_openspec_apply_change_skill_openspec_apply_change, _agents_skills_openspec_verify_change_skill_openspec_verify_change, _agents_skills_openspec_archive_change_skill_openspec_archive_change [EXTRACTED 1.00]
- **OPSX Change Lifecycle** — _agents_workflows_opsx_explore_opsx_explore, _agents_workflows_opsx_new_opsx_new, _agents_workflows_opsx_continue_opsx_continue, _agents_workflows_opsx_apply_opsx_apply, _agents_workflows_opsx_archive_opsx_archive [EXTRACTED 1.00]
- **Plugin Discovery Evidence Pipeline** — _agents_skills_find_plugins_skill_read_only_federated_discovery, _agents_skills_find_plugins_skill_official_source_priority, _agents_skills_find_plugins_skill_plugin_deduplication, _agents_skills_find_plugins_skill_provenance_first_ranking, _agents_skills_find_plugins_references_trust_model_trust_provenance_safety_model [EXTRACTED 1.00]
- **Protected Server Operation Flow** — openspec_changes_define_nextjs_server_architecture_specs_nextjs_server_architecture_spec_focused_server_actions, openspec_changes_define_nextjs_server_architecture_specs_nextjs_server_architecture_spec_authorization_near_data, openspec_changes_define_nextjs_server_architecture_specs_nextjs_server_architecture_spec_minimal_safe_return_data [EXTRACTED 1.00]
- **Reference Parity Evidence System** — openspec_changes_define_workspace_visual_experience_design_live_reference_evidence, openspec_changes_define_workspace_visual_experience_tasks_side_by_side_browser_evidence, openspec_changes_define_workspace_visual_experience_specs_workspace_visual_experience_spec_capacities_authority, openspec_changes_define_workspace_visual_experience_specs_workspace_visual_experience_spec_interaction_state_parity [EXTRACTED 1.00]
- **Space Isolation and Transfer Contract** — openspec_changes_define_workspace_spaces_design_spaces_data_boundary, openspec_changes_define_workspace_spaces_design_explicit_cross_space_transfer, openspec_changes_define_workspace_spaces_specs_workspace_spaces_spec_space_data_segregation, openspec_changes_define_workspace_spaces_specs_workspace_spaces_spec_cross_space_transfer, openspec_changes_define_workspace_spaces_specs_workspace_spaces_spec_space_scoped_operations [EXTRACTED 1.00]
- **Specialist Agent Review Roles** — _agents_agents_architect_agent_architect, _agents_agents_code_reviewer_agent_code_reviewer, _agents_agents_security_reviewer_agent_security_reviewer, _agents_agents_test_engineer_agent_test_engineer [EXTRACTED 1.00]
- **Typed Object Domain Contract** — openspec_changes_define_knowledge_object_model_specs_knowledge_object_model_spec_typed_extensible_objects, openspec_changes_define_knowledge_object_model_specs_knowledge_object_model_spec_editable_type_metadata, openspec_changes_define_knowledge_object_model_specs_knowledge_object_model_spec_schema_versioning_and_migration, openspec_changes_define_knowledge_object_model_specs_knowledge_object_model_spec_durable_authorized_mutations [EXTRACTED 1.00]
- **Verification Harness Change Artifacts** — openspec_changes_archive_2026_08_11_add_verification_harness_design_verification_engineering, openspec_changes_archive_2026_08_11_add_verification_harness_proposal_verification_harness_change, openspec_changes_archive_2026_08_11_add_verification_harness_specs_verification_harness_spec_verification_harness, openspec_changes_archive_2026_08_11_add_verification_harness_tasks_verification_harness_tasks [EXTRACTED 1.00]
- **Vitest Advanced Testing Capabilities** — _agents_skills_vitest_references_advanced_environments_test_environments, _agents_skills_vitest_references_advanced_projects_vitest_projects, _agents_skills_vitest_references_advanced_type_testing_type_testing, _agents_skills_vitest_references_advanced_vi_vi_utilities [EXTRACTED 1.00]
- **Workspace Foundation Contract** — openspec_changes_define_workspace_foundation_design_shadcn_first_composition, openspec_changes_define_workspace_foundation_design_feature_owned_styling, openspec_changes_define_workspace_foundation_design_action_contracts, openspec_changes_define_workspace_foundation_specs_workspace_foundation_spec_theme_viewport_support [EXTRACTED 1.00]
- **Portable Resilient Workspace Controls** — openspec_changes_define_data_portability_offline_quality_specs_settings_and_portability_spec_portable_export_manifest, openspec_changes_define_data_portability_offline_quality_specs_settings_and_portability_spec_access_revocation, openspec_changes_define_data_portability_offline_quality_specs_offline_sync_and_quality_spec_tenant_safe_observability [INFERRED 0.85]
- **Risk Proportional Completion Evidence** — openspec_specs_agent_loop_engineering_spec_main_agent_loop, openspec_specs_verification_harness_spec_canonical_verification_command, openspec_specs_verification_harness_spec_risk_proportional_verification, openspec_changes_define_workspace_visual_experience_design_evidence_state_parity [INFERRED 0.85]
- **Vitest CI Feedback Pipeline** — _agents_skills_vitest_references_core_cli_command_line_interface, _agents_skills_vitest_references_features_concurrency_concurrency_parallelism, _agents_skills_vitest_references_features_coverage_code_coverage, _agents_skills_vitest_references_features_reporters_reporters [INFERRED 0.85]
- **Connected Object Experience** — openspec_changes_define_knowledge_object_model_specs_knowledge_object_model_spec_typed_extensible_objects, openspec_changes_define_relations_graph_discovery_specs_relations_and_graph_spec_typed_relationships_and_backlinks, openspec_changes_define_relations_graph_discovery_specs_relations_and_graph_spec_context_panels, openspec_changes_define_relations_graph_discovery_specs_relations_and_graph_spec_interactive_graph, openspec_changes_define_rich_object_editor_specs_rich_object_editor_spec_editable_object_metadata [INFERRED 0.95]
- **OpenSpec Change Lifecycle Workflows** — _agents_workflows_opsx_onboard_openspec_onboarding_cycle, _agents_workflows_opsx_propose_openspec_proposal_workflow, _agents_workflows_opsx_sync_intelligent_delta_spec_merge, _agents_workflows_opsx_update_coherent_artifact_revision, _agents_workflows_opsx_verify_three_dimensional_verification [INFERRED 0.95]
- **Repository Agent Governance Contract** — openspec_specs_agent_loop_engineering_spec_agent_loop_engineering, openspec_specs_repository_governance_spec_repository_governance, openspec_specs_verification_harness_spec_verification_harness [INFERRED 0.95]
- **Secure Production Delivery Controls** — contributing_production_promotion, docs_deployment_environment_promotion_flow, docs_deployment_oidc_workload_identity_federation, security_secrets_policy, docs_deployment_rollback_policy [INFERRED 0.95]
- **Vitest Core Test DSL** — _agents_skills_vitest_references_core_describe_describe_api, _agents_skills_vitest_references_core_test_api_test_api, _agents_skills_vitest_references_core_expect_expect_api, _agents_skills_vitest_references_core_hooks_lifecycle_hooks [INFERRED 0.95]

## Communities (118 total, 39 thin omitted)

### Community 0 - "combobox.tsx"
Cohesion: 0.05
Nodes (38): ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxContent(), ComboboxEmpty(), ComboboxGroup(), ComboboxInput() (+30 more)

### Community 1 - "devDependencies"
Cohesion: 0.15
Nodes (13): babel-plugin-react-compiler, jsdom, devDependencies, babel-plugin-react-compiler, jsdom, @testing-library/react, @types/react-dom, @vitejs/plugin-react (+5 more)

### Community 2 - "sidebar.tsx"
Cohesion: 0.06
Nodes (35): Input(), SheetContent(), SheetDescription(), SheetHeader(), SheetTitle(), Sidebar(), SidebarContent(), SidebarContext (+27 more)

### Community 3 - "sheet.tsx"
Cohesion: 0.29
Nodes (5): Sheet(), SheetClose(), SheetFooter(), SheetOverlay(), SheetTrigger()

### Community 4 - "biome.json"
Cohesion: 0.05
Nodes (38): source, assist, actions, css, parser, next, react, files (+30 more)

### Community 5 - "workspace-shell.tsx"
Cohesion: 0.09
Nodes (15): Popover(), PopoverContent(), PopoverDescription(), PopoverHeader(), PopoverTitle(), PopoverTrigger(), ScrollArea(), ScrollBar() (+7 more)

### Community 6 - "dependencies"
Cohesion: 0.05
Nodes (37): @base-ui/react, class-variance-authority, clsx, cmdk, date-fns, embla-carousel-react, input-otp, lucide-react (+29 more)

### Community 7 - "Server-only Data Access Layer"
Cohesion: 0.07
Nodes (34): Architect Agent, Code Reviewer Agent, Security Reviewer Agent, Test Engineer Agent, Browser Evidence Rule, Next.js App Router Architecture, Route Handlers, Server Actions and Server Functions (+26 more)

### Community 8 - "Persistent Knowledge Graph Pipeline"
Cohesion: 0.06
Nodes (33): Agentic Evaluation Patterns, Basic Reflection, Code-Specific Reflection, Evaluator-Optimizer, Structured Critique, Graph Engineering, Graph Work Batch Sizing, Fan-In Flattening Failure Mode (+25 more)

### Community 9 - "menubar.tsx"
Cohesion: 0.09
Nodes (26): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuPortal(), DropdownMenuRadioGroup() (+18 more)

### Community 10 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, **/*.ts (+20 more)

### Community 11 - "cn"
Cohesion: 0.07
Nodes (39): Accordion(), AccordionContent(), AccordionItem(), AccordionTrigger(), AspectRatio(), Avatar(), AvatarBadge(), AvatarFallback() (+31 more)

### Community 12 - "Authorized Search Index"
Cohesion: 0.08
Nodes (26): AI Assistant Implementation Tasks, AI Action Confirmation Boundary, Collections Search Calendar Design, Derived Search Indexes, Collections Search Calendar Proposal, Collections and Views Specification, Saved Configurable Views, Authorized Search Index (+18 more)

### Community 13 - "Production CI/CD Pipeline Proposal"
Cohesion: 0.09
Nodes (24): Dependency Update Automation, Quality Aggregate Gate, Split CI Pipeline, CodeQL Security Pipeline, Canonical Agent Configuration, High-impact Human Gates, Production Runtime Scaling, Staging Runtime Scaling (+16 more)

### Community 14 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 15 - "Maintaining AGENTS.md"
Cohesion: 0.10
Nodes (21): CLAUDE.md Compatibility Symlink, External Reference Index, Instruction Scope and Precedence, Maintaining AGENTS.md, Repository Inspection Before Writing, Evidence-Backed AGENTS.md Decisions, AGENTS.md Source Inventory, AGENTS.md Skill Evaluation (+13 more)

### Community 16 - "Knowledge Object Model Change"
Cohesion: 0.11
Nodes (21): Knowledge Object Model Change Metadata, Typed Object Domain Design, Knowledge Object Model Change, Durable Authorized Object Mutations, Editable Type Metadata, Object Type Schema Versioning and Migration, Typed Extensible Objects, Object Model Implementation Plan (+13 more)

### Community 17 - "item.tsx"
Cohesion: 0.13
Nodes (17): ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, Item(), ItemActions(), ItemContent(), ItemDescription() (+9 more)

### Community 18 - "Agent Loop Engineering Contract"
Cohesion: 0.12
Nodes (17): Verification Harness Change Proposal, Risk-Proportional Completion Evidence, Verification Harness Requirements, Verification Harness Implementation Tasks, Agent Loop Engineering Proposal, Agent Loop Engineering Contract, Bounded Retry and No-Progress Detection, High-Impact Human Gates (+9 more)

### Community 19 - "context-menu.tsx"
Cohesion: 0.12
Nodes (9): ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut(), ContextMenuSubTrigger() (+1 more)

### Community 20 - "drawer.tsx"
Cohesion: 0.14
Nodes (10): DrawerContent(), DrawerContext, DrawerContextProps, DrawerDescription(), DrawerFooter(), DrawerHeader(), DrawerOverlay(), DrawerSwipeHandle() (+2 more)

### Community 21 - "carousel.tsx"
Cohesion: 0.19
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 22 - "field.tsx"
Cohesion: 0.16
Nodes (12): Field(), FieldContent(), FieldDescription(), FieldError(), FieldGroup(), FieldLabel(), FieldLegend(), FieldSeparator() (+4 more)

### Community 23 - "Vitest"
Cohesion: 0.17
Nodes (13): TDD Backpressure, Red Green Refactor, Service Handler, Service Spec, Typed Service Contracts, Vitest Skill Generation Info, Vitest Browser Mode, Vitest Test Environments (+5 more)

### Community 24 - "alert-dialog.tsx"
Cohesion: 0.15
Nodes (9): AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogMedia(), AlertDialogOverlay() (+1 more)

### Community 25 - "chart.tsx"
Cohesion: 0.21
Nodes (11): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), getPayloadConfigFromPayload(), INITIAL_DIMENSION (+3 more)

### Community 26 - "toast.tsx"
Cohesion: 0.15
Nodes (7): toast, ToastAction(), ToastClose(), ToastContent(), ToastDescription(), ToastTitle(), ToastViewport()

### Community 27 - "Main Agent Loop"
Cohesion: 0.18
Nodes (12): OpenSpec Configuration, Spec Driven Schema, Agent Loop Engineering Specification, Agent Human Gates, Main Agent Loop, Canonical Repository Ownership, Component Discovery Before Custom UI, Repository Governance Specification (+4 more)

### Community 28 - "attachment.tsx"
Cohesion: 0.20
Nodes (11): Attachment(), AttachmentAction(), AttachmentActions(), AttachmentContent(), AttachmentDescription(), AttachmentGroup(), AttachmentMedia(), attachmentMediaVariants (+3 more)

### Community 29 - "questionnaire.tsx"
Cohesion: 0.15
Nodes (16): buttonVariants, Questionnaire(), QuestionnaireActions(), QuestionnaireChoice(), QuestionnaireChoiceDescription(), QuestionnaireChoices(), QuestionnaireDescription(), QuestionnaireError() (+8 more)

### Community 30 - "Vitest Concurrency and Parallelism"
Cohesion: 0.20
Nodes (11): Vitest Command Line Interface, Vitest Configuration, Vitest Test API, Vitest Benchmarking, Tinybench, Vitest Concurrency and Parallelism, Vitest Test Context and Fixtures, Vitest Code Coverage (+3 more)

### Community 31 - "In-App Knowledge Base"
Cohesion: 0.18
Nodes (11): Support Feedback and Knowledge Base Proposal, Community Feedback Loop, Feedback Privacy and Triage Metadata, In-App Knowledge Base, Support and Feedback Tasks, Spec-Driven Workspace Onboarding Change, Object-First Methodology, Progressive Workspace Education (+3 more)

### Community 32 - "Workspace Visual Experience Specification"
Cohesion: 0.22
Nodes (10): Evidence State Parity, Live Reference Evidence, Workspace Visual Experience Design, Workspace Visual Experience Proposal, Capacities Reference Authority, Interaction State Parity, Measured Workspace Visual Tokens, Workspace Visual Experience Specification (+2 more)

### Community 33 - "toggle-group.tsx"
Cohesion: 0.43
Nodes (5): ToggleGroup(), ToggleGroupContext, ToggleGroupItem(), Toggle(), toggleVariants

### Community 34 - "navigation-menu.tsx"
Cohesion: 0.22
Nodes (9): NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem(), NavigationMenuLink(), NavigationMenuList(), NavigationMenuPositioner(), NavigationMenuTrigger() (+1 more)

### Community 35 - "progress.tsx"
Cohesion: 0.33
Nodes (5): Progress(), ProgressIndicator(), ProgressLabel(), ProgressTrack(), ProgressValue()

### Community 36 - "Agent Governance Pipeline"
Cohesion: 0.28
Nodes (9): Agent Governance Pipeline, Append-only Audit Trail, Agent Framework Governance Integration, Risk-matched Governance Levels, Governance Policy, Most-restrictive Policy Composition, Semantic Intent Classification, Tool-level Governance Decorator (+1 more)

### Community 37 - "Knowledge Graph Interface"
Cohesion: 0.31
Nodes (9): Graph Edges, Graph Engineering Banner, Graph Orchestrator Mascot, Graph Query, Knowledge Graph Interface, Graph Memory, Graph Nodes, Graph Routing (+1 more)

### Community 38 - "OpenSpec Apply Change"
Cohesion: 0.28
Nodes (9): OpenSpec Apply Change, OpenSpec Archive Change, OpenSpec Bulk Archive Change, OpenSpec Continue Change, OpenSpec Fast Forward Change, OpenSpec Propose, Delta Spec Merge, OpenSpec Sync Specs (+1 more)

### Community 39 - "OPSX Continue Workflow"
Cohesion: 0.28
Nodes (9): OPSX Apply Workflow, OPSX Archive Workflow, Verified Spec Sync Before Archive, OPSX Bulk Archive Workflow, Artifact Dependency Order, OPSX Continue Workflow, OPSX Explore Workflow, OPSX Fast Forward Workflow (+1 more)

### Community 40 - "Spec-Driven Workspace Foundation Change"
Cohesion: 0.22
Nodes (9): Spec-Driven Workspace Foundation Change, Workspace Action Contracts, Feature-Owned Workspace Styling, shadcn-First Composition, Action Interaction Contract, Spec-Driven Workspace Spaces Change, Explicit Cross-Space Transfer, Spaces as Primary Data Boundary (+1 more)

### Community 41 - "pagination.tsx"
Cohesion: 0.22
Nodes (7): Pagination(), PaginationContent(), PaginationEllipsis(), PaginationLink(), PaginationLinkProps, PaginationNext(), PaginationPrevious()

### Community 42 - "table.tsx"
Cohesion: 0.22
Nodes (8): Table(), TableBody(), TableCaption(), TableCell(), TableFooter(), TableHead(), TableHeader(), TableRow()

### Community 43 - "Software and OpenSpec Verification Separation"
Cohesion: 0.25
Nodes (8): OpenSpec Onboarding Cycle, OpenSpec Proposal Workflow, Planning-only Boundary, Coherent Planning Artifact Revision, Three-dimensional OpenSpec Verification, Minimal Agent Loop, Risk-matched Definition of Done, Software and OpenSpec Verification Separation

### Community 44 - "shadcn Composition Requirement"
Cohesion: 0.25
Nodes (8): Workspace Foundation Proposal, shadcn Composition Requirement, Theme and Viewport Support, Workspace Foundation Tasks, Workspace Navigation Proposal, Focus and Responsive Navigation, Persistent Workspace Shell, Workspace Navigation Tasks

### Community 45 - "breadcrumb.tsx"
Cohesion: 0.25
Nodes (7): Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator()

### Community 46 - "utils.ts"
Cohesion: 0.22
Nodes (5): Badge(), badgeVariants, Checkbox(), ResizableHandle(), ResizablePanelGroup()

### Community 47 - "empty.tsx"
Cohesion: 0.29
Nodes (7): Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle()

### Community 49 - "bubble.tsx"
Cohesion: 0.38
Nodes (6): Bubble(), BubbleContent(), BubbleGroup(), BubbleReactions(), bubbleReactionsVariants, bubbleVariants

### Community 50 - "message.tsx"
Cohesion: 0.29
Nodes (6): Message(), MessageAvatar(), MessageContent(), MessageFooter(), MessageGroup(), MessageHeader()

### Community 51 - "button.tsx"
Cohesion: 0.20
Nodes (8): Button(), Calendar(), CalendarDayButton(), MessageScroller(), MessageScrollerButton(), MessageScrollerContent(), MessageScrollerItem(), MessageScrollerViewport()

### Community 52 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, dev, format, format:check, graphify:check, graphify:update, lint (+6 more)

### Community 53 - "alert.tsx"
Cohesion: 0.40
Nodes (5): Alert(), AlertAction(), AlertDescription(), AlertTitle(), alertVariants

### Community 54 - "tabs.tsx"
Cohesion: 0.40
Nodes (5): Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger()

### Community 56 - "input-otp.tsx"
Cohesion: 0.40
Nodes (3): InputOTP(), InputOTPGroup(), InputOTPSlot()

### Community 57 - "marker.tsx"
Cohesion: 0.50
Nodes (4): Marker(), MarkerContent(), MarkerIcon(), markerVariants

### Community 59 - "OpenSpec Onboarding"
Cohesion: 0.50
Nodes (4): OpenSpec Explore, OpenSpec New Change, OpenSpec Onboarding, OpenSpec Verify Change

### Community 60 - "Measure Before Context Infrastructure"
Cohesion: 0.50
Nodes (4): Agent Context Efficiency Audit, Context Reduction Hierarchy, Measure Before Context Infrastructure, Native Search Selection

### Community 61 - "Pull Request Quality Gates"
Cohesion: 0.67
Nodes (4): CI Deployment Boundary, Pull Request Quality Gates, CI Security Validation, Production CI/CD Pipeline Tasks

### Community 62 - "AI Trust Boundaries"
Cohesion: 0.50
Nodes (4): AI Assistant Trust Boundary Proposal, AI Input Modes and Mutation Safety, AI Trust Boundaries, Context-Aware AI Conversation

### Community 63 - "Phased Implementation Order"
Cohesion: 0.50
Nodes (4): Phased Implementation Order, Competitive Workspace Roadmap Design, Competitive Workspace Roadmap Specification, Competitive Workspace Roadmap Tasks

### Community 64 - "Spec-Driven Workspace Navigation Change"
Cohesion: 0.50
Nodes (4): Spec-Driven Workspace Navigation Change, Persistent Structural Navigation, Stable Document Context, Tabs and Contextual Panels

### Community 65 - "Space Data Segregation"
Cohesion: 0.50
Nodes (4): Workspace Spaces Proposal, Space Data Segregation, Space-Scoped Search Graph AI and Export, Space-Scoped Object Type Schemas

### Community 66 - "File Document Icon"
Cohesion: 0.50
Nodes (4): File Document Icon, Document Text Lines, Folded Document Corner, Neutral Gray Interface Glyph

### Community 67 - "Window Icon"
Cohesion: 0.67
Nodes (4): Application Window Frame, Neutral Gray Icon Style, Window Control Indicators, Window Icon

### Community 69 - "Harness Engineering"
Cohesion: 0.67
Nodes (3): Harness Drift Checks, Failure Memory, Harness Engineering

### Community 70 - "MCP Connections"
Cohesion: 0.67
Nodes (3): MCP Connections, Smithery CLI, Smithery Token Scoping

### Community 71 - "Vitest Expect API"
Cohesion: 0.67
Nodes (3): Vitest Expect API, Vitest Mocking, Vitest Snapshot Testing

### Community 72 - "Verification Engineering Design"
Cohesion: 0.67
Nodes (3): Spec-Driven Verification Harness Change, Component-Level Testing Decision, Verification Engineering Design

### Community 73 - "Main Agent as Loop Controller"
Cohesion: 0.67
Nodes (3): Spec-Driven Agent Loop Change, Main Agent as Loop Controller, Shallow Least-Privilege Delegation

### Community 74 - "Help as Product Surface"
Cohesion: 0.67
Nodes (3): Support and Feedback Change Metadata, Help as Product Surface, Optional Community Integrations

### Community 75 - "Vercel Logo Mark"
Cohesion: 0.67
Nodes (3): Upward-Pointing Triangle, Vercel Logo Mark, White Monochrome Glyph

### Community 104 - "check-graphify.mjs"
Cohesion: 0.20
Nodes (10): fail(), failures, graphDir, graphPath, htmlPath, manifestPath, readJson(), reportPath (+2 more)

### Community 105 - "Graphify Infrastructure"
Cohesion: 0.22
Nodes (8): Agent Integrations, Failure Behavior, Graphify Infrastructure, Maintenance, Semantic Content, Version, Versioned Artifacts, Worktrees

### Community 107 - "package.json"
Cohesion: 0.40
Nodes (4): name, packageManager, private, version

## Knowledge Gaps
- **308 isolated node(s):** `$schema`, `enabled`, `clientKind`, `useIgnoreFile`, `ignoreUnknown` (+303 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **39 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `combobox.tsx`, `sidebar.tsx`, `sheet.tsx`, `workspace-shell.tsx`, `menubar.tsx`, `item.tsx`, `context-menu.tsx`, `drawer.tsx`, `carousel.tsx`, `field.tsx`, `alert-dialog.tsx`, `chart.tsx`, `toast.tsx`, `attachment.tsx`, `questionnaire.tsx`, `toggle-group.tsx`, `navigation-menu.tsx`, `progress.tsx`, `pagination.tsx`, `table.tsx`, `breadcrumb.tsx`, `utils.ts`, `empty.tsx`, `bubble.tsx`, `message.tsx`, `button.tsx`, `alert.tsx`, `tabs.tsx`, `input-otp.tsx`, `marker.tsx`, `hover-card.tsx`?**
  _High betweenness centrality (0.195) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `@tailwindcss/postcss`, `package.json`, `@testing-library/dom`, `@testing-library/jest-dom`, `@types/node`, `@types/react`, `typescript`, `@vitest/coverage-v8`, `@biomejs/biome`, `tailwindcss`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **What connects `$schema`, `enabled`, `clientKind` to the rest of the system?**
  _308 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `combobox.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05272108843537415 - nodes in this community are weakly interconnected._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06342780026990553 - nodes in this community are weakly interconnected._
- **Should `biome.json` be split into smaller, more focused modules?**
  _Cohesion score 0.047619047619047616 - nodes in this community are weakly interconnected._