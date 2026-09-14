import fs from  fs;

// 1. Update table-model.ts
const tableModelPath = src/lib/editor/table-model.ts;
let tableModelCode = fs.readFileSync(tableModelPath, utf8);
if (!tableModelCode.includes(setTableCellText)) {
  tableModelCode += \nexport function setTableCellText(
  table: TableBlockModel,
  rowId: string,
  columnId: string,
  text: string,
): TableBlockModel {
  const key = cellKey(rowId, columnId);
  const existingCell = table.cells[key];
  if (!existingCell) return table;

  const updatedCell: TableCell = {
    ...existingCell,
    text,
    content: [{ type: text, text }],
  };

  return {
    ...table,
    cells: {
      ...table.cells,
      [key]: updatedCell,
    },
  };
}\n;
  fs.writeFileSync(tableModelPath, tableModelCode, utf8);
  console.log(Updated table-model.ts);
}

// 2. Update document-schema.ts
const docSchemaPath = src/lib/editor/document-schema.ts;
let docSchemaCode = fs.readFileSync(docSchemaPath, utf8);

docSchemaCode = docSchemaCode.replace(
  /export function validateBlockDocument\(doc: unknown\): doc is BlockEditorDocument \{[\s\S]*?\n\}/,
  unction validateNode(node: unknown, depth: number): boolean {
  if (depth > MAX_BLOCK_DOCUMENT_DEPTH) return false;
  if (!node || typeof node !== object) return false;
  const record = node as Record<string, unknown>;
  if (typeof record.type !== string) return false;
  if (record.content !== undefined) {
    if (!Array.isArray(record.content)) return false;
    for (const child of record.content) {
      if (!validateNode(child, depth + 1)) return false;
    }
  }
  return true;
}

export function validateBlockDocument(doc: unknown): doc is BlockEditorDocument {
  if (!doc || typeof doc !== object) return false;
  const record = doc as Record<string, unknown>;
  if (record.schemaVersion !== BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION) return false;
  if (!record.doc || typeof record.doc !== object) return false;
  const innerDoc = record.doc as Record<string, unknown>;
  if (innerDoc.type !== doc || !Array.isArray(innerDoc.content)) return false;
  return innerDoc.content.every((node) => validateNode(node, 1));
}
);

docSchemaCode = docSchemaCode.replace(
  /export function capacitiesDocToSlate\(document: BlockEditorDocument\): unknown\[\] \{[\s\S]*?\n\}/,
  export function capacitiesDocToSlate(document: BlockEditorDocument): unknown[] {
  const convertNode = (node: BlockEditorNode): unknown => {
    if (node.type === text) {
      const result: Record<string, unknown> = { text: node.text ??  };
 if (node.marks) {
 for (const mark of node.marks) {
 result[mark.type] = true;
 if (mark.attrs) {
 Object.assign(result, mark.attrs);
 }
 }
 }
 return result;
 }
 return {
 type: node.type === paragraph ? p : node.type,
 id: node.attrs?.id || createBlockId(),
 ...node.attrs,
 children: node.content ? node.content.map(convertNode) : [{ text:  }],
    };
  };
  return document.doc.content.map(convertNode);
}
);

docSchemaCode = docSchemaCode.replace(
  /export function slateToCapacitiesDoc\(slateNodes: unknown\[\]\): BlockEditorDocument \{[\s\S]*?\n\}/,
  export function slateToCapacitiesDoc(slateNodes: unknown[]): BlockEditorDocument {
  const convertSlateNode = (node: Record<string, unknown>): BlockEditorNode => {
    if (typeof node.text === string) {
      const { text, ...rest } = node;
      const marks: BlockEditorMark[] = [];
      const knownAttrs: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(rest)) {
        if (value === true) {
          marks.push({ type: key });
        } else {
          knownAttrs[key] = value;
        }
      }

      if (Object.keys(knownAttrs).length > 0 && marks.length > 0) {
        marks[0].attrs = knownAttrs;
      }

      return {
        type: text,
        text: text as string,
        ...(marks.length > 0 ? { marks } : {}),
      };
    }
    const { type, id, children, ...restAttrs } = node;
    const childrenArray = Array.isArray(children) ? (children as Record<string, unknown>[]) : [];
    return {
      type: type === p ? paragraph : (type as string) || paragraph,
      attrs: { id: (id as string) || createBlockId(), ...restAttrs },
      content:
        childrenArray.length > 0
          ? childrenArray.map(convertSlateNode)
          : [{ type: text, text:  }],
 };
 };

 const nodes = Array.isArray(slateNodes) ? (slateNodes as Record<string, unknown>[]) : [];
 const content = ensureBlockIds(nodes.map(convertSlateNode));
 return {
 schemaVersion: BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION,
 doc: {
 type: doc,
 content,
 },
 };
}
);

fs.writeFileSync(docSchemaPath, docSchemaCode, utf8);
console.log(Updated document-schema.ts);