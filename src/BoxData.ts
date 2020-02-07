export enum BoxType {
    ORDER_HISTORY,
    RECENT_ACTIVIY,
    HEADLINES,
    ALERTS
}

export default class BoxData {
    constructor(public id: number, public title: string, public type: BoxType) {

    }

    static getBoxType = (type: string) => {
        if (type.match(/history/i)) {
            return BoxType.ORDER_HISTORY
        } else if (type.match(/activity/i)) {
            return BoxType.RECENT_ACTIVIY;
        } else if (type.match(/headlines/i)) {
            return BoxType.HEADLINES;
        } else if (type.match(/alerts/i)) {
            return BoxType.ALERTS;
        }
        return BoxType.ORDER_HISTORY;
    }

    static getTitle(type: BoxType) {
        switch (type as BoxType) {
            case BoxType.ORDER_HISTORY:
                return 'Order History';
                case BoxType.RECENT_ACTIVIY:
                return 'Recent Activity';
                case BoxType.HEADLINES:
                return 'Headlines';
            default:
                return 'Notifications';
        }
    }
}