import localForage from 'localforage';
import ListData from '../models/List';
import { Chart } from '../redux/store';
import Table from '../models/Table';
import Alert from '../models/Alert';
import Box from '../models/Box';
import Stock from '../models/Stock';

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
    static orders(orders: Table) {
        localForage.setItem(Keys.ORDERS, orders);
    }

    static activities(activities: ListData) {
        localForage.setItem(Keys.ACTIVITY, activities);
    }

    static balance(balance: number) {
        localForage.setItem(Keys.BALANCE, balance);
    }

    static alerts(alerts: Alert[]) {
        localForage.setItem(Keys.ALERTS, alerts);
    }

    static charts(charts: Chart[], 
        callback?: (charts: Chart[]) => void) {
        localForage.setItem(Keys.CHARTS, charts).then(charts => {
            if (callback) {
                callback(charts);
            }
        });
    }

    static boxes(boxes: Box[]) {
        localForage.setItem(Keys.BOXES, boxes);
    }

    static watchList(watchList: Stock[]) {
        localForage.setItem(Keys.WATCHLIST, watchList);
    }

    static exchange(exchange: {name: string, code: string}) {
        localForage.setItem(Keys.EXCHANGE, exchange);
    }

    static stock(stock: Stock) {
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