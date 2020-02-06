export class TableRow {
    constructor(public cells: TableCell[]) {}
}

export class TableCell {
    constructor(public content: string, public classes?: string) {}
}

export default class TableData {
    constructor(public headers: TableCell[], public rows: TableRow[]) {}
}