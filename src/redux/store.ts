import { createStore } from 'redux';
import { main } from './reducers';
import IndexData from '../IndexData';
import * as random from '../randomizer';
import ChartData from '../ChartData';
import TableData, { TableCell, TableRow } from '../TableData';
import ListData, { ListDataRow } from '../ListData';
import Alert from '../Alert';
import BoxData, { BoxType } from '../BoxData';
import Store, { Keys } from '../Store';
import * as actions from './actions';

export type ChartType = 'bar' | 'candlestick' | 'line';
export const ORDER_HEADERS = [
    new TableCell('Time'), 
    new TableCell('Stock'), 
    new TableCell('Price'), 
    new TableCell('Amount'), 
    new TableCell('Type')
];

export type Option = {
    name: string | number,
    graphic?: string,
    title?: string,
    data?: string,
    selected?: boolean
}

export type ReportData = {
    orderHistory: TableData,
    activities: ListData,
    headlines: ListData,
    alerts: Alert[]
}

export type ChartDescriptor = {
    id: number,
    type: ChartType,
    source: number,
    resolution: string,
    data: ChartData,
    activeIndex: IndexData
}

export interface State {
    selectedIndex: IndexData | null,
    indicesList: IndexData[],
    searchResultsList: IndexData[],
    watchList: IndexData[],

    chartType: ChartType,
    chartOptions: any,
    chartTypes: Option[],
    chartDataSource: number | string,
    dataSources: Option[],
    chartDataSourceArchive: {source: number | string, 
                             data: ChartData}[],
    resolutionOptions: Option[],
    chartResolution: string,
    indexHistory: ChartData,
    charts: ChartDescriptor[],
    selectedChart: number | null,

    buyButtons: Option[],
    sellButtons: Option[],
    reportButtons: Option[],
    reportData: ReportData,
    boxes: BoxData[],
    selectedBox: number | null,

    balance: number,
    buyQty: number,
    sellQty: number
}

const randomIndices = random.indices(100);
const history = random.indexHistories();

Store.get(Keys.ORDERS).then(orders => { 
    if (orders) {
        store.dispatch(actions.setOrderHistory(
            new TableData(ORDER_HEADERS, (orders as Array<TableRow>))));
    }
});

Store.get(Keys.ACTIVITY).then(rows => { 
    if (rows) {
        store.dispatch(actions.setActivities(
            new ListData(rows as Array<ListDataRow>)));
    }
});

const randomHeadlines = random.headlines(0);
const randomAlerts = random.alerts(0);



export const state: State = {
    selectedIndex: randomIndices[0],
    indicesList: randomIndices,
    searchResultsList: [],
    watchList: [],

    chartType: 'line',
    chartOptions: {
        priceScale: {borderVisible: false},
        layout: {
            backgroundColor: 'transparent',
            textColor: 'rgba(255, 255, 255, 0.2)',
            fontSize: 14
        },
        grid: {
            vertLines: {color: 'rgba(255, 255, 255, 0.2)'},
            horzLines: {color: 'rgba(255, 255, 255, 0.2)'}
        },
        timeScale: {fixLeftEdge: true}
    },
    chartTypes: [{name: 'line', selected: true}, {name: 'candlestick'}, {name: 'bar'}],
    chartDataSource: history.archive[0].source,
    dataSources: history.years,
    chartDataSourceArchive: history.archive,
    resolutionOptions: [{name: '1d', selected: true}, {name: '1w'}, 
                        {name: '1m'}, {name: '1q'}],
    chartResolution: '1d',
    indexHistory: history.archive[0].data,
    charts: [
        {
            id: 0,
            type: 'line',
            source: 2019,
            resolution: '1d',
            activeIndex: randomIndices[0],
            data: history.archive.find(entry => entry.source === 2019)!.data
        }
    ],
    selectedChart: null,
    buyButtons: [{name: 'Buy'}],
    sellButtons: [{name: 'Sell'}],
    reportButtons: [{name: '', graphic: 'fas fa-history', title: 'Add a History Report', data: 'history'},
                    {name: '', graphic: 'fas fa-flag', title: 'Add an Activity Report', data: 'activity'},
                    {name: '', graphic: 'far fa-newspaper', title: 'Add a Headlines Report', data: 'headlines'}, 
                    {name: '', graphic: 'far fa-bell', title: 'Add a Notifications Report', data: 'alerts'}],
    reportData: {
        orderHistory: new TableData(ORDER_HEADERS, []),
        activities: new ListData([]),
        headlines: randomHeadlines,
        alerts: randomAlerts
    },
    boxes: [
        new BoxData(0, 'Order History', BoxType.ORDER_HISTORY),
        new BoxData(1, 'Recent Activity', BoxType.RECENT_ACTIVIY),
        new BoxData(2, 'Latest Headlines', BoxType.HEADLINES),
        new BoxData(3, 'Notifications', BoxType.ALERTS)
    ],
    selectedBox: null,

    balance: 10000,
    buyQty: 1,
    sellQty: 1
}

export const store = createStore(main);