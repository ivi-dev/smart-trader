import { createStore } from 'redux';
import { main } from './reducers';
import IndexData from '../IndexData';
import * as random from '../randomizer';
import ChartData from '../ChartData';
import TableData, { TableCell, TableRow } from '../TableData';
import ListData, { ListDataRow } from '../ListData';
import Alert from '../Alert';
import BoxData, { BoxType } from '../BoxData';
import Storage, { Keys } from '../Storage';
import * as actions from './actions';
import News, { Category } from '../News';
import { fullDate } from '../utility';
import { help } from '../help';

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
    onClick?: (value: string | number) => void,
    selected?: boolean
}

export type ReportData = {
    orderHistory: TableData,
    activities: ListData,
    headlines: ListData,
    headlinesMenuItems: Option[],
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

export type HelpType = {
    visible: boolean,
    sections: Option[]
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
    generalButtons: Option[],
    reportData: ReportData,
    boxes: BoxData[],
    selectedBox: number | null,

    balance: number,
    buyQty: number,
    sellQty: number,

    help: HelpType
}

const randomIndices = random.indices(100);
const history = random.indexHistories();

Storage.get(Keys.ORDERS).then(orders => { 
    if (orders) {
        store.dispatch(actions.setOrderHistory(
            new TableData(ORDER_HEADERS, (orders as Array<TableRow>))));
    }
});

Storage.get(Keys.ACTIVITY).then(rows => { 
    if (rows) {
        store.dispatch(actions.setActivities(
            new ListData(rows as Array<ListDataRow>)));
    }
});

const fetchHeadlines = (category: Category) =>
    News.headlines(category, articles => {
        const headlines: ListDataRow[] = [];
        articles.forEach(article => headlines.push(new ListDataRow(article.title, undefined, `${article.author} @ ${fullDate(new Date(article.publishedAt))}`)));
        store.dispatch(actions.setHeadlines(new ListData(headlines)));
    }, error => store.dispatch(actions.setHeadlines(new ListData([new ListDataRow('An error occurred while trying get the latest headlines.')]))));
fetchHeadlines('business');

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
    buyButtons: [{name: 'Buy', onClick: () => store.dispatch(actions.buy())}],
    sellButtons: [{name: 'Sell', onClick: () => store.dispatch(actions.buy())}],
    reportButtons: [{name: '', graphic: 'fas fa-history', title: 'Add a History Report', data: 'history', onClick: () => store.dispatch(actions.addBox(BoxData.getBoxType('history')))},
                    {name: '', graphic: 'fas fa-flag', title: 'Add an Activity Report', data: 'activity', onClick: () => store.dispatch(actions.addBox(BoxData.getBoxType('activity')))},
                    {name: '', graphic: 'far fa-newspaper', title: 'Add a Headlines Report', data: 'headlines', onClick: () => store.dispatch(actions.addBox(BoxData.getBoxType('headlines')))}, 
                    {name: '', graphic: 'far fa-bell', title: 'Add a Notifications Report', data: 'alerts', onClick: () => store.dispatch(actions.addBox(BoxData.getBoxType('alerts')))}],
    generalButtons: [{name: '', graphic: 'fas fa-question-circle', onClick: () => store.dispatch(actions.toggleHelp('open'))}],
    reportData: {
        orderHistory: new TableData(ORDER_HEADERS, []),
        activities: new ListData([]),
        headlines: new ListData([]),
        headlinesMenuItems: [{name: 'business', onClick: (category) => fetchHeadlines(category as Category)}, {name: 'entertainment', onClick: (category) => fetchHeadlines(category as Category)}, {name: 'general', onClick: (category) => fetchHeadlines(category as Category)}, {name: 'health', onClick: (category) => fetchHeadlines(category as Category)}, {name: 'science', onClick: (category) => fetchHeadlines(category as Category)}, {name: 'sports', onClick: (category) => fetchHeadlines(category as Category)}, {name: 'technology', onClick: (category) => fetchHeadlines(category as Category)}],
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
    sellQty: 1,

    help: {
        visible: false,
        sections: [
            {name: 'Overview', data: help.overview, onClick: (section) => store.dispatch(actions.setActiveHelpSection(section.toString())), selected: true},
            {name: 'Basic Navigation', data: help.basicNavigation, onClick: (section) => store.dispatch(actions.setActiveHelpSection(section.toString()))},
            {name: 'Exploring Stocks', data: help.exploringStocks, onClick: (section) => store.dispatch(actions.setActiveHelpSection(section.toString()))},
            {name: 'Buying/Selling Stocks', data: help.buyingSellinStocks, onClick: (section) => store.dispatch(actions.setActiveHelpSection(section.toString()))},
            {name: 'Customizing Your Workspace', data: help.customizingYourWorkspace, onClick: (section) => store.dispatch(actions.setActiveHelpSection(section.toString()))}
        ]
    }
}

export const store = createStore(main);