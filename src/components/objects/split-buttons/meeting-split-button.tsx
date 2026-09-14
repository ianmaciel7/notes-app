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

export type MeetingSplitButtonProps = ObjectSplitButtonVariantProps;

export function MeetingSplitButton({
  type = "meeting",
  label = "Reunião",
  tone = "blue",
  onLabelClick,
  options = [],
  onChevronClick,
  size = "md",
  className,
  dropdownAriaLabel = "Object type options",
}: MeetingSplitButtonProps) {
  const triggerDisabled = options.length === 0 && !onChevronClick;

  return (
    <ObjectSplitButton size={size} tone={tone}>
      <ObjectSplitButtonGroup
        aria-label={label || dropdownAriaLabel}
        className={className}
      >
        <ObjectSplitButtonAction
          aria-label={label || undefined}
          onClick={onLabelClick}
          type={type}
        >
          {label && <span>{label}</span>}
        </ObjectSplitButtonAction>
        <ObjectSplitButtonSeparator orientation="vertical" />
        <ObjectSplitButtonTrigger
          aria-label={dropdownAriaLabel}
          disabled={triggerDisabled}
          onClick={onChevronClick}
        />
        <ObjectSplitButtonContent>
          {options.map((option) => (
            <ObjectSplitButtonItem key={option.id} onClick={option.onClick}>
              {option.leadingIcon}
              <span>{option.label}</span>
            </ObjectSplitButtonItem>
          ))}
        </ObjectSplitButtonContent>
      </ObjectSplitButtonGroup>
    </ObjectSplitButton>
  );
}

export const ObjectMeetingSplitButton = MeetingSplitButton;