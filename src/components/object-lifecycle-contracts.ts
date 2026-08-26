export const objectLifecycleContractSlots = {
  ObjectAttachmentControl: "object-attachment-control",
  ObjectCaptureSurface: "object-capture-surface",
  ObjectCountBadge: "object-count-badge",
  ObjectCreationMenu: "object-creation-menu",
  ObjectCreationTrigger: "object-creation-trigger",
  ObjectEditorShell: "object-editor-shell",
  ObjectField: "object-field",
  ObjectFieldGroup: "object-field-group",
  ObjectProjectionCard: "object-projection-card",
  ObjectProjectionRow: "object-projection-row",
  ObjectTab: "object-tab",
  ObjectTypeDetailsPanel: "object-type-details-panel",
  ObjectTypeOptionRow: "object-type-option-row",
  ObjectTypePresetCard: "object-type-preset-card",
  ObjectValidationMessage: "object-validation-message",
  CustomObjectTypeForm: "custom-object-type-form",
  EditableObjectBody: "editable-object-body",
  EditableObjectTitle: "editable-object-title",
  ObjectIconTonePreview: "object-icon-tone-preview",
} as const;

export type ObjectLifecycleContractName =
  keyof typeof objectLifecycleContractSlots;
