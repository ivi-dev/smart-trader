import Stock from '../models/Stock';
import Box, { BoxType } from '../models/Box';
import List from '../models/List';
import Table from '../models/Table';
import Alert from '../models/Alert';
import { ChartOptions } from './store';
import { isVowel } from '../utility';
import { Option } from './store';

export const SET_STOCKS_LIST = 'SET_STOCKS_LIST';
export const SELECT_STOCK = 'SELECT_STOCK';
export const SEARCH_FOR_STOCK = 'SEARCH_FOR_STOCK';
export const SEARCH_WATCHLIST = 'SEARCH_WATCHLIST';
export const ADD_TO_WATCHLIST = 'ADD_TO_WATCHLIST';
export const REMOVE_FROM_WATCHLIST = 'REMOVE_FROM_WATCHLIST';
export const UPDATE_WATCHLIST = 'UPDATE_WATCHLIST';
export const UPDATE_EXCHANGES = 'UPDATE_EXCHANGES';
export const SELECT_EXCHANGE = 'SELECT_EXCHANGE';
export const UPDATE_SELECTED_EXCHANGE = 'UPDATE_SELECTED_EXCHANGE';
export const UPDATE_STOCK = 'UPDATE_STOCK';

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
export const SET_DISPLAYED_ACTIVITIES_LEVEL = 'SET_DISPLAYED_ACTIVITIES_LEVEL';
export const SET_DISPLAYED_ORDERS_LEVEL = 'SET_DISPLAYED_ORDERS_LEVEL';
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
export const SET_STOCK_INDEX = 'SET_STOCK_START_LETTER';

export const UPDATE_CHART_OPTIONS = 'SET_CHART_DATA';
export const TOGGLE_TRACKER = 'TOGGLE_TRACKER';
export const SWITCH_TRACKER_MODE = 'SWITCH_TRACKER_MODE';
export const SET_TRACKER_MODE = 'SET_TRACKER_MODE';
export const SET_TRACKER = 'SET_TRACKER';

export const SET_COMPANY_PROFILE = 'UPDATE_COMPANY_PROFILE';
export const SET_CEO_INFO = 'UPDATE_CEO_INFO';
export const SET_COMPANY_PRICE_METRIC = 'UPDATE_COMPANY_PRICE_METRIC';
export const SET_COMPANY_VALUATION_METRIC = 'UPDATE_COMPANY_VALUATION_METRIC';
export const SET_COMPANY_GROWTH_METRIC = 'UPDATE_COMPANY_GROWTH_METRIC';
export const SET_COMPANY_MARGIN_METRIC = 'UPDATE_COMPANY_MARGIN_METRIC';
export const SET_COMPANY_MANAGEMENT_METRIC = 'UPDATE_COMPANY_MANAGEMENT_METRIC';
export const SET_COMPANY_FINANCIAL_STRENGTH_METRIC = 'UPDATE_COMPANY_FINANCIAL_STRENGTH_METRIC';
export const SET_COMPANY_PER_SHARE_METRIC = 'UPDATE_COMPANY_PER_SHARE_METRIC';
export const SET_COMPANY_INVESTORS_OWNERSHIP = 'UPDATE_COMPANY_INVESTORS_OWNERSHIP';
export const SET_COMPANY_FUND_OWNERSHIP = 'UPDATE_COMPANY_FUNDS_OWNERSHIP';
export const SET_EXECUTIVES_LIST = 'UPDATE_EXECUTIVES_LIST';

export const SET_ACTIVE_COMPANY_SECTION = 'SET_ACTIVE_COMPANY_SECTION';
export const TOGGLE_MENU = 'TOGGLE_MENU';

export const activityLabels = {
    sell: (amount: number, symbolName: string, price: number) => {
        const price_ = (new Intl.NumberFormat(
            'en-US', {style: 'currency', currency: 'USD'})).format(price);
        return `You sold ${amount} of ${symbolName} (+${price_})`;
    },
    buy: (amount: number, symbolName: string, price: number) => {
        const price_ = (new Intl.NumberFormat(
            'en-US', {style: 'currency', currency: 'USD'})).format(price);
        return `You bought ${amount} of ${symbolName} (-${price_})`
    },
    addBox: (boxType: BoxType) => {
        return `You added a new ${boxType} report`
    },
    removeBox: (boxType: BoxType) => {
        return `You removed ${isVowel(boxType.toString().split('')[0]) ?
         'an' : 'a'} ${boxType} report`
    }};

export type Action = {
    type: string,
    arg: any
}

