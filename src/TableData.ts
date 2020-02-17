export type OrderType = 'all' | 'buy' | 'sell';

export class TableRow {
    constructor(public cells: TableCell[], public type: OrderType) {}
}

export class TableCell {
    constructor(public content: string, public classes?: string) {}
}

export default class TableData {
    constructor(public headers: TableCell[], public rows: TableRow[]) {}
}