export enum BoxType {
    ORDER_HISTORY,
    RECENT_ACTIVIY,
    HEADLINES,
    ALERTS
}

export default class BoxData {
    constructor(public id: number, public title: string, public type: BoxType) {

    }
}