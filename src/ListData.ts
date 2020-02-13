export class ListDataRow {
    constructor(public main: string, public graphic?: string, 
        public secondary?: string, public href?: string) {}
}

export default class ListData {
    constructor(public items: ListDataRow[]) {}
}