export const setStocksList = (list: Stock[]) => ({
    type: SET_STOCKS_LIST,
    arg: list
});

export const selectStock = (index: Stock) => ({
    type: SELECT_STOCK,
    arg: index
});

export const searchForIndex = (name: string) => ({
    type: SEARCH_FOR_STOCK,
    arg: name
});

export const searchWatchlist = (name: string) => ({
    type: SEARCH_WATCHLIST,
    arg: name
});

export const addToWatchlist = (indexData: Stock) => ({
    type: ADD_TO_WATCHLIST,
    arg: indexData
});

export const removeFromWatchlist = (indexData: Stock) => ({
    type: REMOVE_FROM_WATCHLIST,
    arg: indexData
});

export const addBox = (type: BoxType) => ({
    type: ADD_BOX,
    arg: type
});

export const setBoxes = (boxes: Box[]) => ({
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

export const setOrderHistory = (history: Table) => ({
    type: SET_ORDER_HISTORY,
    arg: history
});

export const updateActivities = (activity: List) => ({
    type: UPDATE_ACTIVITIES,
    arg: activity
});

export const updateHeadlines = (headlines: List, category: string) => ({
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

export const setDisplayedActivitiesLevel = (level: string) => ({
    type: SET_DISPLAYED_ACTIVITIES_LEVEL,
    arg: level
});

export const setOrdersDisplayLevel = (level: string) => ({
    type: SET_DISPLAYED_ORDERS_LEVEL,
    arg: level
});

export const addAlert = (level: string, message: string) => ({
    type: ADD_ALERT,
    arg: {level, message}
});

export const updateAlerts = (alerts: Alert[]) => ({
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

export const updateWatchList = (watchList: Stock[]) => ({
    type: UPDATE_WATCHLIST,
    arg: watchList
});

export const setStockIndex = (index: string) => ({
    type: SET_STOCK_INDEX,
    arg: index
});

export const updateChartOptions = (options: ChartOptions) => ({
    type: UPDATE_CHART_OPTIONS,
    arg: options
});

export const toggleTracker = () => ({
    type: TOGGLE_TRACKER,
    arg: null
});

export const setTrackerMode = (mode: boolean) => ({
    type: SET_TRACKER_MODE,
    arg: mode
});

export const setTracker = (tracker: any) => ({
    type: SET_TRACKER,
    arg: tracker
});

export const updateStock = (data: Stock) => ({
    type: UPDATE_STOCK,
    arg: data
});

export const updateCompanyProfile = (profile: {}) => ({
    type: SET_COMPANY_PROFILE,
    arg: profile
});

export const updateCEOInfo = (info: {}) => ({
    type: SET_CEO_INFO,
    arg: info
});

export const updateExecutivesList = (list: {}[]) => ({
    type: SET_EXECUTIVES_LIST,
    arg: list
});

export const setActiveCompanySection = (section: string) => ({
    type: SET_ACTIVE_COMPANY_SECTION,
    arg: section
});

export const updateCompanyPriceMetric = (info: {}) => ({
    type: SET_COMPANY_PRICE_METRIC,
    arg: info
});

export const updateCompanyValuationMetric = (info: {}) => ({
    type: SET_COMPANY_VALUATION_METRIC,
    arg: info
});

export const updateCompanyGrowthMetric = (info: {}) => ({
    type: SET_COMPANY_GROWTH_METRIC,
    arg: info
});

export const updateCompanyMarginMetric = (info: {}) => ({
    type: SET_COMPANY_MARGIN_METRIC,
    arg: info
});

export const updateCompanyManagementMetric = (info: {}) => ({
    type: SET_COMPANY_MANAGEMENT_METRIC,
    arg: info
});

export const updateCompanyFinancialStrengthMetric = (info: {}) => ({
    type: SET_COMPANY_FINANCIAL_STRENGTH_METRIC,
    arg: info
});

export const updateCompanyPerShareMetric = (info: {}) => ({
    type: SET_COMPANY_PER_SHARE_METRIC,
    arg: info
});

export const updateCompanyInvestorsOwnership = (info: {}[]) => ({
    type: SET_COMPANY_INVESTORS_OWNERSHIP,
    arg: info
});

export const updateCompanyFundOwnership = (info: {}[]) => ({
    type: SET_COMPANY_FUND_OWNERSHIP,
    arg: info
});

export const setMenuVisible = (visible: boolean, boxId: number) => ({
    type: TOGGLE_MENU,
    arg: {visible, boxId}
});