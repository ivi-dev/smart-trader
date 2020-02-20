import { createStore } from 'redux';
import { main } from './reducers';
import StockData from '../StockData';
import TableData, { TableCell, OrderType } from '../TableData';
import ListData, { ListDataRow, ActivityType } from '../ListData';
import AlertData, { AlertLevel } from '../AlertData';
import BoxData from '../BoxData';
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
    altData?: string,
    onClick?: (value: string | 
        number, ...other: any) => void,
    selected?: boolean
}

export type ReportData = {
    orderHistory: TableData,
    activities: ListData,
    headlines: ListData,
    headlinesTitle: string,
    ordersDisplayOptions: Option[],
    activityDisplayOptions: Option[],
    headlinesMenuItems: Option[],
    alertDisplayOptions: Option[],
    displayedOrdersLevel: OrderType,
    displayedActivitiesLevel: ActivityType,
    displayedAlertsLevel: AlertLevel,
    alerts: AlertData[],
    menuVisible: boolean
}

export type ChartOptions = {
    chart: {},
    grid: {},
    xaxis: {},
    stroke: {},
    noData: {},
    series: {name: string,
             data: {x: string, 
                    y: number}[]}[]
}

export interface CompanyInfo {}

export type ChartDescriptor = {
    stock: StockData | null,
    options: ChartOptions,
    status: string,
    company: {
        [index: string]: CompanyInfo,
        profile: {},
        ceo: {},
        executives: {}[],
        price: {},
        valuarion: {},
        growth: {},
        margin: {},
        management: {},
        financialStrength: {},
        perShare: {},
        investors: {}[],
        funds: {}[],
        sections: Option[]
    }
}

export type HelpType = {
    visible: boolean,
    sections: Option[]
}

export interface State {
    allStocksList: StockData[],
    stocksList: StockData[],
    stockStartLetter: string,
    marketSearchResultsList: StockData[],
    watchListSearchResultsList: StockData[],
    watchList: StockData[],
    exchanges: Option[],
    stockIndexOptions: Option[],
    selectedExchange: {name: string, code: string},

