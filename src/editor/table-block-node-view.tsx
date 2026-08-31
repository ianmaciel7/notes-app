"use client";

import type { NodeViewProps } from "@tiptap/core";
import { NodeViewWrapper } from "@tiptap/react";
import * as React from "react";
import {
  applyTableBlockCommand,
  cellDisplayText,
  cellKey,
  createObjectLinkCellContent,
  createTextCellContent,
  normalizeTableBlock,
  type TableBlockCell,
  type TableBlockCellId,
  type TableBlockCellStyle,
  type TableBlockCommand,
  type TableBlockModel,
} from "./table-block.ts";

type TableSelection = {
  readonly anchorCellId: string;
  readonly focusCellId: string;
};

function selectedCellIds(table: TableBlockModel, selection: TableSelection) {
  const cells = Object.values(table.cells);
  const anchor = cells.find((cell) => cell.id === selection.anchorCellId);
  const focus = cells.find((cell) => cell.id === selection.focusCellId);
  if (!anchor || !focus) return [selection.focusCellId];

  const rowIds = table.rows.map((row) => row.id);
  const columnIds = table.columns.map((column) => column.id);
  const rowStart = Math.min(rowIds.indexOf(anchor.rowId), rowIds.indexOf(focus.rowId));
  const rowEnd = Math.max(rowIds.indexOf(anchor.rowId), rowIds.indexOf(focus.rowId));
  const columnStart = Math.min(
    columnIds.indexOf(anchor.columnId),
    columnIds.indexOf(focus.columnId),
  );
  const columnEnd = Math.max(
    columnIds.indexOf(anchor.columnId),
    columnIds.indexOf(focus.columnId),
  );

  return table.rows
    .slice(rowStart, rowEnd + 1)
    .flatMap((row) =>
      table.columns
        .slice(columnStart, columnEnd + 1)
        .map((column) => table.cells[cellKey(row.id, column.id)]?.id)
        .filter((id): id is TableBlockCellId => Boolean(id)),
    );
}

function nextCell(
  table: TableBlockModel,
  cell: TableBlockCell,
  key: string,
) {
  const rowIndex = table.rows.findIndex((row) => row.id === cell.rowId);
  const columnIndex = table.columns.findIndex(
    (column) => column.id === cell.columnId,
  );
  const nextRow =
    key === "ArrowUp" ? rowIndex - 1 : key === "ArrowDown" ? rowIndex + 1 : rowIndex;
  const nextColumn =
    key === "ArrowLeft"
      ? columnIndex - 1
      : key === "ArrowRight"
        ? columnIndex + 1
        : columnIndex;
  return table.cells[
    cellKey(
      table.rows[Math.min(Math.max(nextRow, 0), table.rows.length - 1)].id,
      table.columns[
        Math.min(Math.max(nextColumn, 0), table.columns.length - 1)
      ].id,
    )
  ];
}

function styleButtonLabel(style: keyof TableBlockCellStyle) {
  if (style === "bold") return "Bold cells";
  if (style === "background") return "Highlight cells";
  return "Align cells";
}

