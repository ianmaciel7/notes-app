import { ObjectSplitButton, type ObjectSplitButtonProps } from "./object-split-button";

export type PdfSplitButtonProps = Omit<ObjectSplitButtonProps, "type"> & {
  type?: ObjectSplitButtonProps["type"];
};

export function PdfSplitButton({
  type = "pdf",
  label = "PDF",
  tone = "red",
  ...props
}: PdfSplitButtonProps) {
  return <ObjectSplitButton type={type} label={label} tone={tone} {...props} />;
}

export const ObjectPdfSplitButton = PdfSplitButton;
