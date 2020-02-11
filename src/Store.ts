import localForage from 'localforage';
import { ListDataRow } from './ListData';
import { ORDER_HEADERS } from './redux/store';
import TableData, { TableRow } from './TableData';

export enum Keys {
    ACTIVITY = 'ACTIVITY',
    ORDERS = 'ORDERS'
}

export default class Store {
    static order(row: TableRow, callback?: (arg: any) => void) {
        localForage.getItem(Keys.ORDERS).then(orders => {
            let orders_: TableRow[] = [];
            if (orders === null) {
                localForage.setItem(Keys.ORDERS, [row]).then(() => {
                    if (callback) {
                        localForage.getItem(Keys.ORDERS).then(orders => {
                            callback(new TableData(ORDER_HEADERS, 
                                orders as Array<TableRow>));
                        })
                    }
                });
            } else {
                orders_ = (orders as Array<TableRow>).slice();
                orders_.push(row);
                localForage.setItem(Keys.ORDERS, orders_).then();
            }
            if (callback) {
                callback(new TableData(ORDER_HEADERS, orders_));
            }
        });
    }

    static activity(activity: ListDataRow, callback?: (arg: any) => void) {
        localForage.getItem(Keys.ACTIVITY).then(activities => {
            let activities_: ListDataRow[] = [];
            if (activities === null) {
                localForage.setItem(Keys.ACTIVITY, [activity]).then(() => {
                    if (callback) {
                        localForage.getItem(Keys.ACTIVITY).then(activities => {
                            callback(activities);
                        })
                    }
                });
            } else {
                activities_ = (activities as Array<ListDataRow>).slice();
                activities_.push(activity);
                localForage.setItem(Keys.ACTIVITY, activities_);
            }
            if (callback) {
                callback(activities_);
            }
        });
    }

    static get(key: Keys) {
        return localForage.getItem(key);
    }
}