import * as actions from '../../redux/actions';
import { activityLabels } from '../../redux/actions';
import Stock from '../../models/Stock';
import Box, { BoxType } from '../../models/Box';
import Table from '../../models/Table';
import List, { ListRow } from '../../models/List';
import Alert from '../../models/Alert';
import { isVowel } from '../../utility';

test('creates a \'setStocksList\' action', () => {
    const stocks = [new Stock(1, 'ABC', 0, 0, 0, 0, 0, 0, '')];
    expect(actions.setStocksList(stocks)).toStrictEqual({type: actions.SET_STOCKS_LIST, arg: stocks});
});

test('creates a \'selectStock\' action', () => {
    const stock = new Stock(1, 'ABC', 0, 0, 0, 0, 0, 0, '');
    expect(actions.selectStock(stock)).toStrictEqual({type: actions.SELECT_STOCK, arg: stock});
});

test('creates a \'searchForIndex\' action', () => {
    const name = 'ABC';
    expect(actions.searchForIndex(name)).toStrictEqual({type: actions.SEARCH_FOR_STOCK, arg: name});
});

test('creates a \'searchWatchlist\' action', () => {
    const name = 'ABC';
    expect(actions.searchWatchlist(name)).toStrictEqual({type: actions.SEARCH_WATCHLIST, arg: name});
});

test('creates a \'addToWatchlist\' action', () => {
    const stock = new Stock(1, 'ABC', 0, 0, 0, 0, 0, 0, '');
    expect(actions.addToWatchlist(stock)).toStrictEqual({type: actions.ADD_TO_WATCHLIST, arg: stock});
});

test('creates a \'removeFromWatchlist\' action', () => {
    const stock = new Stock(1, 'ABC', 0, 0, 0, 0, 0, 0, '');
    expect(actions.removeFromWatchlist(stock)).toStrictEqual({type: actions.REMOVE_FROM_WATCHLIST, arg: stock});
});

test('creates a \'addBox\' action', () => {
    const boxType = BoxType.ALERTS;
    expect(actions.addBox(boxType)).toStrictEqual({type: actions.ADD_BOX, arg: boxType});
});

test('creates a \'removeBox\' action', () => {
    const number = 1;
    expect(actions.removeBox(number)).toStrictEqual({type: actions.REMOVE_BOX, arg: number});
});

test('creates a \'setBoxes\' action', () => {
    const boxes = [new Box(1, 'Alerts', BoxType.ALERTS)];
    expect(actions.setBoxes(boxes)).toStrictEqual({type: actions.SET_BOXES, arg: boxes});
});

test('creates a \'selectBox\' action', () => {
    const number = 1;
    expect(actions.selectBox(number)).toStrictEqual({type: actions.SELECT_BOX, arg: number});
});

test('creates a \'moveBoxBack\' action', () => {
    const number = 1;
    expect(actions.moveBoxBack(number)).toStrictEqual({type: actions.MOVE_BOX_BACK, arg: number});
});

test('creates a \'moveBoxForward\' action', () => {
    const number = 1;
    expect(actions.moveBoxForward(number)).toStrictEqual({type: actions.MOVE_BOX_FORWARD, arg: number});
});

test('creates a \'dismissAlert\' action', () => {
    const number = 1;
    expect(actions.dismissAlert(number)).toStrictEqual({type: actions.DISMISS_ALERT, arg: number});
});

test('creates a \'buy\' action', () => {
    expect(actions.buy()).toStrictEqual({type: actions.BUY, arg: null});
});

test('creates a \'sell\' action', () => {
    expect(actions.sell()).toStrictEqual({type: actions.SELL, arg: null});
});

test('creates a \'setBuyQty\' action', () => {
    const value = 2;
    expect(actions.setBuyQty(value)).toStrictEqual({type: actions.SET_BUY_QTY, arg: value});
});

test('creates a \'setSellQty\' action', () => {
    const value = 2;
    expect(actions.setSellQty(value)).toStrictEqual({type: actions.SET_SELL_QTY, arg: value});
});

test('creates a \'setOrderHistory\' action', () => {
    const history = new Table([], []);
    expect(actions.setOrderHistory(history)).toStrictEqual({type: actions.SET_ORDER_HISTORY, arg: history});
});

test('creates a \'updateActivities\' action', () => {
    const activities = new List([new ListRow('')]);
    expect(actions.updateActivities(activities)).toStrictEqual({type: actions.UPDATE_ACTIVITIES, arg: activities});
});

