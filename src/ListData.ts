export class ListDataRow {
    constructor(public main: string, public graphic?: string, 
        public secondary?: string) {}
}

export default class ListData {
    constructor(public items: ListDataRow[]) {}
}