    tracker: WebSocket | number | null,
    simulateTracker: boolean,
    chart: ChartDescriptor,

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

Storage.get(Keys.ORDERS).then(orders => { 
    if (orders) {
        store.dispatch(actions.setOrderHistory(orders as TableData));
    }
});

Storage.get(Keys.ACTIVITY).then(activity => { 
    if (activity) {
        store.dispatch(actions.updateActivities(activity as ListData));
    }
});

Storage.get(Keys.BALANCE).then(balance => { 
    if (balance) {
        store.dispatch(actions.updateBalance(balance as number));
    }
});

Storage.get(Keys.ALERTS).then(alerts => {
    if (alerts) {
        store.dispatch(actions.updateAlerts(alerts as AlertData[]));
    }
});

Storage.get(Keys.BOXES).then(boxes => {
    if (boxes) {
        store.dispatch(actions.setBoxes(boxes as Array<BoxData>));
    }
});

Storage.get(Keys.WATCHLIST).then(watchlist => {
    if (watchlist) {
        store.dispatch(actions.updateWatchList(watchlist as Array<StockData>));
    }
});

Storage.get(Keys.START_LETTER).then(letter => {
    if (letter) {
        store.dispatch(actions.setStockStartLetter(letter as string));
    }
});

Storage.get(Keys.STOCK).then(stock => {
    store.dispatch(actions.selectStock(stock as StockData));
});

const fetchHeadlines = (category: Category) =>
    News.headlines(category, articles => {
        const headlines: ListDataRow[] = [];
        articles.forEach(article => headlines.push(new ListDataRow(article.title, 'other', undefined, `${article.author} @ ${fullDate(new Date(article.publishedAt))}`, article.url)));
        store.dispatch(actions.updateHeadlines(new ListData(headlines), category));
    }, () => store.dispatch(actions.updateHeadlines(new ListData([new ListDataRow('An error occurred while trying get the latest headlines.')]), category)));
fetchHeadlines('business');

const fetchExchanges = () => {
    FinnHub.listExchanges(list => store.dispatch(actions.updateExchanges(list)), 
        error => {
            if (error) {
                store.dispatch(actions.addAlert('error', error.message))
            }
    });
}
fetchExchanges();

const fetchSelectedExchange = () => {
    Storage.get(Keys.EXCHANGE).then(exchange => {
        if (exchange) {
            const exchange_ = exchange as {name: string, code: string};
            fetchStocks(exchange_.code);
            store.dispatch(actions.updateSelectedExchange(exchange_.name));
        } else {
            store.dispatch(actions.updateSelectedExchange('US Exchanges'))
            fetchStocks('US');
        }
    });
}
fetchSelectedExchange();

export const fetchStocks = (exchange: string) => {
    FinnHub.listStocks(exchange, list => {store.dispatch(actions.setStocksList(list))},
        error => {
            if (error) {
                store.dispatch(actions.addAlert('error', error.message))
            }
    });
}

export const state: State = {
    allStocksList: [],
    stocksList: [],
    stockStartLetter: 'a',
    marketSearchResultsList: [],
    watchListSearchResultsList: [],
    watchList: [],

    exchanges: [],
    selectedExchange: {name: '', code: ''},
    stockIndexOptions: alphabet.concat(digits).map(
        character => ({name: character})),

    tracker: null,
    simulateTracker: true,

    chart: {
        stock: null,
        status: 'No Data Yet.',
        options: {
            chart: {
              type: 'line',
              width: '100%',
              height: '90%',
              foreColor: 'rgba(255, 255, 255, 0.5)',
              animations: {
                  enabled: false
              }
            },
            stroke: {
                width: 3
            },
            grid: {
                borderColor: 'rgba(255, 255, 255, 0.2)'
            },
            xaxis: {
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                }
            },
            noData: {
                text: 'No data yet.',
                style: {
                    fontSize: '20px'
                }
            },
            series: [{
                name: '',
                data: []
            }]
        },
        company: {
            profile: {},
            ceo: {},
            executives: [],
            price: {},
            valuarion: {},
            growth: {},
            margin: {},
            management: {},
            financialStrength: {},
            perShare: {},
            investors: [],
            funds: [],
            valuation: {},
            sections: [{name: 'Profile', data: 'profile', selected: true}, 
                       {name: 'CEO (US Companies Only)', data: 'ceo'}, 
                       {name: 'Executives', data: 'executives'}, 
                       {name: 'Price', data: 'price'},
                       {name: 'Valuation', data: 'valuation'},
                       {name: 'Growth', data: 'growth'},
                       {name: 'Margin', data: 'margin'},
                       {name: 'Management', data: 'management'},
                       {name: 'Financial Strength', data: 'financialStrength'},
                       {name: 'Per Share', data: 'perShare'},
                       {name: 'Investors Ownership', data: 'investors'},
                       {name: 'Fund Ownership', data: 'funds'}]
        }
    },

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
        ordersDisplayOptions: [
            {name: 'all', onClick: () => store.dispatch(actions.setOrdersDisplayLevel('all'))}, 
            {name: 'buy', onClick: () => store.dispatch(actions.setOrdersDisplayLevel('buy'))}, 
            {name: 'sell', onClick: () => store.dispatch(actions.setOrdersDisplayLevel('sell'))}
        ],
        activityDisplayOptions: [
            {name: 'all', onClick: () => store.dispatch(actions.setDisplayedActivitiesLevel('all'))},
            {name: 'application', onClick: () => store.dispatch(actions.setDisplayedActivitiesLevel('application'))},
            {name: 'trade', onClick: () => store.dispatch(actions.setDisplayedActivitiesLevel('trade'))}
        ],
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
            {name: 'error', onClick: () => store.dispatch(actions.setDisplayedAlertsLevel('error'))}
        ],
        menuVisible: false,
        displayedOrdersLevel: 'all',
        displayedActivitiesLevel: 'all',
        displayedAlertsLevel: 'all',
        alerts: []
    },
    boxes: [],
    selectedBox: null,

    balance: 10000,
    buyQty: 1,
    sellQty: 1,

    help: {
        visible: false,
        sections: [
            {name: 'Overview', data: help.overview.text, altData: help.overview.next, onClick: (section) => store.dispatch(actions.setActiveHelpSection(section.toString())), selected: true},
            {name: 'Navigation', data: help.basicNavigation.text, onClick: (section) => store.dispatch(actions.setActiveHelpSection(section.toString()))},
            {name: 'Stocks/Companies', data: help.stocksAndCompanies.text, onClick: (section) => store.dispatch(actions.setActiveHelpSection(section.toString()))},
            {name: 'Trading', data: help.trading.text, onClick: (section) => store.dispatch(actions.setActiveHelpSection(section.toString()))},
            {name: 'Workspace', data: help.workspace.text, onClick: (section) => store.dispatch(actions.setActiveHelpSection(section.toString()))}
        ]
    }
}

export const store = createStore(main);