test('creates a \'updateHeadlines\' action', () => {
    const headlines = new List([new ListRow('')]), category = 'business';
    expect(actions.updateHeadlines(headlines, category)).toStrictEqual({type: actions.UPDATE_HEADLINES, arg: {headlines, category}});
});

test('creates a \'toggleHelp\' action', () => {
    const option = 'open';
    expect(actions.toggleHelp(option)).toStrictEqual({type: actions.TOGGLE_HELP, arg: option});
});

test('creates a \'setActiveHelpSection\' action', () => {
    const section = 'Section 1';
    expect(actions.setActiveHelpSection(section)).toStrictEqual({type: actions.SET_ACTIVE_HELP_SECTION, arg: section});
});

test('creates a \'updateBalance\' action', () => {
    const balance = 10;
    expect(actions.updateBalance(balance)).toStrictEqual({type: actions.UPDATE_BALANCE, arg: balance});
});

test('creates a \'setDisplayedAlertsLevel\' action', () => {
    const level = 'info';
    expect(actions.setDisplayedAlertsLevel(level)).toStrictEqual({type: actions.SET_DISPLAYED_ALERTS_LEVEL, arg: level});
});

test('creates a \'setDisplayedActivitiesLevel\' action', () => {
    const level = 'trede';
    expect(actions.setDisplayedActivitiesLevel(level)).toStrictEqual({type: actions.SET_DISPLAYED_ACTIVITIES_LEVEL, arg: level});
});

test('creates a \'setOrdersDisplayLevel\' action', () => {
    const level = 'sell';
    expect(actions.setOrdersDisplayLevel(level)).toStrictEqual({type: actions.SET_DISPLAYED_ORDERS_LEVEL, arg: level});
});

test('creates a \'addAlert\' action', () => {
    const action = {message: 'Info', level: 'info'};
    expect(actions.addAlert(action.level, action.message)).toStrictEqual({type: actions.ADD_ALERT, arg: action});
});

test('creates a \'updateAlerts\' action', () => {
    const alerts = [new Alert(1, 'Info')];
    expect(actions.updateAlerts(alerts)).toStrictEqual({type: actions.UPDATE_ALERTS, arg: alerts});
});

test('creates a \'updateExchanges\' action', () => {
    const exchanges = [{name: 'Exchange 1'}];
    expect(actions.updateExchanges(exchanges)).toStrictEqual({type: actions.UPDATE_EXCHANGES, arg: exchanges});
});

test('creates a \'selectExchange\' action', () => {
    const exchange = 'Exchange 1';
    expect(actions.selectExchange(exchange)).toStrictEqual({type: actions.SELECT_EXCHANGE, arg: exchange});
});

test('creates a \'updateSelectedExchange\' action', () => {
    const exchange = 'Exchange 1';
    expect(actions.updateSelectedExchange(exchange)).toStrictEqual({type: actions.UPDATE_SELECTED_EXCHANGE, arg: exchange});
});

test('creates a \'updateWatchList\' action', () => {
    const stocks = [new Stock(1, 'ABC', 0, 0, 0, 0, 0, 0, 'def')];
    expect(actions.updateWatchList(stocks)).toStrictEqual({type: actions.UPDATE_WATCHLIST, arg: stocks});
});

test('creates a \'setStockStartLetter\' action', () => {
    const letter = 'a';
    expect(actions.setStockIndex(letter)).toStrictEqual({type: actions.SET_STOCK_INDEX, arg: letter});
});

test('creates a \'updateChartOptions\' action', () => {
    const options = {
            chart: {},
            grid: {},
            xaxis: {},
            stroke: {},
            noData: {},
            series: [{name: '',
                    data: [{x: '', y: 0}]}]
    }
    expect(actions.updateChartOptions(options)).toStrictEqual({type: actions.UPDATE_CHART_OPTIONS, arg: options});
});

test('creates a \'toggleTracker\' action', () => {
    expect(actions.toggleTracker()).toStrictEqual({type: actions.TOGGLE_TRACKER, arg: null});
});

test('creates a \'setTrackerMode\' action', () => {
    const mode = false;
    expect(actions.setTrackerMode(mode)).toStrictEqual({type: actions.SET_TRACKER_MODE, arg: mode});
});

test('creates a \'setTracker\' action', () => {
    const tracker = {};
    expect(actions.setTracker(tracker)).toStrictEqual({type: actions.SET_TRACKER, arg: tracker});
});

test('creates a \'updateStock\' action', () => {
    const stock = new Stock(1, 'ABC', 0, 0, 0, 0, 0, 0, 'def');
    expect(actions.updateStock(stock)).toStrictEqual({type: actions.UPDATE_STOCK, arg: stock});
});

