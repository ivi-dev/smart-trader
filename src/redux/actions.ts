import IndexData from '../IndexData';
import { BoxType } from '../BoxData';
import ListData from '../ListData';
import TableData from '../TableData';
import AlertData from '../AlertData';
import { ChartDescriptor } from './store';

export const SELECT_INDEX = 'SELECT_INDEX';
export const SEARCH_FOR_INDEX = 'SEARCH_FOR_INDEX';
export const ADD_TO_WATCHLIST = 'ADD_TO_WATCHLIST';
export const REMOVE_FROM_WATCHLIST = 'REMOVE_FROM_WATCHLIST';

export const SET_CHART_TYPE = 'SET_CHART_TYPE';
export const SET_CHART_YEAR = 'SET_CHART_SOURCE';
export const SET_CHART_RESOLUTION = 'SET_CHART_RESOLUTION';
export const SET_CHARTS = 'SET_CHARTS';

export const ADD_CHART = 'ADD_CHART';
export const REMOVE_CHART = 'REMOVE_CHART';
export const SELECT_CHART = 'SELECT_CHART';
export const ADD_BOX = 'ADD_BOX';
export const REMOVE_BOX = 'REMOVE_BOX';
export const SELECT_BOX = 'SELECT_BOX';
export const MOVE_BOX_BACK = 'MOVE_BOX_BACK';
export const MOVE_BOX_FORWARD = 'MOVE_BOX_FORWARD';
export const DISMISS_ALERT = 'DISMISS_ALERT';
export const SET_DISPLAYED_ALERTS_LEVEL = 'SET_DISPLAYED_ALERTS_LEVEL';
export const ADD_ALERT = 'ADD_ALERT';
export const SET_ALERTS = 'SET_ALERTS';

export const BUY = 'BUY';
export const SELL = 'SELL';
export const SET_BUY_QTY = 'SET_BUY_QTY';
export const SET_SELL_QTY = 'SET_SELL_QTY';

export const SET_ORDER_HISTORY = 'SET_ORDER_HISTORY';
export const SET_ACTIVITIES = 'ADD_ACTIVITY';
export const SET_HEADLINES = 'SET_HEADLINES';

export const TOGGLE_HELP = 'TOGGLE_HELP';

export const SET_ACTIVE_HELP_SECTION = 'SET_ACTIVE_HELP_SECTION';
export const SET_BALANCE = 'SET_BALANCE';

export const activityLabels = {
    sell: (amount: number, indexName: string, price: number) => {
        const price_ = (new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'})).format(price);
        return `You sold ${amount} of ${indexName} (+${price_})`;
    },
    buy: (amount: number, indexName: string, price: number) => {
        const price_ = (new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'})).format(price);
        return `You bought ${amount} of ${indexName} (-${price_})`
    }};

export interface Action {
    type: string,
    arg: any
}

export const selectIndex = (index: IndexData) => ({
    type: SELECT_INDEX,
    arg: index
});

export const searchForIndex = (name: string) => ({
    type: SEARCH_FOR_INDEX,
    arg: name
});

export const addToWatchlist = (indexData: IndexData) => ({
    type: ADD_TO_WATCHLIST,
    arg: indexData
});

export const removeFromWatchlist = (indexData: IndexData) => ({
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

export const setActivities = (activity: ListData) => ({
    type: SET_ACTIVITIES,
    arg: activity
});

export const setHeadlines = (headlines: ListData) => ({
    type: SET_HEADLINES,
    arg: headlines
});

export const toggleHelp = (option: 'open' | 'close') => ({
    type: TOGGLE_HELP,
    arg: option
});

export const setActiveHelpSection = (section: string) => ({
    type: SET_ACTIVE_HELP_SECTION,
    arg: section
});

export const setBalance = (balance: number) => ({
    type: SET_BALANCE,
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

export const setAlerts = (alerts: AlertData[]) => ({
    type: SET_ALERTS,
    arg: alerts
});

export const setCharts = (charts: ChartDescriptor[]) => ({
    type: SET_CHARTS,
    arg: charts
});