/**
 * Capacities Block Editor Domain - Table Model
 * High-performance matrix model for block editor table components.
 */

export interface TableCellStyle {
  bold?: boolean;
  italic?: boolean;
  alignment?: 'left' | 'center' | 'right';
  backgroundColor?: string;
  textColor?: string;
}

export interface TableCell {
  value: string;
  style?: TableCellStyle;
}

export interface TableColumn {
  id: string;
  name: string;
  width?: number;
}

export interface TableData {
  columns: TableColumn[];
  rows: TableCell[][];
}

export class TableBlockModel {
  private columns: TableColumn[];
  private rows: TableCell[][];

  constructor(initialData?: Partial<TableData>) {
    this.columns = initialData?.columns
      : initialData.columns.map((c) => ({ ...c }))
      : [
          {id: 'col_1', name: 'Column 1' },
          {id: 'col_2', name: 'Column 2' },
        ];

    this.rows = initialData?.rows
      : initialData.rows.map((row) => row.map((cell) => ({ ...cell })))
      : [[{ value: '' }, { value: '' }]];
  }

  public getColumns(): TableColumn[] {
    return this.columns.map((c) => ({ ...c }));
  }

  public getRows(): TableCell[][] {
    return this.rows.map((row) => row.map((cell) => ({ ...cell }))));
  }

  public getRowCount(): number {
    return this.rows.length;
  }

  public getColumnCount(): number {
    return this.columns.length;
  }

  public getCellValue(rowIndex: number, colIndex: number): string {
    if (rowIndex < 0 || rowIndex >= this.rows.length) return '';
    const row = this.rows[rowIndex];
    if (!row || colIndex < 0 || colIndex >= row.length) return '';
    return row[colIndex]?.value ?? '';
  }

  public setCellValue(rowIndex: number, colIndex: number, value: string): void {
    if (rowIndex >= 0 && rowIndex < this.rows.length) {
      const row = this.rows[rowIndex];
      if (row && colIndex >= 0 && colIndex < row.length) {
        row[colIndex] = { ...row[colIndex], value };
      }
    }
  }

  public getCellStyle(rowIndex: number, colIndex: number): TableCellStyle | undefined {
    if (rowIndex < 0 || rowIndex >= this.rows.length) return undefined;
    const row = this.rows[rowIndex];
    if (!row || colIndex < 0 || colIndex >= row.length) return undefined;
    return row[colIndex]?.style;
  }

  public setCellStyle(rowIndex: number, colIndex: number, style: TableCellStyle): void {
    if (rowIndex >= 0 && rowIndex < this.rows.length) {
      const row = this.rows[rowIndex];
      if (row && colIndex >= 0 && colIndex < row.length) {
        row[colIndex] = {
          ...row[colIndex],
          style: { ...(row[colIndex]?.style || {}), ...style },
        };
      }
    }
  }

  public insertRow(index?: number): void {
    const targetIndex =
      index === undefined || index < 0 || index > this.rows.length
        ? this.rows.length
        : index;
    const newRow: TableCell[] = Array.from({ length: this.columns.length }, () => ({ value: '' }));
    this.rows.splice(targetIndex, 0, newRow);
  }

  public deleteRow(index: number): boolean {
    if (index < 0 || index >= this.rows.length) return false;
    this.rows.splice(index, 1);
    return true;
  }

  public insertColumn(index?: number, name?: string): void {
    const targetIndex =
      index === undefined || index < 0 || index > this.columns.length
        ? this.columns.length
        : index;
    const newColName = name ||('Column ' + (this.columns.length + 1));
    const newColId = 'col_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    this.columns.splice(targetIndex, 0, { id: newColId, name: newColName });

    for (const row of this.rows) {
      row.splice(targetIndex, 0, { value: '' });
    }
  }

  public deleteColumn(index: number): boolean {
    if (index < 0 || index >= this.columns.length || this.columns.length <= 1) return false;
    this.columns.splice(index, 1);
    for (const row of this.rows) {
      row.splice(index, 1);
    }
    return true;
  }

  public sortRowsByColumn(columnIndex: number, direction: 'asc' | 'desc' = 'asc'): void {
    if (columnIndex < 0 || columnIndex >= this.columns.length) return;
    this.rows.sort((a, b) => {
      const valA = a[columnIndex]?.value ?? '';
      const valB = b[columnIndex]?.value ?? '';
      const cmp = valA.localeCompare(valB, undefined, { numeric: true, sensitivity: 'base' });
      return direction === 'asc' ? cmp : -cmp;
    });
  }

  public toCSV(): string {
    const headerLine = this.columns.map((c) => this.escapeCSV(c.name)).join(',');
    const rowLines = this.rows.map((row) =>
      row.map((cell) => this.escapeCSV(cell.value)).join(',')
    );
    return [headerLine, ...rowLines].join('\n');
  }

  private escapeCSV(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return '"' + value.replace(/"/g, '""') + '"';
    }
    return value;
  }

  public toMarkdown(): string {
    if (this.columns.length === 0) return '';
    const header = '| ' + this.columns.map((c) => c.name).join(' | ') + ' |';
    const separator = '| ' + this.columns.map(() => '---').join(' | ') + ' |';
    const rows = this.rows.map(
      (row) => '| ' + row.map((cell) => cell.value).join(' | ') + ' |'
    );
    return [header, separator, ...rows].join('\n');
  }

  public static parseMarkdownTable(markdown: string): TableBlockModel {
    const lines = markdown
      .trim()
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    if (lines.length === 0) return new TableBlockModel();

    const parseLine = (line: string): string[] => {
      let trimmed = line;
      if (trimmed.startsWith('|')) trimmed = trimmed.substring(1);
      if (trimmed.endsWith('|')) trimmed = trimmed.substring(0, trimmed.length - 1);
      return trimmed.split('|').map((cell) => cell.trim());
    };

    const headerCells = parseLine(lines[0] || '');
    const columns: TableColumn[] = headerCells.map((name, i) => ({
      id: 'col_' + (i + 1),
      name: name || ('solumn ' + (i + 1)),
    }));

    let dataLineStart = 1;
    if (lines.length > 1 && lines[1]?.includes('---')) {
      dataLineStart = 2;
    }

    const rows: TableCell[][] = [];
    for (let i = dataLineStart; i < lines.length; i++) {
      const cellValues = parseLine(lines[i] || '');
      const row: TableCell[] = columns.map((_, colIdx) => ({
        value: cellValues[colIdx] ?? '',
      }));
      rows.push(row);
    }

    return new TableBlockModel({ columns, rows });
  }

  public toJSON(): TableData {
    return {
      columns: this.getColumns(),
      rows: this.getRows(),
    };
  }
}