test('creates a \'updateCompanyProfile\' action', () => {
    const profile = {};
    expect(actions.updateCompanyProfile(profile)).toStrictEqual({type: actions.SET_COMPANY_PROFILE, arg: profile});
});

test('creates a \'updateCEOInfo\' action', () => {
    const ceoInfo = {};
    expect(actions.updateCEOInfo(ceoInfo)).toStrictEqual({type: actions.SET_CEO_INFO, arg: ceoInfo});
});

test('creates a \'updateExecutivesList\' action', () => {
    const list = [{}];
    expect(actions.updateExecutivesList(list)).toStrictEqual({type: actions.SET_EXECUTIVES_LIST, arg: list});
});

test('creates a \'setActiveCompanySection\' action', () => {
    const section = 'Section 1';
    expect(actions.setActiveCompanySection(section)).toStrictEqual({type: actions.SET_ACTIVE_COMPANY_SECTION, arg: section});
});

test('creates a \'updateCompanyPriceMetric\' action', () => {
    const price = {};
    expect(actions.updateCompanyPriceMetric(price)).toStrictEqual({type: actions.SET_COMPANY_PRICE_METRIC, arg: price});
});

test('creates a \'updateCompanyValuationMetric\' action', () => {
    const valuation = {};
    expect(actions.updateCompanyValuationMetric(valuation)).toStrictEqual({type: actions.SET_COMPANY_VALUATION_METRIC, arg: valuation});
});

test('creates a \'updateCompanyGrowthMetric\' action', () => {
    const growth = {};
    expect(actions.updateCompanyGrowthMetric(growth)).toStrictEqual({type: actions.SET_COMPANY_GROWTH_METRIC, arg: growth});
});

test('creates a \'updateCompanyMarginMetric\' action', () => {
    const margin = {};
    expect(actions.updateCompanyMarginMetric(margin)).toStrictEqual({type: actions.SET_COMPANY_MARGIN_METRIC, arg: margin});
});

test('creates a \'updateCompanyManagementMetric\' action', () => {
    const management = {};
    expect(actions.updateCompanyManagementMetric(management)).toStrictEqual({type: actions.SET_COMPANY_MANAGEMENT_METRIC, arg: management});
});

test('creates a \'updateCompanyFinancialStrengthMetric\' action', () => {
    const financialStrength = {};
    expect(actions.updateCompanyFinancialStrengthMetric(financialStrength)).toStrictEqual({type: actions.SET_COMPANY_FINANCIAL_STRENGTH_METRIC, arg: financialStrength});
});

test('creates a \'updateCompanyPerShareMetric\' action', () => {
    const perShare = {};
    expect(actions.updateCompanyPerShareMetric(perShare)).toStrictEqual({type: actions.SET_COMPANY_PER_SHARE_METRIC, arg: perShare});
});

test('creates a \'updateCompanyInvestorsOwnership\' action', () => {
    const investorsOwnership = [{}];
    expect(actions.updateCompanyInvestorsOwnership(investorsOwnership)).toStrictEqual({type: actions.SET_COMPANY_INVESTORS_OWNERSHIP, arg: investorsOwnership});
});

test('creates a \'updateCompanyFundOwnership\' action', () => {
    const fundOwnership = [{}];
    expect(actions.updateCompanyFundOwnership(fundOwnership)).toStrictEqual({type: actions.SET_COMPANY_FUND_OWNERSHIP, arg: fundOwnership});
});

test('creates a \'setMenuVisible\' action', () => {
    const data = {visible: true, boxId: 1};
    expect(actions.setMenuVisible(data.visible, data.boxId)).toStrictEqual({type: actions.TOGGLE_MENU, arg: data});
});

test('correct activity labels are generated', () => {
    const amount = 1, symbolName = 'ABC', price = 1;
    expect(activityLabels.sell(amount, symbolName, price)).toBe(`You sold ${amount} of ${symbolName} (+${(new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'})).format(price)})`);
    expect(activityLabels.buy(amount, symbolName, price)).toBe(`You bought ${amount} of ${symbolName} (-${(new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'})).format(price)})`);

    let boxType = BoxType.ALERTS;
    expect(activityLabels.addBox(boxType)).toBe(`You added a new ${boxType} report`);
    expect(activityLabels.removeBox(boxType)).toBe(`You removed ${isVowel(boxType.toString().split('')[0]) ?
    'an' : 'a'} ${boxType} report`);
    boxType = BoxType.RECENT_ACTIVIY;
    expect(activityLabels.removeBox(boxType)).toBe(`You removed ${isVowel(boxType.toString().split('')[0]) ?
    'an' : 'a'} ${boxType} report`);
});