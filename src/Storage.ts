import localForage from 'localforage';
import { ListDataRow } from './ListData';
import { ORDER_HEADERS, ChartDescriptor } from './redux/store';
import TableData, { TableRow } from './TableData';
import AlertData from './AlertData';
import BoxData from './BoxData';
import StockData from './StockData';

export enum Keys {
    ACTIVITY = 'ACTIVITY',
    ORDERS = 'ORDERS',
    BALANCE = 'BALANCE',
    ALERTS = 'ALERTS',
    CHARTS = 'CHARTS',
    BOXES = 'BOXES',
    WATCHLIST = 'WATCHLIST',
}

export default class Storage {
    static order(row: TableRow, balance: number, 
        callback?: (data: TableData, balance: number) => void) {
        localForage.getItem(Keys.ORDERS).then(orders => {
            let orders_: TableRow[] = [];
            if (orders === null) {
                localForage.setItem(Keys.ORDERS, [row]).then(orders_ => {
                    localForage.setItem(Keys.BALANCE, balance).then(balance => {
                        if (callback) {
                            callback(new TableData(ORDER_HEADERS, orders_), balance);
                        }
                    });
                });
            } else {
                orders_ = (orders as Array<TableRow>).slice();
                orders_.push(row);
                localForage.setItem(Keys.ORDERS, orders_).then(orders_ => {
                    localForage.setItem(Keys.BALANCE, balance).then(balance => {
                        if (callback) {
                            callback(new TableData(ORDER_HEADERS, orders_), balance);
                        }
                    });
                });
            }
        });
    }

    static activity(activity: ListDataRow, callback?: (arg: any) => void) {
        localForage.getItem(Keys.ACTIVITY).then(activities => {
            let activities_: ListDataRow[] = [];
            if (activities === null) {
                localForage.setItem(Keys.ACTIVITY, [activity]).then(activities => {
                    if (callback) {
                        callback(activities);
                    }
                });
            } else {
                activities_ = (activities as Array<ListDataRow>).slice();
                activities_.push(activity);
                localForage.setItem(Keys.ACTIVITY, activities_).then(activities => {
                    if (callback) {
                        callback(activities);
                    }
                });
            }
        });
    }

    static alerts(alerts_: AlertData[], callback?: (alerts: AlertData[]) => void) {
        localForage.setItem(Keys.ALERTS, alerts_).then(alerts => {
            if (callback) {
                callback(alerts);
            }
        });
    }

    static charts(charts: ChartDescriptor[], callback?: (charts: ChartDescriptor[]) => void) {
        localForage.setItem(Keys.CHARTS, charts).then(charts => {
            if (callback) {
                callback(charts);
            }
        });
    }

    static boxes(boxes: BoxData[], callback?: (boxes: BoxData[]) => void) {
        localForage.setItem(Keys.BOXES, boxes).then(boxes => {
            if (callback) {
                callback(boxes);
            }
        })
    }

    static watchList(watchList: StockData[], callback?: (watchList: StockData[]) => void) {
        localForage.setItem(Keys.WATCHLIST, watchList).then(watchList => {
            if (callback) {
                callback(watchList);
            }
        })
    }

    static get(key: Keys) {
        return localForage.getItem(key);
    }
}