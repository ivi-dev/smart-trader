import * as actions from './actions';
import { state as initialState, 
    store, fetchStocks, ChartOptions } from './store';
import StockData from '../StockData';
import { Action } from './actions';
import BoxData, { BoxType } from '../BoxData';
import TableData, { TableRow, TableCell } from '../TableData';
import ListData, { ListDataRow } from '../ListData';
import { fullDate, time } from '../utility';
import Storage from '../Storage';
import AlertData from '../AlertData';
import { Option } from './store';
import { number } from '../randomizer';
import FinnHub from '../FinnHub';

const getLatestBoxId = (boxList: BoxData[]) => {
    return boxList.length !== 0 ? boxList[boxList.length - 1].id : 0;
}

const getBoxType = (boxes: BoxData[], id: number) => {
    for (const box of boxes) {
        if (box.id === id) {
            return box.type;
        }
    }
}

const getLatestAlertId = (alertList: AlertData[]) => {
    return alertList.length !== 0 ? alertList[0].id : 0;
}

const recordActivity = (activities: ListData) => {
    Storage.activities(activities);
}

const recordAlerts = (alerts: AlertData[]) => {
    Storage.alerts(alerts);
}

const recordBoxes = (boxes: BoxData[]) => {
    Storage.boxes(boxes);
}

const recordWatchlist = (watchList: StockData[]) => {
    Storage.watchList(watchList);
}

const recordSelectedExchange = (exchange: {name: string, code: string}) => {
    Storage.exchange(exchange);
}

const recordSelectedStock = (stock: StockData) => {
    Storage.stock(stock);
}

const recordStockStartLetter = (letter: string) => {
    Storage.startLetter(letter, letter => 
        store.dispatch(actions.setStockStartLetter(letter)));
}

const recordBalance = (balance: number) => {
    Storage.balance(balance);
}

const startSimulatedTracker = (stock: StockData, options: ChartOptions) => {
    return setInterval(() => {
        options.series[0].data.push({x: time(new Date()), y: number(50, 100)});
        store.dispatch(actions.updateChartOptions(options));
        store.dispatch(actions.updateStock(new StockData(stock.id, stock.name, stock.open, stock.close, stock.high, stock.low, number(50, 100), number(-5, 5), stock.companyName)));
    }, 2000);
}

let timestamp = 0;
const startLiveTracker = (stock: StockData, options: ChartOptions) => {
    return FinnHub.startTrack(stock.name, data_ => {
        if (data_.t > timestamp + 2000) {
            options.series[0].data.push(
            {x: time(new Date(data_.t)), y: data_.p});
            store.dispatch(actions.updateChartOptions(options));
            store.dispatch(actions.updateStock(new StockData(stock.id, stock.name, 
            stock.open, stock.close, stock.high > data_.p ? stock.high : data_.p, 
            stock.low < data_.p ? stock.low : data_.p, data_.p, data_.p - stock.close, 
            stock.companyName)));
            timestamp = data_.t;
        }
    });
}

const stopLiveTracker = (tracker: WebSocket, stock: StockData,
    callback?: () => void) => {
        FinnHub.stopTrack(tracker, stock.name, callback);
}

