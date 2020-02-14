import { createStore } from 'redux';
import { main } from './reducers';
import StockData from '../StockData';
import * as random from '../randomizer';
import ChartData, { ChartDataEntry } from '../ChartData';
import TableData, { TableCell, TableRow } from '../TableData';
import ListData, { ListDataRow } from '../ListData';
import AlertData from '../AlertData';
import BoxData, { BoxType } from '../BoxData';
import Storage, { Keys } from '../Storage';
import * as actions from './actions';
import News, { Category } from '../News';
import { fullDate, alphabet, digits } from '../utility';
import { help } from '../help';
import FinnHub from '../FinnHub';

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
    onClick?: (value: string | number, ...other: any) => void,
    selected?: boolean
}

export type ReportData = {
    orderHistory: TableData,
    activities: ListData,
    headlines: ListData,
    headlinesTitle: string,
    headlinesMenuItems: Option[],
    alertDisplayOptions: Option[],
    displayedAlertsLevel: DisplayedAlertsLevel,
    alerts: AlertData[]
}

export type ChartDescriptor = {
    id: number,
    type: ChartType,
    source: number | string,
    resolution: string,
    data: ChartData,
    activeIndex: StockData
}

export type HelpType = {
    visible: boolean,
    sections: Option[]
}

export type DisplayedAlertsLevel = 'all' | 'error' | 'warning' | 'info';

export interface State {
    selectedIndex: StockData | null,
    allStocksList: StockData[],
    stocksList: StockData[],
    stockStartLetter: string,
    marketSearchResultsList: StockData[],
    watchListSearchResultsList: StockData[],
    watchList: StockData[],
    exchanges: Option[],
    stockIndexOptions: Option[],
    selectedExchange: {name: string, code: string},

