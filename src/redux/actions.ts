import StockData from '../StockData';
import BoxData, { BoxType } from '../BoxData';
import ListData from '../ListData';
import TableData from '../TableData';
import AlertData from '../AlertData';
import { ChartDescriptor, ChartOptions } from './store';
import { isVowel } from '../utility';
import { Option } from './store';
import ChartData from '../ChartData';

export const SET_STOCKS_LIST = 'SET_STOCKS_LIST';
export const SELECT_STOCK = 'SELECT_INDEX';
export const SEARCH_FOR_INDEX = 'SEARCH_FOR_INDEX';
export const SEARCH_WATCHLIST = 'SEARCH_WATCHLIST';
export const ADD_TO_WATCHLIST = 'ADD_TO_WATCHLIST';
export const REMOVE_FROM_WATCHLIST = 'REMOVE_FROM_WATCHLIST';
export const UPDATE_WATCHLIST = 'UPDATE_WATCHLIST';
export const UPDATE_EXCHANGES = 'UPDATE_EXCHANGES';
export const SELECT_EXCHANGE = 'SELECT_EXCHANGE';
export const UPDATE_SELECTED_EXCHANGE = 'UPDATE_SELECTED_EXCHANGE';

export const SET_CHART_TYPE = 'SET_CHART_TYPE';
export const SET_CHART_YEAR = 'SET_CHART_SOURCE';
export const SET_CHART_RESOLUTION = 'SET_CHART_RESOLUTION';

export const ADD_CHART = 'ADD_CHART';
export const REMOVE_CHART = 'REMOVE_CHART';
export const SELECT_CHART = 'SELECT_CHART';
export const ADD_BOX = 'ADD_BOX';
export const REMOVE_BOX = 'REMOVE_BOX';
export const SELECT_BOX = 'SELECT_BOX';
export const MOVE_BOX_BACK = 'MOVE_BOX_BACK';
export const MOVE_BOX_FORWARD = 'MOVE_BOX_FORWARD';
export const SET_BOXES = 'SET_BOXES';
export const DISMISS_ALERT = 'DISMISS_ALERT';
export const SET_DISPLAYED_ALERTS_LEVEL = 'SET_DISPLAYED_ALERTS_LEVEL';
export const ADD_ALERT = 'ADD_ALERT';
export const UPDATE_ALERTS = 'UPDATE_ALERTS';

export const BUY = 'BUY';
export const SELL = 'SELL';
export const SET_BUY_QTY = 'SET_BUY_QTY';
export const SET_SELL_QTY = 'SET_SELL_QTY';

export const SET_ORDER_HISTORY = 'SET_ORDER_HISTORY';
export const UPDATE_ACTIVITIES = 'UPDATE_ACTIVITIES';
export const UPDATE_HEADLINES = 'UPDATE_HEADLINES';

export const TOGGLE_HELP = 'TOGGLE_HELP';

export const SET_ACTIVE_HELP_SECTION = 'SET_ACTIVE_HELP_SECTION';
export const UPDATE_BALANCE = 'UPDATE_BALANCE';

export const SELECT_STOCK_START_LETTER = 'SELECT_STOCK_START_LETTER';
export const SET_STOCK_START_LETTER = 'SET_STOCK_START_LETTER';

export const UPDATE_CHART_OPTIONS = 'SET_CHART_DATA';
export const TOGGLE_TRACKER = 'TOGGLE_TRACKER';
export const SWITCH_TRACKER_MODE = 'SWITCH_TRACKER_MODE';
export const SET_TRACKER_MODE = 'SET_TRACKER_MODE';

export const activityLabels = {
    sell: (amount: number, indexName: string, price: number) => {
        const price_ = (new Intl.NumberFormat(
            'en-US', {style: 'currency', currency: 'USD'})).format(price);
        return `You sold ${amount} of ${indexName} (+${price_})`;
    },
    buy: (amount: number, indexName: string, price: number) => {
        const price_ = (new Intl.NumberFormat(
            'en-US', {style: 'currency', currency: 'USD'})).format(price);
        return `You bought ${amount} of ${indexName} (-${price_})`
    },
    addBox: (boxType: BoxType) => {
        return `You added a new ${boxType} report`
    },
    removeBox: (boxType: BoxType) => {
        return `You removed ${isVowel(boxType.toString().split('')[0]) ?
         'an' : 'a'} ${boxType} report`
    },
    moveBox: () => {
        return 'You moved boxes around'
    }};

export type Action = {
    type: string,
    arg: any
}

export const setStocksList = (list: StockData[]) => ({
    type: SET_STOCKS_LIST,
    arg: list
});

export const selectStock = (index: StockData) => ({
    type: SELECT_STOCK,
    arg: index
});

