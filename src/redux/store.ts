import { createStore } from 'redux';
import { main } from './reducers';
import IndexData from '../IndexData';
import * as random from '../randomizer';
import { ChartType } from '../components/Chart';
import { Option } from '../components/Selector';
import ChartData, { ChartDataEntry } from '../ChartData';
import TableData from '../TableData';
import ListData from '../ListData';
import Alert from '../Alert';
import BoxData, { BoxType } from '../BoxData';

export type ReportData = {
    orderHistory: TableData,
    activities: ListData,
    headlines: ListData,
    alerts: Alert[]
}

export interface State {
    selectedIndex: IndexData | null,
    indicesList: IndexData[],
    searchResultsList: IndexData[],
    watchList: IndexData[],

    chartType: ChartType,
    chartOptions: any,
    chartTypes: Option[],
    chartDataSource: number,
    chartDataSources: Option[],
    chartDataSourceArchive: {year: number, 
                             data: ChartData}[],
    resolutionOptions: Option[],
    chartResolution: string,
    indexHistory: ChartData,

    reportData: ReportData,
    boxes: BoxData[]
}

const randomIndices = random.indices(100);
const history = random.indexHistories();
const chartTypes = [{name: 'line', selected: true}, {name: 'candlestick'}, {name: 'bar'}];
const year = (new Date()).getFullYear() - 1;
const resolutionOptions = [{name: '1d', selected: true}, {name: '1w'}, 
                           {name: '1m'}, {name: '1q'}];
const randomOrders = random.orders(50);
const randomActivities = random.activities(50);
const randomHeadlines = random.headlines(50);
const randomAlerts = random.alerts(15);

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
    chartTypes: chartTypes,
    chartDataSource: year,
    chartDataSources: history.years,
    chartDataSourceArchive: history.archive,
    resolutionOptions: resolutionOptions,
    chartResolution: '1d',
    indexHistory: history.archive[0].data,

    reportData: {
        orderHistory: randomOrders,
        activities: randomActivities,
        headlines: randomHeadlines,
        alerts: randomAlerts
    },
    boxes: [
        new BoxData(0, 'Order History', BoxType.ORDER_HISTORY),
        new BoxData(1, 'Recent Activity', BoxType.RECENT_ACTIVIY),
        new BoxData(2, 'Latest Headlines', BoxType.HEADLINES),
        new BoxData(3, 'Notifications', BoxType.ALERTS)
    ]
}

export const store = createStore(main);