import { ActivityType } from './Activity';

export class ListRow {
    constructor(public main: string, 
        public data: ActivityType = 'application', public graphic?: string, 
        public secondary?: string, public href?: string) {}
}

export default class List {
    constructor(public items: ListRow[]) {}
}