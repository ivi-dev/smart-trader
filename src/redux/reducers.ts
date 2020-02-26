import * as actions from './actions';
import { state as initialState, store } from './store/store';
import Stock from '../models/Stock';
import { Action } from './actions';
import Box, { BoxType } from '../models/Box';
import Table, { TableRow, TableCell } from '../models/Table';
import ListData, { ListRow } from '../models/List';
import { time, date } from '../utility';
import DB, { Key } from '../services/DB';
import Alert from '../models/Alert';
import { Option, ChartOptions } from './store/types';
import FinnHub, { CompanyGeneralInfoSections, 
    CompanyMetricSections } from '../services/FinnHub';
import { filterStocksByIndex, fetchStocks, clearChart, stopSimulatedTracker, startSimulatedTracker, stopLiveTracker, startLiveTracker, filterStocksByName, stockIsListed, findExchange, determineCompanyInfoType, findCompanySectionByName, getLatestBoxId, getBoxType, getLatestAlertId, toggleTracker, toggleTrackerMode, selectSection } from './store/methods';

export const mainReducer = (state = initialState, action: Action) => {
    // Stocks
    switch (action.type) {
        case actions.SET_STOCK_INDEX:
            const index = action.arg as string;
            DB.save(Key.STOCK_INDEX, index);
            return Object.assign({}, state, {stockIndex: index},
                                            {marketList: filterStocksByIndex(state.allStocksList, 
                                                                             index)});

        case actions.START_STOCK_TRACK:
            const stock = action.arg as Stock;
            if (stock) {
                let tracker = null;
                /* istanbul ignore next */
                FinnHub.quote(stock.name, quote => {
                    const stock_ = new Stock(stock.id, stock.name, 
                                             quote.o, quote.c, 
                                             quote.h, quote.l, 
                                             quote.c, quote.pc - quote.c, 
                                             stock.companyName);
                    store.dispatch(actions.setStockDetails(stock_));
                    let options = clearChart(state.chart);
                    if (state.tracker.mode === 'simulated') {
                        stopSimulatedTracker(state.tracker.object as number, () => {
                            tracker = startSimulatedTracker(stock_, options);
                            store.dispatch(actions.setTracker(tracker));
                        });
                    } else {
                        stopLiveTracker(state.tracker.object as WebSocket, 
                                        state.chart.stock!, () => {
                                            tracker = startLiveTracker(stock_, options, () => {});
                                            store.dispatch(actions.setTracker(tracker));
                        });
                    }
                    FinnHub.companyProfile(stock.name, profile => 
                        store.dispatch(actions.updateCompanyProfile(profile)), error => {
                            store.dispatch(actions.addAlert('error', error.message))
                    });
                }, 
                error => {
                    store.dispatch(actions.addAlert('error', error.message));
                });
                DB.save(Key.STOCK, stock);
                return Object.assign({}, state, {chart: {...state.chart, 
                                                         options: {...state.chart.options, 
                                                                   series: [{name: '', data: []}]}, 
                                                         stock: stock, 
                                                         status: 'Loading Data...'}});
            } else {
                return state;
            }

        case actions.SET_STOCKS_LIST:
            const list = action.arg as Stock[];
            return Object.assign({}, state, {allStocksList: list}, 
                                            {marketList: filterStocksByIndex(list, state.stockIndex)});

        case actions.SET_STOCK_DETAILS:
            return Object.assign({}, state, {chart: {...state.chart, stock: action.arg as Stock}});

        case actions.SEARCH_MARKET:
            return Object.assign({}, state, {marketSearchResultsList: 
                                                filterStocksByName(state.marketList, 
                                                                   action.arg as string)});

        case actions.SEARCH_WATCHLIST:
            return Object.assign({}, state, {watchListSearchResultsList: 
                                                filterStocksByName(state.watchList, 
                                                                   action.arg as string)});

        case actions.ADD_TO_WATCHLIST:
            if (!stockIsListed(action.arg as Stock, state.watchList)) {
                const wacthList = state.watchList.concat([action.arg as Stock]);
                DB.save(Key.WATCHLIST, wacthList);
                return Object.assign({}, state, {watchList: wacthList});
            }
            return state;
            
        case actions.REMOVE_FROM_WATCHLIST:
            const watchList = state.watchList.filter(index => index !== (action.arg as Stock));
            DB.save(Key.WATCHLIST, watchList);
            return Object.assign({}, state, {watchList: watchList});

        case actions.SET_WATCHLIST:
            return Object.assign({}, state, {watchList: action.arg as Stock[]}); 

        case actions.SET_EXCHANGES:
            return Object.assign({}, state, {exchanges: action.arg as Option[]});

        /* istanbul ignore next */
        case actions.SELECT_EXCHANGE:
            const result = findExchange(state.exchanges, action.arg as string);
            if (result) {
                fetchStocks(result.code);
                DB.save(Key.EXCHANGE, result.exchange);
                return Object.assign({}, state, {selectedExchange: result.exchange});
            } else {
                return state;
            }

        case actions.SET_SELECTED_EXCHANGE:
            return Object.assign({}, state, {selectedExchange: {name: action.arg as string}});

        case actions.UPDATE_CHART:
            const options = action.arg as ChartOptions;
            return Object.assign({}, state, {chart: {...state.chart, 
                                                     options: options}});

        case actions.TOGGLE_TRACKER:
            return Object.assign({}, state, {tracker: {...state.tracker, 
                                                       object: toggleTracker(state)}});

        case actions.TOGGLE_TRACKER_MODE:
            const {tracker, mode} = toggleTrackerMode(state);
            return Object.assign({}, state, {tracker: {object: tracker,
                                                       mode: mode}},
                                            {chart: {...state.chart, 
                                                     options: {...state.chart.options, 
                                                               series: [{name: '', 
                                                                         data: []}]}}});

        case actions.SET_TRACKER:
            return Object.assign({}, state, {tracker: {...state.tracker, 
                                                       object: action.arg}});

        // Company
        case actions.SET_COMPANY_PROFILE:
            return Object.assign({}, state, {chart: {...state.chart, company: {...state.chart.company, profile: action.arg}}});

        case actions.SET_CEO_INFO:
            return Object.assign({}, state, {chart: {...state.chart, company: {...state.chart.company, ceo: action.arg}}});

        case actions.SET_EXECUTIVES_LIST:
            return Object.assign({}, state, {chart: {...state.chart, company: {...state.chart.company, executives: action.arg as {}[]}}});

        case actions.SET_COMPANY_PRICE_METRIC:
            return Object.assign({}, state, {chart: {...state.chart, company: {...state.chart.company,  price: action.arg}}});
            
        case actions.SET_COMPANY_VALUATION_METRIC:
            return Object.assign({}, state, {chart: {...state.chart, company: {...state.chart.company, valuation: action.arg}}});

        case actions.SET_COMPANY_GROWTH_METRIC:
            return Object.assign({}, state, {chart: {...state.chart, company: {...state.chart.company, growth: action.arg}}});

        case actions.SET_COMPANY_MARGIN_METRIC:
            return Object.assign({}, state, {chart: {...state.chart, company: {...state.chart.company, margin: action.arg}}});

        case actions.SET_COMPANY_MANAGEMENT_METRIC:
            return Object.assign({}, state, {chart: {...state.chart, company: {...state.chart.company, management: action.arg}}});

        case actions.SET_COMPANY_FINANCIAL_STRENGTH_METRIC:
            return Object.assign({}, state, {chart: {...state.chart, company: {...state.chart.company, financialStrength: action.arg}}});

        case actions.SET_COMPANY_PER_SHARE_METRIC:
            return Object.assign({}, state, {chart: {...state.chart, company: {...state.chart.company, perShare: action.arg}}});

        case actions.SET_COMPANY_INVESTORS_OWNERSHIP:
            return Object.assign({}, state, {chart: {...state.chart, company: {...state.chart.company, investors: action.arg}}});

        case actions.SET_COMPANY_FUND_OWNERSHIP:
            return Object.assign({}, state, {chart: {...state.chart, company: {...state.chart.company, funds: action.arg}}});      

        /* istanbul ignore next */
        case actions.SET_ACTIVE_COMPANY_SECTION:
            const section = action.arg as string;
            const type = determineCompanyInfoType(section);
            const handler = findCompanySectionByName(state.chart.company.sections, section!)!.onClick!;
            if (type === 'general') {
                FinnHub.companyGeneralInfo(state.chart.stock!.name, 
                                           CompanyGeneralInfoSections[section.toLowerCase()], 
                                           data => handler(data), 
                                           error => store.dispatch(actions.addAlert('error', 
                                                                    error.message)));
            } else {
                FinnHub.companyMetrics(state.chart.stock!.name, 
                                       CompanyMetricSections[section.toLowerCase()], 
                                       data => handler(data), 
                                       error => store.dispatch(actions.addAlert('error', 
                                                                error.message)));
            }
            return Object.assign({}, state, {chart: {...state.chart, 
                                                     status: 'Loading Data...', 
                                                     company: {...state.chart.company, 
                                                               sections: selectSection(state.chart.company.sections.slice(), action.arg as string)}}});

        // Trade
        case actions.BUY:
            if (state.buyQty !== 0) {
                let stockBuy = state.chart.stock;
                if (stockBuy !== null) {
                    const orderHistory = Object.assign({}, state.reportData.orderHistory);
                    const activities = Object.assign({}, state.reportData.activities);
                    const order = new TableRow([new TableCell(time(new Date())),
                        new TableCell(state.chart.stock!.name.toUpperCase()),
                        new TableCell((stockBuy!.current * state.buyQty).toString()),
                        new TableCell(state.buyQty.toString()),
                        new TableCell('BUY', 'buy')], 'buy');
                    orderHistory.rows.push(order);
                    activities.items.push(new ListRow(
                        actions.activityLabels.buy(state.buyQty, 
                                                   state.chart.stock!.name.toUpperCase(), 
                                                   stockBuy!.current), 
                                                   'trade', 
                                                   'fas fa-dollar-sign buy'));
                    DB.save(Key.ORDERS, orderHistory);
                    DB.save(Key.ACTIVITIES, activities);
                    DB.save(Key.BALANCE, state.balance - stockBuy!.current * state.buyQty);
                return Object.assign({}, state, {reportData: 
                                                {...state.reportData, 
                                                 orderHistory: orderHistory, 
                                                 activities: activities}}, 
                                                {balance: state.balance - stockBuy!.current * state.buyQty});
                }
            }
            return state;

        case actions.SELL:
            if (state.sellQty !== 0) {
                let stockSell = state.chart.stock;
                if (stockSell !== null) {
                    const orderHistory = Object.assign({}, state.reportData.orderHistory);
                    const activities = Object.assign({}, state.reportData.activities);
                    const order = new TableRow([new TableCell(time(new Date())),
                        new TableCell(state.chart.stock!.name.toUpperCase()),
                        new TableCell((stockSell!.current * state.sellQty).toString()),
                        new TableCell(state.sellQty.toString()),
                        new TableCell('SELL', 'sell')], 'sell');
                    orderHistory.rows.push(order);
                    activities.items.push(new ListRow(
                        actions.activityLabels.sell(state.sellQty, 
                                                    state.chart.stock!.name.toUpperCase(), 
                                                    stockSell!.current), 'trade', 
                                                    'fas fa-dollar-sign sell'));
                    DB.save(Key.ORDERS, orderHistory);
                    DB.save(Key.ACTIVITIES, activities);
                    DB.save(Key.BALANCE, state.balance + stockSell!.current * state.sellQty);
                return Object.assign({}, state, {reportData: 
                                                {...state.reportData, 
                                                 orderHistory: orderHistory, 
                                                 activities: activities}}, 
                                                {balance: state.balance + stockSell!.current * state.sellQty});
                }
            }
            return state;

        case actions.SET_BUY_QTY:
            return Object.assign({}, state, {buyQty: action.arg as number});

        case actions.SET_SELL_QTY:
            return Object.assign({}, state, {sellQty: action.arg as number});

        case actions.UPDATE_BALANCE:
            return Object.assign({}, state, {balance: action.arg as number});


        // Reports
        case actions.ADD_BOX:
            const boxType = action.arg as BoxType;
            let boxTitle = Box.getTitle(boxType);
            const activities = Object.assign({}, state.reportData.activities);
            activities.items.push(new ListRow(actions.activityLabels
                .addBox(boxType), 'application', 'far fa-square', date(new Date())));
            DB.save(Key.ACTIVITIES, activities);
            const boxesAfterAdd = state.boxes.concat([new Box(
                getLatestBoxId(state.boxes) + 1, boxTitle, boxType)]);
            DB.save(Key.BOXES, boxesAfterAdd);
            return Object.assign({}, state, {boxes: boxesAfterAdd}, 
                                            {selectedBox: null});
        
        case actions.REMOVE_BOX:
            const boxId_ = action.arg as number;
            const activities_ = Object.assign({}, state.reportData.activities);
            activities_.items.push(new ListRow(actions.activityLabels.removeBox(getBoxType(state.boxes, boxId_)!), 'application', 'far fa-square', date(new Date())));
            DB.save(Key.ACTIVITIES, activities_);
            const boxesAfterRemove = state.boxes.filter(box => box.id !== boxId_);
            DB.save(Key.BOXES, boxesAfterRemove);
            return Object.assign({}, state, {boxes: boxesAfterRemove}, 
                                            {selectedBox: null});

        case actions.SET_BOXES:
            return Object.assign({}, state, {boxes: action.arg as Array<Box>});

        case actions.SELECT_BOX:
            const id1 = action.arg as number;
            const boxes_3 = state.boxes.slice();
            boxes_3.find(box => box.id === id1)!.menuVisible = false;
            return Object.assign({}, state, {selectedBox: state.selectedBox === id1 ?
                 null : id1}, 
                                            {boxes: boxes_3});

        case actions.MOVE_BOX_BACK:
            const id2 = action.arg as number;
            let boxes_ = state.boxes.slice();
            for (let index = 0; index < boxes_.length; index++) {
                if (boxes_[index].id === id2) {
                    if (boxes_[index] !== boxes_[0]) {
                        const temp = Object.assign({}, boxes_[index - 1]);
                        boxes_[index - 1] = Object.assign({}, boxes_[index]);
                        boxes_[index] = temp;
                    }
                    break;
                }
            }
            DB.save(Key.BOXES, boxes_);
            return Object.assign({}, state, {boxes: boxes_});

        case actions.MOVE_BOX_FORWARD:
            const id3 = action.arg as number;
            let boxes_2 = state.boxes.slice();
            for (let index = 0; index < boxes_2.length; index++) {
                if (boxes_2[index].id === id3) {
                    if (boxes_2[index] !== boxes_2[boxes_2.length - 1]) {
                        const temp = Object.assign({}, boxes_2[index + 1]);
                        boxes_2[index + 1] = Object.assign({}, boxes_2[index]);
                        boxes_2[index] = temp;
                    }
                    break;
                }
            }
            DB.save(Key.BOXES, boxes_2);
            return Object.assign({}, state, {boxes: boxes_2});

        case actions.DISMISS_ALERT:
            const alertId_ = action.arg as number;
            let alerts = [];
            if (alertId_ !== -1) {
                alerts = state.reportData.alerts.filter(alert => alert.id !== alertId_);
                DB.save(Key.ALERTS, alerts);
                return Object.assign({}, state, {reportData: {...state.reportData, 
                    alerts: alerts}});
            }
            return state;

        case actions.SET_DISPLAYED_ORDERS_LEVEL:
            return Object.assign({}, state, {reportData: {...state.reportData, displayedOrdersLevel: action.arg as string}});

        case actions.SET_DISPLAYED_ACTIVITIES_LEVEL:
            return Object.assign({}, state, {reportData: {...state.reportData, displayedActivitiesLevel: action.arg as string}});

        case actions.SET_DISPLAYED_ALERTS_LEVEL:
            return Object.assign({}, state, {reportData: {...state.reportData, displayedAlertsLevel: action.arg as string}});

        case actions.TOGGLE_MENU:
            const boxId = action.arg as number;
            const boxes = state.boxes.slice();
            const box_ = boxes.find(box => box.id === boxId);
            boxes.forEach(box => {if (box.id !== boxId) {box.menuVisible = false}});
            box_!.menuVisible = box_?.menuVisible ? false : true;
            return Object.assign({}, state, {boxes: boxes});

        case actions.ADD_ALERT:
            const {message, level} = action.arg;
            const alerts_ = [
                new Alert(getLatestAlertId(state.reportData.alerts) + 1, 
                message, level)].concat(state.reportData.alerts);
            DB.save(Key.ALERTS, alerts_);
            return Object.assign({}, state, {reportData: {...state.reportData, 
                alerts: alerts_}});

        case actions.SET_ORDER_HISTORY:
            return Object.assign({}, state, {reportData: {...state.reportData, 
                                                          orderHistory: (action.arg as Table)}});

        case actions.SET_ACTIVITIES:
            return Object.assign({}, state, {reportData: {...state.reportData, 
                                                          activities: (action.arg as ListData)}});

        case actions.SET_HEADLINES:
            const { headlines, category } = action.arg as { headlines: ListData, category: string };
            return Object.assign({}, state, {reportData: {...state.reportData, 
                                                          headlines: headlines, 
                                                          headlinesTitle: category}});

        case actions.SET_ALERTS:
            return Object.assign({}, state, {reportData: 
                                            {...state.reportData, 
                                             alerts: action.arg as Alert[]}});


        // Help
        case actions.TOGGLE_HELP:
            const option = action.arg as string
            return Object.assign({}, state, {help: {...state.help, 
                                                    visible: option === 'close' ? 
                                                    false : true}});

        case actions.SET_ACTIVE_HELP_SECTION:
            return Object.assign({}, state, {help: {...state.help, 
                                                    sections: 
                                                        selectSection(state.help.sections.slice(), 
                                                        action.arg)}});

        default:
            return state;
    }
}