import * as actions from './actions';
import { state as initialState, ChartType, ChartDescriptor, store, fetchStocks } from './store';
import StockData from '../StockData';
import { Action } from './actions';
import ChartData, { ChartDataEntry } from '../ChartData';
import BoxData, { BoxType } from '../BoxData';
import TableData, { TableRow, TableCell } from '../TableData';
import ListData, { ListDataRow } from '../ListData';
import { fullDate, time } from '../utility';
import Storage from '../Storage';
import AlertData, { AlertLevel } from '../AlertData';
import { Option } from './store';
import FinnHub from '../FinnHub';

const formatIndexHistory = (history: ChartData, format: string) => {
    const formatter = (history: ChartData, chunk: number) => {
        let formattedData: ChartData = new ChartData([]);
        const slices = history.entries.length / chunk;
        const runs = slices % chunk !== 0 ? Math.floor(slices + 1) : slices;
        for (let index = 0; index < runs; index++) {
            let open = 0, close = 0, high = 0, low = 0;
            const startIndex = index !== 0 ? index * chunk : 0,
            endIndex = index !== 0 ? index * chunk + chunk : chunk;
            let entries = 0;
            for (let index2 = startIndex; index2 < endIndex; index2++) {
                if (!history.entries[index2]) {
                    break;
                }
                // open += history.entries[index2].open;
                // close += history.entries[index2].close;
                // high += history.entries[index2].high;
                // low += history.entries[index2].low;
                if (index2 === endIndex - 1) {
                    formattedData.entries.push(new ChartDataEntry(
                        history.entries[index2].time, 
                        Number((open / entries).toFixed(2))));
                }
                entries++;
            }
        }
        return formattedData;
    }
    switch (format) {
        case '1d':
            return history;
        case '1w':
            return formatter(history, 7);
        case '1m':
            return formatter(history, 28);
        default:
            return formatter(history, 28 * 3);
    }
}

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
    return alertList.length !== 0 ? alertList[alertList.length - 1].id : 0;
}

// const getLatestChartId = (chartList: ChartDescriptor[]) => {
//     return chartList.length !== 0 ? chartList[chartList.length - 1].id : 0;
// }

// const getTargetIndex = (charts: ChartDescriptor[], id: number | null) => {
//     if (id === null) {
//         return null;
//     } else {
//         for (const chart of charts) {
//             if (chart.id === id) {
//                 return chart.stock.name !== '---' ? chart.stock : null;
//             }
//         }
//     }
// }

const recordOrder = (type: 'buy' | 'sell', indexName: string, 
    price: number, qty: number, balance: number) => {

    const order = new TableRow([new TableCell(time(new Date())),
    new TableCell(indexName.toUpperCase()),
    new TableCell(price.toString()),
    new TableCell(qty.toString()),
    new TableCell(type === 'buy' ? 'BUY' : 'SELL', type === 'buy' ? 'buy' : 'sell')]);
    Storage.order(order, type === 'buy' ? balance - price : balance + price, (data, balance) => {store.dispatch(actions.setOrderHistory(data)); store.dispatch(actions.setBalance(balance))});

    const activity = new ListDataRow(type ==='buy' ? actions.activityLabels.buy(qty, indexName, price) : actions.activityLabels.sell(qty, indexName, price), `far fa-dollar-sign ${type}`, fullDate(new Date()));
    Storage.activity(activity, activities => store.dispatch(actions.setActivities(new ListData(activities))));
    
    return { price };
}

const recordActivity = (activity: ListDataRow) => {
    Storage.activity(activity, activities => store.dispatch(actions.setActivities(new ListData(activities))));
}

const recordAlerts = (alerts: AlertData[]) => {
    Storage.alerts(alerts, alerts => store.dispatch(actions.setAlerts(alerts)));
}

const recordCharts = (charts: ChartDescriptor[]) => {
    Storage.charts(charts, charts => store.dispatch(actions.setCharts(charts)));
};

const recordBoxes = (boxes: BoxData[]) => {
    Storage.boxes(boxes, boxes => store.dispatch(actions.setBoxes(boxes)));
}

