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

export type AudioSplitButtonProps = ObjectSplitButtonVariantProps;

export function AudioSplitButton({
  type = "audio",
  label = "Áudio",
  variant = "rose",
  onLabelClick,
  options = [],
  onChevronClick,
  size = "md",
  className,
  dropdownAriaLabel = "Object type options",
}: AudioSplitButtonProps) {
  const triggerDisabled = options.length === 0 && !onChevronClick;

  return (
    <ObjectSplitButton size={size} variant={variant}>
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

export const ObjectAudioSplitButton = AudioSplitButton;