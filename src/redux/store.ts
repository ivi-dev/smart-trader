import { createStore } from 'redux';
import { main } from './reducers';
import IndexData from '../IndexData';
import * as random from '../randomizer';
import { ChartType } from '../components/Chart';
import { Option } from '../components/Selector';
import ChartDataEntry from '../ChartDataEntry';
import TableData from '../TableData';
import ListData from '../ListData';
import Alert from '../Alert';

export interface State {
    selectedIndex: IndexData | null,
    indicesList: IndexData[],
    searchResultsList: IndexData[],
    watchList: IndexData[],

    chartType: ChartType,
    chartTypes: Option[],
    chartDataSource: number,
    chartDataSources: Option[],
    chartDataSourceArchive: {year: number, data: ChartDataEntry[]}[],
    resolutionOptions: Option[],
    chartResolution: string,
    indexHistory: ChartDataEntry[],

    orderHistory: TableData,
    activities: ListData,
    headlines: ListData,
    alerts: Alert[]
}

const randomIndices = random.indices(100);
const randomIndexHistory1 = random.indexHistory();
const randomIndexHistory2 = random.indexHistory();
const chartTypes = [{name: 'line', selected: true}, {name: 'candlestick'}, {name: 'bar'}];
const year = (new Date()).getFullYear() - 1;
const dataSources = [{name: year, selected: true}, {name: 2018}];
const archive = [{year: year, data: randomIndexHistory1}, 
                 {year: 2018, data: randomIndexHistory2}];
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
    chartTypes: chartTypes,
    chartDataSource: year,
    chartDataSources: dataSources,
    chartDataSourceArchive: archive,
    resolutionOptions: resolutionOptions,
    chartResolution: '1d',
    indexHistory: randomIndexHistory1,
    orderHistory: randomOrders,
    activities: randomActivities,
    headlines: randomHeadlines,
    alerts: randomAlerts,
}

export const store = createStore(main);