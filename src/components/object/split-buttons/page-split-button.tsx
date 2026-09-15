import {
  ObjectSplitButton,
  ObjectSplitButtonAction,
  ObjectSplitButtonContent,
  ObjectSplitButtonGroup,
  ObjectSplitButtonItem,
  ObjectSplitButtonSeparator,
  ObjectSplitButtonTrigger,
  type ObjectSplitButtonVariantProps,
} from "./object-split-button";

export type PageSplitButtonProps = ObjectSplitButtonVariantProps;

export function PageSplitButton({
  type = "page",
  label = "Página",
  variant = "blue",
  onLabelClick,
  options = [],
  onChevronClick,
  size = "md",
  className,
  dropdownAriaLabel = "Object type options",
}: PageSplitButtonProps) {
  const triggerDisabled = options.length === 0 && !onChevronClick;

  return (
    <ObjectSplitButton size={size} variant={variant}>
      <ObjectSplitButtonGroup aria-label={label || dropdownAriaLabel} className={className}>
        <ObjectSplitButtonAction aria-label={label || undefined} onClick={onLabelClick} type={type}>
          {label && <span>{label}</span>}
        </ObjectSplitButtonAction>
        <ObjectSplitButtonSeparator orientation="vertical" />
        <ObjectSplitButtonTrigger
          aria-label={dropdownAriaLabel}
          disabled={triggerDisabled}
          onClick={onChevronClick}
        />
        <ObjectSplitButtonContent>
          {options.map(({ id, label, leadingIcon, ...itemProps }) => (
            <ObjectSplitButtonItem key={id} {...itemProps}>
              {leadingIcon}
              <span>{label}</span>
            </ObjectSplitButtonItem>
          ))}
        </ObjectSplitButtonContent>
      </ObjectSplitButtonGroup>
    </ObjectSplitButton>
  );
}

export const ObjectPageSplitButton = PageSplitButton;
