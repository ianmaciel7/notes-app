import { ObjectSplitButtonControl, type ObjectSplitButtonControlProps } from "./object-split-button";

export type PdfSplitButtonProps = Omit<ObjectSplitButtonControlProps, "type"> & {
  type?: ObjectSplitButtonControlProps["type"];
};

export function PdfSplitButton({
  type = "pdf",
  label = "PDF",
  tone = "red",
  ...props
}: PdfSplitButtonProps) {
  return <ObjectSplitButtonControl type={type} label={label} tone={tone} {...props} />;
}

export const ObjectPdfSplitButton = PdfSplitButton;
