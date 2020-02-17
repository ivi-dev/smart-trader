import localForage from 'localforage';
import ListData from './ListData';
import { ChartDescriptor } from './redux/store';
import TableData from './TableData';
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
    EXCHANGE = 'EXCHANGE',
    STOCK = 'STOCK',
    START_LETTER = 'START_LETTER',
    TRACKER_MODE = 'TRACKER_MODE'
}

export default class Storage {
    static orders(orders: TableData) {
        localForage.setItem(Keys.ORDERS, orders);
    }

    static activities(activities: ListData) {
        localForage.setItem(Keys.ACTIVITY, activities);
    }

    static alerts(alerts: AlertData[]) {
        localForage.setItem(Keys.ALERTS, alerts);
    }

    static charts(charts: ChartDescriptor[], 
        callback?: (charts: ChartDescriptor[]) => void) {
        localForage.setItem(Keys.CHARTS, charts).then(charts => {
            if (callback) {
                callback(charts);
            }
        });
    }

    static boxes(boxes: BoxData[]) {
        localForage.setItem(Keys.BOXES, boxes);
    }

    static watchList(watchList: StockData[]) {
        localForage.setItem(Keys.WATCHLIST, watchList);
    }

    static exchange(exchange: {name: string, code: string}) {
        localForage.setItem(Keys.EXCHANGE, exchange);
    }

    static stock(stock: StockData) {
        localForage.setItem(Keys.STOCK, stock);
    }

    static startLetter(letter: string, 
        callback?: (letter: string) => void) {
        localForage.setItem(Keys.START_LETTER, letter).then(letter => {
            if (callback) {
                callback(letter);
            }
        })
    }

    static trackerMode(mode: boolean) {
        localForage.setItem(Keys.TRACKER_MODE, mode);
    }

    static get(key: Keys) {
        return localForage.getItem(key);
    }
}