    socket: WebSocket | undefined,

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
    menusVisible: boolean,

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

Storage.get(Keys.BALANCE).then(balance => { 
    if (balance) {
        store.dispatch(actions.setBalance(balance as number));
    }
});

Storage.get(Keys.ALERTS).then(alerts => {
    if (alerts) {
        store.dispatch(actions.setAlerts(alerts as AlertData[]));
    }
});

Storage.get(Keys.CHARTS).then(charts => {
    if (charts) {
        store.dispatch(actions.setCharts(charts as ChartDescriptor[]));
    } else {
        store.dispatch(actions.setCharts([
            {
                id: 0,
                type: 'line',
                source: 'Intraday',
                resolution: '1d',
                activeIndex: new StockData(0, '---', 0, 0, 0, 0, 0, 0),
                data: new ChartData([new ChartDataEntry('2020-01-01', 0, 0, 0, 0)])
            }
        ]));
    }
});

Storage.get(Keys.BOXES).then(boxes => {
    if (boxes) {
        store.dispatch(actions.setBoxes(boxes as Array<BoxData>));
    }
});

Storage.get(Keys.WATCHLIST).then(watchlist => {
    if (watchlist) {
        store.dispatch(actions.setWatchList(watchlist as Array<StockData>));
    }
});

Storage.get(Keys.START_LETTER).then(letter => {
    if (letter) {
        store.dispatch(actions.setStockStartLetter(letter as string));
    }
});

const fetchHeadlines = (category: Category) =>
    News.headlines(category, articles => {
        const headlines: ListDataRow[] = [];
        articles.forEach(article => headlines.push(new ListDataRow(article.title, undefined, `${article.author} @ ${fullDate(new Date(article.publishedAt))}`, article.url)));
        store.dispatch(actions.setHeadlines(new ListData(headlines), category));
    }, () => store.dispatch(actions.setHeadlines(new ListData([new ListDataRow('An error occurred while trying get the latest headlines.')]), category)));
fetchHeadlines('business');

const fetchExchanges = () => {
    FinnHub.listExchanges(list => store.dispatch(actions.setExchanges(list)));
}
fetchExchanges();

const fetchSelectedExchange = () => {
    Storage.get(Keys.EXCHANGE).then(exchange => {
        if (exchange) {
            const exchange_ = exchange as {name: string, code: string};
            fetchStocks(exchange_.code);
            store.dispatch(actions.setSelectedExchange(exchange_.name))
        } else {
            fetchStocks('US');
        }
    });
}
fetchSelectedExchange();

export const fetchStocks = (exchange: string) => {
    FinnHub.listStocks(exchange, list => {store.dispatch(actions.setStocksList(list))});
}

export const state: State = {
    selectedIndex: randomIndices[0],
    allStocksList: [],
    stocksList: [],
    stockStartLetter: 'a',
    marketSearchResultsList: [],
    watchListSearchResultsList: [],
    watchList: [],
    exchanges: [],
    stockIndexOptions: alphabet.concat(digits).map(character => ({name: character})),
    selectedExchange: {name: '', code: ''},

    socket: undefined,

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
    resolutionOptions: [{name: '1d', selected: true, onClick: () => store.dispatch(actions.setChartResolution('1d', 0, 0))}, {name: '1w', onClick: () => store.dispatch(actions.setChartResolution('1w', 0, 0))}, 
                        {name: '1m', onClick: () => store.dispatch(actions.setChartResolution('1m', 0, 0))}, {name: '1q', onClick: () => store.dispatch(actions.setChartResolution('1q', 0, 0))}],
    chartResolution: '1d',
    indexHistory: history.archive[0].data,
    charts: [
        {
            id: 0,
            type: 'line',
            source: 'Intraday',
            resolution: '1d',
            activeIndex: new StockData(0, '---', 0, 0, 0, 0, 0, 0),
            data: history.archive.find(entry => entry.source === 'Intraday')!.data
        }
    ],
    selectedChart: null,
    buyButtons: [{name: 'Buy', onClick: () => store.dispatch(actions.buy())}],
    sellButtons: [{name: 'Sell', onClick: () => store.dispatch(actions.sell())}],
    reportButtons: [{name: '', graphic: 'fas fa-history', title: 'Add a History Report', data: 'history', onClick: () => store.dispatch(actions.addBox(BoxData.getBoxType('history')))},
                    {name: '', graphic: 'fas fa-flag', title: 'Add an Activity Report', data: 'activity', onClick: () => store.dispatch(actions.addBox(BoxData.getBoxType('activity')))},
                    {name: '', graphic: 'far fa-newspaper', title: 'Add a Headlines Report', data: 'headlines', onClick: () => store.dispatch(actions.addBox(BoxData.getBoxType('headlines')))}, 
                    {name: '', graphic: 'far fa-bell', title: 'Add a Notifications Report', data: 'alerts', onClick: () => store.dispatch(actions.addBox(BoxData.getBoxType('alerts')))}],
    generalButtons: [{name: '', graphic: 'fas fa-question-circle', onClick: () => store.dispatch(actions.toggleHelp('open'))}],
    reportData: {
        orderHistory: new TableData(ORDER_HEADERS, []),
        activities: new ListData([]),
        headlines: new ListData([]),
        headlinesTitle: 'Business',
        headlinesMenuItems: [
            {name: 'business', onClick: (category) => fetchHeadlines(category as Category)}, 
            {name: 'entertainment', onClick: (category) => fetchHeadlines(category as Category)}, 
            {name: 'general', onClick: (category) => fetchHeadlines(category as Category)}, 
            {name: 'health', onClick: (category) => fetchHeadlines(category as Category)}, 
            {name: 'science', onClick: (category) => fetchHeadlines(category as Category)}, 
            {name: 'sports', onClick: (category) => fetchHeadlines(category as Category)}, 
            {name: 'technology', onClick: (category) => fetchHeadlines(category as Category)}
        ],
        alertDisplayOptions: [
            {name: 'all', onClick: () => store.dispatch(actions.setDisplayedAlertsLevel('all'))},
            {name: 'info', onClick: () => store.dispatch(actions.setDisplayedAlertsLevel('info'))},
            {name: 'warning', onClick: () => store.dispatch(actions.setDisplayedAlertsLevel('warning'))},
            {name: 'level', onClick: () => store.dispatch(actions.setDisplayedAlertsLevel('level'))}
        ],
        displayedAlertsLevel: 'all',
        alerts: []
    },
    boxes: [],
    selectedBox: null,
    menusVisible: false,

    balance: 0,
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