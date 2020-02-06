export enum BoxType {
    ORDER_HISTORY,
    RECENT_ACTIVIY,
    HEADLINES,
    ALERTS
}

export const getBoxType = (type: string) => {
    switch (type.replace('+ ', '')) {
        case 'History':
            return BoxType.ORDER_HISTORY
        case 'Activity':
            return BoxType  .RECENT_ACTIVIY
        case 'Headlines':
            return BoxType.HEADLINES
        default:
            return BoxType.ALERTS
    }
}

export default class BoxData {
    constructor(public id: number, public title: string, public type: BoxType) {

    }
}