const recordWatchlist = (watchList: StockData[]) => {
    Storage.watchList(watchList, watchList => store.dispatch(actions.setWatchList(watchList)));
}

const recordSelectedExchange = (exchange: {name: string, code: string}) => {
    Storage.exchange(exchange, exchange => store.dispatch(actions.setSelectedExchange(exchange.name)));
}

const recordStockStartLetter = (letter: string) => {
    Storage.startLetter(letter, letter => store.dispatch(actions.setStockStartLetter(letter)));
}

export const main = (state = initialState, action: Action) => {
    switch (action.type) {
        case actions.SET_STOCKS_LIST:
            const stocksList = action.arg as Array<StockData>;
            return Object.assign({}, state, {allStocksList: stocksList}, 
                {stocksList: stocksList.filter(stock => stock.name.toLowerCase().startsWith(state.stockStartLetter.toLowerCase()))});
        case actions.SELECT_STOCK:
            const stockData = action.arg as StockData;
            // for (const chart of charts5) {
            //     if (chart.id === state.selectedChart) {
            //         chart.activeIndex = stockData;
            //         chart.data = state.chartDataSourceArchive[0].data
            //         break;
            //     }
            // }
            // recordCharts(charts5);
            FinnHub.track(stockData.name, data_ => {
                let data = Object.assign({}, state.chart.data);
                console.log(data)
                const date = new Date(data_.t);
                const time = `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate()}`;
                if (Object.keys(data).length === 0) {
                    data = new ChartData([new ChartDataEntry(time, data_.p)]);
                } else {
                    data.entries.push(new ChartDataEntry(time, data_.p));
                }
                store.dispatch(actions.setChartData(data));
            });
            return state;
        case actions.SET_CHART_DATA:
            // console.log(action.arg)
            return Object.assign({}, state, {chart: {...state.chart, data: action.arg as ChartData}});
        case actions.SEARCH_FOR_INDEX:
            return Object.assign({}, state, {marketSearchResultsList: state.stocksList.filter(index => index.name.toLowerCase().includes(action.arg.toLowerCase() as string))});    
        case actions.SEARCH_WATCHLIST:
            return Object.assign({}, state, {watchListSearchResultsList: state.watchList.filter(index => index.name.toLowerCase().includes(action.arg.toLowerCase() as string))});    
        case actions.ADD_TO_WATCHLIST:
            if (!state.watchList.find(item => item.name === (action.arg as StockData).name)) {
                recordWatchlist(state.watchList.concat([action.arg as StockData]));
            }
            return state;    
        case actions.SET_WATCHLIST:
            return Object.assign({}, state, {watchList: action.arg as StockData[]}); 
        case actions.SET_EXCHANGES:
            return Object.assign({}, state, {exchanges:  action.arg as Option[]});
        case actions.SELECT_EXCHANGE:
            const exchange = action.arg as string;
            let exch = '', exch_ = {name: '', code: ''};
            for (const exchange_ of state.exchanges) {
                if (exchange_.name === exchange) {
                    exch = exchange_.data!.toString();
                    exch_ = {name: exchange_.name, code: exchange_.data!};
                    break;
                }
            }
            fetchStocks(exch);
            recordSelectedExchange(exch_);
            return state;
        case actions.SET_SELECTED_EXCHANGE:
            return Object.assign({}, state, {selectedExchange: {name: action.arg as string}});   
        case actions.REMOVE_FROM_WATCHLIST:
            recordWatchlist(state.watchList.filter(index => index !== (action.arg as StockData)));
            return state;
        case actions.SET_CHARTS:
            return Object.assign({}, state, {charts: action.arg as ChartDescriptor[]});   
        case actions.ADD_BOX:
            const boxType = action.arg as BoxType;
            let boxTitle = BoxData.getTitle(boxType);
            recordActivity(new ListDataRow(actions.activityLabels.addBox(boxType), 'far fa-square', fullDate(new Date())));
            recordBoxes(state.boxes.concat([new BoxData(getLatestBoxId(state.boxes) + 1, boxTitle, boxType)]));
            return Object.assign({}, state, {selectedBox: null});
        case actions.SET_BOXES:
            return Object.assign({}, state, {boxes: action.arg as Array<BoxData>});
        case actions.REMOVE_BOX:
            recordActivity(new ListDataRow(actions.activityLabels.removeBox(getBoxType(state.boxes, action.arg as number)!), 'far fa-square', fullDate(new Date())));
            const boxes = state.boxes.filter(box => box.id !== action.arg as number);
            recordBoxes(boxes);
            return Object.assign({}, state, {selectedBox: null});    
        case actions.SELECT_BOX:
            const id1 = action.arg as number;
            return Object.assign({}, state, {selectedBox: state.selectedBox === id1 ? null : id1});
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
            return state;
        case actions.DISMISS_ALERT:
            const alertId_ = action.arg as number;
            if (alertId_ === -1) {
                recordAlerts([]);
            } else {
                recordAlerts(state.reportData.alerts.filter(alert => alert.id !== alertId_));
            }
            return state;
        case actions.SET_DISPLAYED_ALERTS_LEVEL:
            return Object.assign({}, state, {displayedAlertsLevel: action.arg as string});
        case actions.ADD_ALERT:
            recordAlerts(state.reportData.alerts.concat([new AlertData(getLatestAlertId(state.reportData.alerts) + 1, 'Lorem ipsum', action.arg as AlertLevel)]));
            return state;
        case actions.SET_ALERTS:
            return Object.assign({}, state, {reportData: {...state.reportData, alerts: action.arg as AlertData[]}});
        case actions.BUY:
            if ((action.arg as number) !== 0) {
                let stockBuy = state.chart.stock;
                if (stockBuy !== null) {
                    recordOrder('buy', stockBuy!.name, stockBuy!.current * state.buyQty, state.buyQty, state.balance);
                }
            }
            return state;
        case actions.SELL:
            if ((action.arg as number) !== 0) {
                let stockSell = state.chart.stock;
                if (stockSell !== null) {
                    recordOrder('sell', stockSell!.name, stockSell!.current * state.sellQty, state.buyQty, state.balance);
                }
            }
            return state;
        case actions.SET_BUY_QTY:
            return Object.assign({}, state, {buyQty: action.arg as number});
        case actions.SET_SELL_QTY:
            return Object.assign({}, state, {sellQty: action.arg as number});
        case actions.SET_ORDER_HISTORY:
            return Object.assign({}, state, {reportData: {...state.reportData, orderHistory: (action.arg as TableData)}});
        case actions.SET_ACTIVITIES:
            return Object.assign({}, state, {reportData: {...state.reportData, activities: (action.arg as ListData)}});
        case actions.SET_HEADLINES:
            const { headlines, category } = action.arg as { headlines: ListData, category: string };
            return Object.assign({}, state, {reportData: {...state.reportData, headlines: headlines, headlinesTitle: category}});
        case actions.TOGGLE_HELP:
            const option = action.arg as string
            return Object.assign({}, state, {help: {...state.help, visible: option === 'close' ? false : true}});
        case actions.SET_ACTIVE_HELP_SECTION:
            const sections = state.help.sections.slice();
            sections.forEach(section => {if (section.name === action.arg as string) {section.selected = true} else {delete section.selected}});
            return Object.assign({}, state, {help: {...state.help, sections: sections}});
        case actions.SET_BALANCE:
            return Object.assign({}, state, {balance: action.arg as number});
        case actions.SELECT_STOCK_START_LETTER:
            const letter = action.arg as string;
            let stocks = state.allStocksList.filter(stock => stock.name.toLowerCase().startsWith(letter.toLowerCase()));
            recordStockStartLetter(letter);
            return Object.assign({}, state, {stocksList: stocks});
        case actions.SET_STOCK_START_LETTER:
            return Object.assign({}, state, {stockStartLetter: action.arg as string});
        default:
            return state;
    }
}