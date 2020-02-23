import localForage from 'localforage';
import List from '../models/List';
import Table from '../models/Table';
import Alert from '../models/Alert';
import Box from '../models/Box';
import Stock from '../models/Stock';

export enum Key {
    ACTIVITIES = 'ACTIVITY',
    ORDERS = 'ORDERS',
    BALANCE = 'BALANCE',
    ALERTS = 'ALERTS',
    BOXES = 'BOXES',
    WATCHLIST = 'WATCHLIST',
    EXCHANGE = 'EXCHANGE',
    STOCK = 'STOCK',
    STOCK_INDEX = 'STOCK_INDEX'
}

export default class DB {
    static save(key: Key, data: any) {
        localForage.setItem(key, data);
    }

    static fetch(key: Key) {
        return localForage.getItem(key);
    }
}