function TableBlockNodeView({ editor, node, updateAttributes }: NodeViewProps) {
  const normalizedTable = normalizeTableBlock(node.attrs.table);
  const [draftTable, setDraftTable] = React.useState(normalizedTable);
  const [selection, setSelection] = React.useState<TableSelection | null>(null);
  const selectionRef = React.useRef<TableSelection | null>(null);
  const tableRef = React.useRef(draftTable);
  const refs = React.useRef(new Map<string, HTMLDivElement>());
  const editable = editor.isEditable;
  const table = draftTable;

  React.useEffect(() => {
    const nextTable = normalizeTableBlock(node.attrs.table);
    tableRef.current = nextTable;
    setDraftTable(nextTable);
  }, [node.attrs.table]);

  React.useEffect(() => {
    tableRef.current = draftTable;
  }, [draftTable]);

  const setTableSelection = React.useCallback((nextSelection: TableSelection) => {
    selectionRef.current = nextSelection;
    setSelection(nextSelection);
  }, []);

  const applyCommand = React.useCallback(
    (command: TableBlockCommand) => {
      const currentTable = tableRef.current;
      if (!currentTable || !editable) return false;
      const result = applyTableBlockCommand(currentTable, command);
      if (!result.ok) return false;
      tableRef.current = result.value.after;
      setDraftTable(result.value.after);
      updateAttributes({ id: result.value.after.id, table: result.value.after });
      return true;
    },
    [editable, updateAttributes],
  );

  if (!table) return null;

  const selectedIds = new Set(
    selection ? selectedCellIds(table, selection) : [],
  );
  const activeCellId = selection?.focusCellId ?? Object.values(table.cells)[0]?.id;
  const activeCell = activeCellId
    ? Object.values(table.cells).find((cell) => cell.id === activeCellId)
    : null;
  const getSelectedOrActiveIds = () => {
    const currentTable = tableRef.current;
    const currentSelection = selectionRef.current;
    if (!currentTable) return [];
    if (currentSelection) {
      return selectedCellIds(currentTable, currentSelection);
    }
    const firstCell = Object.values(currentTable.cells)[0];
    return firstCell ? [firstCell.id] : [];
  };

  const focusCell = (cellId: string) =>
    refs.current.get(cellId)?.focus({ preventScroll: false });

  return (
    <NodeViewWrapper
      as="figure"
      data-slot="table-block-editor"
      data-readonly={!editable || undefined}
      className="table-block-editor"
      contentEditable={false}
    >
      {editable ? (
        <div
          aria-label="Table block controls"
          className="table-block-toolbar"
          role="toolbar"
        >
          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              applyCommand({ type: "insert-row", afterRowId: activeCell?.rowId });
            }}
          >
            + Row
          </button>
          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              applyCommand({
                type: "insert-column",
                afterColumnId: activeCell?.columnId,
              });
            }}
          >
            + Column
          </button>
          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              if (activeCell?.rowId) {
                applyCommand({ type: "delete-row", rowId: activeCell.rowId });
              }
            }}
          >
            Delete row
          </button>
          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              if (activeCell?.columnId) {
                applyCommand({
                  type: "delete-column",
                  columnId: activeCell.columnId,
                });
              }
            }}
          >
            Delete column
          </button>
          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              applyCommand({
                enabled: !table.columnHeader,
                target: "column",
                type: "toggle-header",
              });
            }}
          >
            Header row
          </button>
          {(["bold", "background", "align"] as const).map((style) => (
            <button
              key={style}
              type="button"
              aria-label={styleButtonLabel(style)}
              onMouseDown={(event) => {
                event.preventDefault();
                style === "align"
                  ? applyCommand({
                      align: "center",
                      cellIds: getSelectedOrActiveIds(),
                      type: "align-cells",
                    })
                  : applyCommand({
                      cellIds: getSelectedOrActiveIds(),
                      style:
                        style === "bold"
                          ? { bold: true }
                          : { background: "highlight" },
                      type: "style-cells",
                    });
              }}
            >
              {style === "bold" ? "B" : style === "align" ? "Align" : "Highlight"}
            </button>
          ))}
          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              if (activeCell?.columnId) {
                applyCommand({
                  columnId: activeCell.columnId,
                  direction: "ascending",
                  type: "sort-rows",
                });
              }
            }}
          >
            Sort
          </button>
        </div>
      ) : null}

      <div className="table-block-scroll">
        <table aria-label="Table block" data-table-block-view="">
          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr key={row.id} data-table-row-id={row.id}>
                {table.columns.map((column, columnIndex) => {
                  const cell = table.cells[cellKey(row.id, column.id)];
                  const Tag =
                    (table.columnHeader && rowIndex === 0) ||
                    (table.rowHeader && columnIndex === 0)
                      ? "th"
                      : "td";
                  const isSelected = selectedIds.has(cell.id);
                  const style = cell.style;
                  return (
                    <Tag
                      key={cell.id}
                      data-selected={isSelected || undefined}
                      data-table-cell-id={cell.id}
                      style={{
                        minWidth: column.width ? `${column.width}px` : undefined,
                        textAlign: style?.align,
                      }}
                    >
                      {/* biome-ignore lint/a11y/useSemanticElements: contentEditable table cells need block editing semantics here. */}
                      <div
                        ref={(element) => {
                          if (element) refs.current.set(cell.id, element);
                          else refs.current.delete(cell.id);
                        }}
                        aria-label={`Cell ${rowIndex + 1}, ${columnIndex + 1}`}
                        className="table-block-cell"
                        contentEditable={editable}
                        data-background={style?.background}
                        data-bold={style?.bold || undefined}
                        role="textbox"
                        suppressContentEditableWarning
                        tabIndex={editable ? 0 : -1}
                        onBlur={(event) => {
                          const text = event.currentTarget.innerText.replace(/\n$/, "");
                          applyCommand({
                            cellId: cell.id,
                            content: text.startsWith("@")
                              ? createObjectLinkCellContent(text.slice(1), text.slice(1))
                              : createTextCellContent(text),
                            type: "update-cell",
                          });
                        }}
                        onFocus={() => {
                          if (selectionRef.current?.focusCellId === cell.id) {
                            return;
                          }
                          setTableSelection({
                            anchorCellId: cell.id,
                            focusCellId: cell.id,
                          });
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            event.currentTarget.blur();
                            return;
                          }
                          if (event.ctrlKey || event.metaKey) {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              applyCommand({
                                afterRowId: cell.rowId,
                                type: "insert-row",
                              });
                            }
                            return;
                          }
                          if (!event.key.startsWith("Arrow")) return;
                          event.preventDefault();
                          const target = nextCell(table, cell, event.key);
                          if (!target) return;
                          const current = selectionRef.current;
                          setTableSelection({
                            anchorCellId:
                              event.shiftKey && current
                                ? current.anchorCellId
                                : target.id,
                            focusCellId: target.id,
                          });
                          requestAnimationFrame(() => focusCell(target.id));
                        }}
                      >
                        {cellDisplayText(cell)}
                      </div>
                    </Tag>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </NodeViewWrapper>
  );
}

export { TableBlockNodeView };
