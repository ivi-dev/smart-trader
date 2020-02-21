import { ActivityType } from './Activity';

export class ListDataRow {
    constructor(public main: string, 
        public data: ActivityType = 'application', public graphic?: string, 
        public secondary?: string, public href?: string) {}
}

export default class ListData {
    constructor(public items: ListDataRow[]) {}
}