export const main = (state = initialState, action: Action) => {
    switch (action.type) {
        case actions.SET_STOCKS_LIST:
            const list = action.arg as Array<StockData>;
            return Object.assign({}, state, {allStocksList: list}, 
                {stocksList: list.filter(stock => 
                    stock.name.toLowerCase()
                    .startsWith(state.stockStartLetter
                        .toLowerCase()))});

        case actions.SELECT_STOCK_START_LETTER:
            const letter = action.arg as string;
            let stocks = state.allStocksList.filter(stock => 
                stock.name.toLowerCase().startsWith(letter.toLowerCase()));
            recordStockStartLetter(letter);
            return Object.assign({}, state, {stocksList: stocks});

        case actions.SET_STOCK_START_LETTER:
            return Object.assign({}, state, {stockStartLetter: action.arg as string});

        case actions.SELECT_STOCK:
            const stock = action.arg as StockData;
            if (!stock) {
                return state;
            }
            let tracker_ = null;
            
            FinnHub.quote(stock.name, quote => {
                const stock_ = new StockData(stock.id, 
                    stock.name, quote.o, quote.c, quote.h, quote.l, 
                    quote.c, quote.pc - quote.c, stock.companyName);
                store.dispatch(actions.updateStock(stock_));

                if (state.simulateTracker) {
                    clearInterval(state.tracker as number);
                    let chartOptions = Object.assign({}, state.chart.options);
                    chartOptions.series[0].data = [];
                    tracker_ = startSimulatedTracker(stock_, chartOptions);
                    store.dispatch(actions.setTracker(tracker_));
                } else {
                    let chartOptions = Object.assign({}, state.chart.options);
                    chartOptions.series[0].data = [];
                    stopLiveTracker(state.tracker as WebSocket, state.chart.stock!, 
                        () => {
                            tracker_ = startLiveTracker(stock_, options);
                            store.dispatch(actions.setTracker(tracker_));
                        });
                }

            }, error => {
                if (error) {
                    store.dispatch(actions.addAlert('error', error.message))
                }
            });
            FinnHub.companyProfile(stock.name, profile => 
                store.dispatch(actions.updateCompanyProfile(profile)), error => {
                    if (error) {
                        store.dispatch(actions.addAlert('error', error.message))
                    }
            });
            recordSelectedStock(stock);
            return Object.assign({}, state, {tracker: tracker_}, 
                {chart: {...state.chart, options: {...state.chart.options, series: [{data: []}]}, stock: stock, status: 'Loading Data...'}});

        case actions.UPDATE_COMPANY_PROFILE:
            return Object.assign({}, state, {chart: {...state.chart, company: {...state.chart.company, profile: action.arg}}});

        case actions.UPDATE_CEO_INFO:
            return Object.assign({}, state, {chart: {...state.chart, company: {...state.chart.company, ceo: action.arg}}});

        case actions.UPDATE_EXECUTIVES_LIST:
            return Object.assign({}, state, {chart: {...state.chart, company: {...state.chart.company, executives: action.arg as {}[]}}});

        case actions.UPDATE_COMPANY_PRICE_METRIC:
            return Object.assign({}, state, {chart: {...state.chart, company: {...state.chart.company,  price: action.arg}}});
            
        case actions.UPDATE_COMPANY_VALUATION_METRIC:
            return Object.assign({}, state, {chart: {...state.chart, company: {...state.chart.company, valuation: action.arg}}});

        case actions.UPDATE_COMPANY_GROWTH_METRIC:
            return Object.assign({}, state, {chart: {...state.chart, company: {...state.chart.company, growth: action.arg}}});

        case actions.UPDATE_COMPANY_MARGIN_METRIC:
            return Object.assign({}, state, {chart: {...state.chart, company: {...state.chart.company, margin: action.arg}}});

        case actions.UPDATE_COMPANY_MANAGEMENT_METRIC:
            return Object.assign({}, state, {chart: {...state.chart, company: {...state.chart.company, management: action.arg}}});

        case actions.UPDATE_COMPANY_FINANCIAL_STRENGTH_METRIC:
            return Object.assign({}, state, {chart: {...state.chart, company: {...state.chart.company, financialStrength: action.arg}}});

        case actions.UPDATE_COMPANY_PER_SHARE_METRIC:
            return Object.assign({}, state, {chart: {...state.chart, company: {...state.chart.company, perShare: action.arg}}});

        case actions.UPDATE_COMPANY_INVESTORS_OWNERSHIP:
            return Object.assign({}, state, {chart: {...state.chart, company: {...state.chart.company, investors: action.arg}}});

        case actions.UPDATE_COMPANY_FUND_OWNERSHIP:
            return Object.assign({}, state, {chart: {...state.chart, company: {...state.chart.company, funds: action.arg}}});

        case actions.UPDATE_STOCK:
            return Object.assign({}, state, {chart: {...state.chart, stock: action.arg as StockData}});

        case actions.SEARCH_FOR_STOCK:
            return Object.assign({}, state, {marketSearchResultsList: 
                state.stocksList.filter(index => 
                    index.name.toLowerCase().includes(action.arg.toLowerCase() as string))});   

        case actions.SEARCH_WATCHLIST:
            return Object.assign({}, state, {watchListSearchResultsList: state.watchList.filter(index => index.name.toLowerCase().includes(action.arg.toLowerCase() as string))});    

        case actions.ADD_TO_WATCHLIST:
            if (!state.watchList.find(item => item.name === (action.arg as StockData).name)) {
                const watchListAfterAdd = state.watchList.concat([action.arg as StockData]);
                recordWatchlist(watchListAfterAdd);
                return Object.assign({}, state, {watchList: watchListAfterAdd});
            }
            return state;
            
        case actions.REMOVE_FROM_WATCHLIST:
            const watchListAfterRemove = state.watchList.filter(index => index !== (action.arg as StockData));
            recordWatchlist(watchListAfterRemove);
            return Object.assign({}, state, {watchList: watchListAfterRemove});

        case actions.UPDATE_WATCHLIST:
            return Object.assign({}, state, {watchList: action.arg as StockData[]}); 

        case actions.UPDATE_EXCHANGES:
            return Object.assign({}, state, {exchanges: action.arg as Option[]});

        case actions.SELECT_EXCHANGE:
            const exchange = action.arg as string;
            let exchangeCode = '', exchange_ = {name: '', code: ''};
            for (const exch of state.exchanges) {
                if (exch.name === exchange) {
                    exchangeCode = exch.data!.toString();
                    exchange_ = {name: exch.name, code: exch.data!};
                    break;
                }
            }
            fetchStocks(exchangeCode);
            recordSelectedExchange(exchange_);
            return Object.assign({}, state, {selectedExchange: exchange_});

        case actions.UPDATE_SELECTED_EXCHANGE:
            return Object.assign({}, state, {selectedExchange: {name: action.arg as string}});

        case actions.BUY:
            if ((action.arg as number) !== 0) {
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
                    activities.items.push(new ListDataRow(
                        actions.activityLabels.buy(state.buyQty, 
                            state.chart.stock!.name.toUpperCase(), 
                            stockBuy!.current), 'trade', 'fas fa-dollar-sign buy'));
                    Storage.orders(orderHistory);
                    recordActivity(activities);
                    recordBalance(state.balance - stockBuy!.current * state.buyQty);
                return Object.assign({}, state, {reportData: 
                    {...state.reportData, orderHistory: orderHistory, 
                        activities: activities}}, 
                    {balance: state.balance - stockBuy!.current * state.buyQty},
                    );
                }
            }
            return state;

        case actions.SELL:
            if ((action.arg as number) !== 0) {
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
                    activities.items.push(new ListDataRow(
                        actions.activityLabels.sell(state.sellQty, 
                            state.chart.stock!.name.toUpperCase(), stockSell!.current), 'trade', 'fas fa-dollar-sign sell'));
                    Storage.orders(orderHistory);
                    recordActivity(activities);
                    recordBalance(state.balance + stockSell!.current * state.sellQty);
                return Object.assign({}, state, {reportData: 
                    {...state.reportData, orderHistory: orderHistory, 
                        activities: activities}}, 
                    {balance: state.balance + stockSell!.current * state.sellQty});
                }
            }
            return state;

        case actions.SET_BUY_QTY:
            return Object.assign({}, state, {buyQty: action.arg as number});

        case actions.SET_SELL_QTY:
            return Object.assign({}, state, {sellQty: action.arg as number});




        case actions.UPDATE_CHART_OPTIONS:
            const options = action.arg as ChartOptions;
            return Object.assign({}, state, 
                {chart: {...state.chart, options: options}});

        case actions.TOGGLE_TRACKER:
            let tracker = null;
            if (state.simulateTracker) {
                if (state.tracker) {
                    clearInterval(state.tracker as number);
                } else {
                    let options = Object.assign({}, state.chart.options);
                    tracker = startSimulatedTracker(state.chart.stock!, options);
                }
            } else {
                if (state.tracker) {
                    stopLiveTracker(state.tracker as WebSocket, state.chart.stock!);
                } else {
                    let options = Object.assign({}, state.chart.options);
                    tracker = startLiveTracker(state.chart.stock!, options);
                }
            }
            return Object.assign({}, state, {tracker: tracker});

        case actions.SET_TRACKER_MODE:
            let tracker_2 = null;
            if (state.simulateTracker) {
                if (state.tracker) {
                    clearInterval(state.tracker as number);
                    let options = Object.assign({}, state.chart.options);
                    options.series[0].data = [];
                    tracker_2 = startLiveTracker(state.chart.stock!, options);
                }
            } else {
                if (state.tracker) {
                    let options = Object.assign({}, state.chart.options);
                    const stock_ = state.chart.stock;
                    options.series[0].data = [];
                    FinnHub.stopTrack(state.tracker as WebSocket, 
                        state.chart.stock!.name, () => {
                            store.dispatch(actions.setTracker(
                                startSimulatedTracker(stock_!, 
                                options)));
                    });
                }
            }
            return Object.assign({}, state, {tracker: tracker_2}, 
                {simulateTracker: action.arg as boolean}, {chart: {...state.chart, 
                    options: {...state.chart.options, series: [{data: []}]}}});

        case actions.SET_TRACKER:
            return Object.assign({}, state, {tracker: action.arg});




        case actions.ADD_BOX:
            const boxType = action.arg as BoxType;
            let boxTitle = BoxData.getTitle(boxType);
            const activities = Object.assign({}, state.reportData.activities);
            activities.items.push(new ListDataRow(actions.activityLabels
                .addBox(boxType), 'application', 'far fa-square', fullDate(new Date())));
            recordActivity(activities);
            const boxesAfterAdd = state.boxes.concat([new BoxData(
                getLatestBoxId(state.boxes) + 1, boxTitle, boxType)]);
            recordBoxes(boxesAfterAdd);
            return Object.assign({}, state, {boxes: boxesAfterAdd}, {selectedBox: null});
        
        case actions.REMOVE_BOX:
            const boxId_ = action.arg as number;
            const activities_ = Object.assign({}, state.reportData.activities);
            activities_.items.push(new ListDataRow(actions.activityLabels.removeBox(getBoxType(state.boxes, boxId_)!), 'application', 'far fa-square', fullDate(new Date())));
            recordActivity(activities_);
            const boxesAfterRemove = state.boxes.filter(box => box.id !== boxId_);
            recordBoxes(boxesAfterRemove);
            return Object.assign({}, state, {boxes: boxesAfterRemove}, {selectedBox: null});

        case actions.SET_BOXES:
            return Object.assign({}, state, {boxes: action.arg as Array<BoxData>});

        case actions.SELECT_BOX:
            const id1 = action.arg as number;
            const boxes_3 = state.boxes.slice();
            boxes_3.find(box => box.id === id1)!.menuVisible = false;
            return Object.assign({}, state, {selectedBox: state.selectedBox === id1 ?
                 null : id1}, {boxes: boxes_3});

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
            recordBoxes(boxes_);
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
            recordBoxes(boxes_2);
            return Object.assign({}, state, {boxes: boxes_2});

        case actions.DISMISS_ALERT:
            const alertId_ = action.arg as number;
            let alerts = [];
            if (alertId_ !== -1) {
                alerts = state.reportData.alerts.filter(alert => alert.id !== alertId_);
                recordAlerts(alerts);
                return Object.assign({}, state, {reportData: {...state.reportData, 
                    alerts: alerts}});
            }
            return state;

        case actions.SET_DISPLAYED_ALERTS_LEVEL:
            return Object.assign({}, state, {reportData: {...state.reportData, displayedAlertsLevel: action.arg as string}});

        case actions.SET_DISPLAYED_ACTIVITIES_LEVEL:
            return Object.assign({}, state, {reportData: {...state.reportData, displayedActivitiesLevel: action.arg as string}});

        case actions.SET_DISPLAYED_ORDERS_LEVEL:
            return Object.assign({}, state, {reportData: {...state.reportData, displayedOrdersLevel: action.arg as string}});

        case actions.TOGGLE_MENU:
            const {visible, boxId} = action.arg as {visible: boolean, boxId: number};
            const boxes = state.boxes.slice();
            const box_ = boxes.find(box => box.id === boxId);
            boxes.forEach(box => {if (box.id !== boxId) {box.menuVisible = false}});
            box_!.menuVisible = box_?.menuVisible ? false : true;
            return Object.assign({}, state, {boxes: boxes});

        case actions.ADD_ALERT:
            const {message, level} = action.arg;
            const alerts_ = [
                new AlertData(getLatestAlertId(state.reportData.alerts) + 1, 
                message, level)].concat(state.reportData.alerts);
            recordAlerts(alerts_);
            return Object.assign({}, state, {reportData: {...state.reportData, 
                alerts: alerts_}});

        case actions.UPDATE_ALERTS:
            return Object.assign({}, state, {reportData: 
                {...state.reportData, alerts: action.arg as AlertData[]}});

        case actions.SET_ORDER_HISTORY:
            return Object.assign({}, state, {reportData: {...state.reportData, orderHistory: (action.arg as TableData)}});

        case actions.UPDATE_ACTIVITIES:
            return Object.assign({}, state, {reportData: {...state.reportData, activities: (action.arg as ListData)}});

        case actions.UPDATE_HEADLINES:
            const { headlines, category } = action.arg as { headlines: ListData, category: string };
            return Object.assign({}, state, {reportData: {...state.reportData, headlines: headlines, headlinesTitle: category}});

        case actions.TOGGLE_HELP:
            const option = action.arg as string
            return Object.assign({}, state, {help: {...state.help, visible: option === 'close' ? false : true}});

        case actions.SET_ACTIVE_HELP_SECTION:
            const sections = state.help.sections.slice();
            sections.forEach(section => {if (section.name === action.arg as string) {section.selected = true} else {delete section.selected}});
            return Object.assign({}, state, {help: {...state.help, sections: sections}});

        case actions.SET_ACTIVE_COMPANY_SECTION:
            const sections_ = state.chart.company.sections.slice();
            const sectionName = action.arg as string, stock_ = state.chart.stock!;
            sections_.forEach(section => {if (section.name === sectionName) {section.selected = true} else {delete section.selected}});

            switch (sectionName.toLowerCase()) {
                case 'ceo (us companies only)':
                    FinnHub.ceo(stock_.name, ceo => 
                        store.dispatch(actions.updateCEOInfo(ceo)), error => {
                            if (error) {
                                store.dispatch(actions.addAlert('error', error.message))
                            }
                        });
                    break;
                case 'executives':
                    FinnHub.executives(stock_.name, list => 
                        store.dispatch(actions.updateExecutivesList(list)), error => {
                            if (error) {
                                store.dispatch(actions.addAlert('error', error.message))
                            }
                    });
                    break;
                case 'investors ownership':
                    FinnHub.investors(stock_.name, info => 
                        store.dispatch(actions.updateCompanyInvestorsOwnership(info)), error => {
                            if (error) {
                                store.dispatch(actions.addAlert('error', error.message))
                            }
                    });
                    break;
                case 'fund ownership':
                    FinnHub.funds(stock_.name, info => 
                        store.dispatch(actions.updateCompanyFundOwnership(info)), error => {
                            if (error) {
                                store.dispatch(actions.addAlert('error', error.message))
                            }
                    });
                    break;
                case 'price':
                    FinnHub.metrics(stock_.name, 'price', info => 
                        store.dispatch(actions.updateCompanyPriceMetric(info)), error => {
                            if (error) {
                                store.dispatch(actions.addAlert('error', error.message))
                            }
                    });
                    break;
                case 'valuation':
                    FinnHub.metrics(stock_.name, 'valuation', info => 
                        store.dispatch(actions.updateCompanyValuationMetric(info)), error => {
                            if (error) {
                                store.dispatch(actions.addAlert('error', error.message))
                            }
                    });
                    break;
                case 'growth':
                    FinnHub.metrics(stock_.name, 'growth', info => 
                        store.dispatch(actions.updateCompanyGrowthMetric(info)), error => {
                            if (error) {
                                store.dispatch(actions.addAlert('error', error.message))
                            }
                    });
                    break;
                case 'margin':
                    FinnHub.metrics(stock_.name, 'margin', info => 
                        store.dispatch(actions.updateCompanyMarginMetric(info)), error => {
                            if (error) {
                                store.dispatch(actions.addAlert('error', error.message))
                            }
                    });
                    break;
                case 'management':
                    FinnHub.metrics(stock_.name, 'management', info => 
                        store.dispatch(actions.updateCompanyManagementMetric(info)), error => {
                            if (error) {
                                store.dispatch(actions.addAlert('error', error.message))
                            }
                    });
                    break;
                case 'financial strength':
                    FinnHub.metrics(stock_.name, 'financialStrength', info => 
                        store.dispatch(actions.updateCompanyFinancialStrengthMetric(info)), error => {
                            if (error) {
                                store.dispatch(actions.addAlert('error', error.message))
                            }
                    });
                    break;
                default:
                    FinnHub.metrics(stock_.name, 'perShare', info => 
                        store.dispatch(actions.updateCompanyPerShareMetric(info)), error => {
                            if (error) {
                                store.dispatch(actions.addAlert('error', error.message))
                            }
                    });
            }

            return Object.assign({}, state, {chart: {...state.chart, status: 'Loading Data...', company: {...state.chart.company, sections: sections_}}});

        case actions.UPDATE_BALANCE:
            return Object.assign({}, state, {balance: action.arg as number});

        default:
            return state;
    }
}