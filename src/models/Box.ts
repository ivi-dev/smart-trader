export enum BoxType {
    ORDER_HISTORY = 'Orders',
    RECENT_ACTIVITY = 'Activities',
    HEADLINES = 'Headlines',
    ALERTS = 'Notifications'
}

export default class Box {
    menuVisible =  false;
    constructor(public id: number, 
                public title: string, 
                public type: BoxType) {}

    static getBoxType = (type: string) => {
        if (type.match(/history/i)) {
            return BoxType.ORDER_HISTORY
        } else if (type.match(/activity/i)) {
            return BoxType.RECENT_ACTIVITY;
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
                return BoxType.ORDER_HISTORY;
            case BoxType.RECENT_ACTIVITY:
                return BoxType.RECENT_ACTIVITY;
            case BoxType.HEADLINES:
                return BoxType.HEADLINES;
            default:
                return BoxType.ALERTS;
        }
    }
}