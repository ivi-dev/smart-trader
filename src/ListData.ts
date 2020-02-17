export type ActivityType = 'all' | 'trade' | 'application' | 'other';

export class ListDataRow {
    constructor(public main: string, 
        public type: ActivityType = 'application', public graphic?: string, 
        public secondary?: string, public href?: string) {}
}

export default class ListData {
    constructor(public items: ListDataRow[]) {}
}