export const searchForIndex = (name: string) => ({
    type: SEARCH_FOR_INDEX,
    arg: name
});

export const searchWatchlist = (name: string) => ({
    type: SEARCH_WATCHLIST,
    arg: name
});

export const addToWatchlist = (indexData: StockData) => ({
    type: ADD_TO_WATCHLIST,
    arg: indexData
});

export const removeFromWatchlist = (indexData: StockData) => ({
    type: REMOVE_FROM_WATCHLIST,
    arg: indexData
});

export const setChartType = (chartType: string, chartId: number) => ({
    type: SET_CHART_TYPE,
    arg: { chartType: chartType, chartId: chartId }
});

export const setChartYear = (year: string | number, chartId: number) => ({
    type: SET_CHART_YEAR,
    arg: { year: year, chartId: chartId }
});

export const setChartResolution = (resolution: string, chartId: number, year: number | string) => ({
    type: SET_CHART_RESOLUTION,
    arg: { resolution: resolution, chartId: chartId, year: year }
});

export const addChart = (chartId: number) => ({
    type: ADD_CHART,
    arg: { chartId: chartId }
});

export const selectChart = (id: number) => ({
    type: SELECT_CHART,
    arg: id
});

export const removeChart = (chartId: number) => ({
    type: REMOVE_CHART,
    arg: { chartId: chartId }
});

export const addBox = (type: BoxType) => ({
    type: ADD_BOX,
    arg: type
});

export const setBoxes = (boxes: BoxData[]) => ({
    type: SET_BOXES,
    arg: boxes
});

export const removeBox = (id: number) => ({
    type: REMOVE_BOX,
    arg: id
});

export const selectBox = (id: number) => ({
    type: SELECT_BOX,
    arg: id
});

export const moveBoxBack = (id: number) => ({
    type: MOVE_BOX_BACK,
    arg: id
});

export const moveBoxForward = (id: number) => ({
    type: MOVE_BOX_FORWARD,
    arg: id
});

export const dismissAlert = (id: number) => ({
    type: DISMISS_ALERT,
    arg: id
});

export const buy = () => ({
    type: BUY,
    arg: null
});

export const sell = () => ({
    type: SELL,
    arg: null
});

export const setBuyQty = (value: number) => ({
    type: SET_BUY_QTY,
    arg: value
});

export const setSellQty = (value: number) => ({
    type: SET_SELL_QTY,
    arg: value
});

export const setOrderHistory = (history: TableData) => ({
    type: SET_ORDER_HISTORY,
    arg: history
});

export const updateActivities = (activity: ListData) => ({
    type: UPDATE_ACTIVITIES,
    arg: activity
});

export const updateHeadlines = (headlines: ListData, category: string) => ({
    type: UPDATE_HEADLINES,
    arg: { headlines, category }
});

export const toggleHelp = (option: 'open' | 'close') => ({
    type: TOGGLE_HELP,
    arg: option
});

export const setActiveHelpSection = (section: string) => ({
    type: SET_ACTIVE_HELP_SECTION,
    arg: section
});

export const updateBalance = (balance: number) => ({
    type: UPDATE_BALANCE,
    arg: balance
});

export const setDisplayedAlertsLevel = (level: string) => ({
    type: SET_DISPLAYED_ALERTS_LEVEL,
    arg: level
});

export const addAlert = (level: string) => ({
    type: ADD_ALERT,
    arg: level
});

export const updateAlerts = (alerts: AlertData[]) => ({
    type: UPDATE_ALERTS,
    arg: alerts
});

export const updateExchanges = (list: Option[]) => ({
    type: UPDATE_EXCHANGES,
    arg: list
});

export const selectExchange = (exchange: string) => ({
    type: SELECT_EXCHANGE,
    arg: exchange
});

export const updateSelectedExchange = (name: string) => ({
    type: UPDATE_SELECTED_EXCHANGE,
    arg: name
});

export const updateWatchList = (watchList: StockData[]) => ({
    type: UPDATE_WATCHLIST,
    arg: watchList
});

export const selectStockStartLetter = (letter: string) => ({
    type: SELECT_STOCK_START_LETTER,
    arg: letter
});

export const setStockStartLetter = (letter: string) => ({
    type: SET_STOCK_START_LETTER,
    arg: letter
});

export const updateChartOptions = (options: ChartOptions) => ({
    type: UPDATE_CHART_OPTIONS,
    arg: options
});

export const toggleStopTracker = () => ({
    type: TOGGLE_TRACKER,
    arg: null
});

export const switchTrackerMode = () => ({
    type: SWITCH_TRACKER_MODE,
    arg: null
});

export const setTrackerMode = (mode: boolean) => ({
    type: SET_TRACKER_MODE,
    arg: mode
});