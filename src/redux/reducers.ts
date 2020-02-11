import * as actions from './actions';
import { state as initialState, ChartType, ChartDescriptor, store } from './store';
import IndexData from '../IndexData';
import { Action } from './actions';
import ChartData, { ChartDataEntry } from '../ChartData';
import BoxData, { BoxType } from '../BoxData';
import TableData, { TableRow, TableCell } from '../TableData';
import ListData, { ListDataRow } from '../ListData';
import { fullDate, shortDate, time } from '../utility';
import localforage from 'localforage';
import Store from '../Store';

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
                open += history.entries[index2].open;
                close += history.entries[index2].close;
                high += history.entries[index2].high;
                low += history.entries[index2].low;
                if (index2 === endIndex - 1) {
                    formattedData.entries.push(new ChartDataEntry(history.entries[index2].time, Number((open / entries).toFixed(2)), Number((close / entries).toFixed(2)), Number((high / entries).toFixed(2)), Number((low / entries).toFixed(2))));
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

const getLatestChartId = (chartList: ChartDescriptor[]) => {
    return chartList.length !== 0 ? chartList[chartList.length - 1].id : 0;
}

const getTargetIndex = (charts: ChartDescriptor[], id: number | null) => {
    if (id === null) {
        return null;
    } else {
        for (const chart of charts) {
            if (chart.id === id) {
                return chart.activeIndex;
            }
        }
    }
}

const recordOrder = (type: 'buy' | 'sell', indexName: string,  price: number, qty: number) => {
    const date = new Date();

    const order = new TableRow([new TableCell(time(new Date())),
    new TableCell(indexName.toUpperCase()),
    new TableCell(price.toString()),
    new TableCell(qty.toString()),
    new TableCell(type === 'buy' ? 'BUY' : 'SELL', type === 'buy' ? 'buy' : 'sell')]);
    Store.order(order, (data) => store.dispatch(actions.setOrderHistory(data)));

    const activity = new ListDataRow(type ==='buy' ? actions.activityLabels.buy(qty, indexName, price) : actions.activityLabels.sell(qty, indexName, price), fullDate(date));
    Store.activity(activity, (activities) => store.dispatch(actions.setActivities(new ListData(activities))));
    
    return { price };
}

export const main = (state = initialState, action: Action) => {
    switch (action.type) {
        case actions.SELECT_INDEX:
            const charts5 = state.charts.slice();
            for (const chart of charts5) {
                if (chart.id === state.selectedChart) {
                    chart.activeIndex = action.arg as IndexData;
                    break;
                }
            }
            return Object.assign({}, state, {charts: charts5});
        case actions.SEARCH_FOR_INDEX:
            return Object.assign({}, state, {searchResultsList: state.indicesList.filter(index => index.name.toLowerCase().includes(action.arg.toLowerCase() as string))});    
        case actions.ADD_TO_WATCHLIST:
            return !state.watchList.find(item => item.name === (action.arg as IndexData).name) ? Object.assign({}, state, {watchList: state.watchList.concat([action.arg as IndexData])}) : state;    
        case actions.REMOVE_FROM_WATCHLIST:
            return Object.assign({}, state, {watchList: state.watchList.filter(index => index !== (action.arg as IndexData))});    
        case actions.SET_CHART_TYPE:
            const chartTypeArg = action.arg as { chartType: string, chartId: number };
            const charts1 = state.charts.slice();
            for (let index = 0; index < charts1.length; index++) {
                if (charts1[index].id === chartTypeArg.chartId) {
                    charts1[index].type = chartTypeArg.chartType as ChartType;
                    break;
                }
            }
            return Object.assign({}, state, {charts: charts1});    
        case actions.SET_CHART_YEAR:
            const yearArg = action.arg as {year: number, chartId: number};
            const year = Number(yearArg.year), chart = state.charts.find(chart => chart.id === yearArg.chartId), data = formatIndexHistory(state.chartDataSourceArchive.find(entry => entry.year === year)!.data, chart!.resolution);
            const charts2 = state.charts.slice();
            for (let index = 0; index < charts2.length; index++) {
                if (charts2[index].id === yearArg.chartId) {
                    charts2[index].data = data;
                    charts2[index].year = year;
                    break;
                }
            }
            return Object.assign({}, state, {charts: charts2});    
        case actions.SET_CHART_RESOLUTION:
            const resolutionArg = action.arg as {resolution: string, chartId: number, 
                year: number};
            const formatted = formatIndexHistory(state.chartDataSourceArchive.find(entry => entry.year === resolutionArg.year)!.data, resolutionArg.resolution);
            const charts3 = state.charts.slice();
            for (let index = 0; index < charts3.length; index++) {
                if (charts3[index].id === resolutionArg.chartId) {
                    charts3[index].data = formatted;
                    charts3[index].resolution = resolutionArg.resolution;
                    break;
                }
            }
            return Object.assign({}, state, {charts: charts3});
        case actions.ADD_CHART:
            const addChartArg = action.arg as {chartId: number};
            const charts4 = state.charts.slice();
            let copy = {} as ChartDescriptor;
            for (let index = 0; index < charts4.length; index++) {
                if (charts4[index].id === addChartArg.chartId) {
                    copy = Object.assign({}, charts4[index]);
                    break;
                }
            }
            copy.id = getLatestChartId(state.charts) + 1;
            return Object.assign({}, state, {charts: state.charts.concat([copy])});    
        case actions.REMOVE_CHART:
            const removeChartArg = action.arg as {chartId: number};
            return state.charts.length !== 1 ? Object.assign({}, state, {charts: state.charts.filter(chart => chart.id !== removeChartArg.chartId)}) : state; 
        case actions.SELECT_CHART:
            const id = action.arg as number;
            return Object.assign({}, state, {selectedChart: state.selectedChart === id ? null : id});   
        case actions.ADD_BOX:
            let boxTitle = BoxData.getTitle(action.arg as BoxType);
            return Object.assign({}, state, {boxes: state.boxes.concat([new BoxData(getLatestBoxId(state.boxes) + 1, boxTitle, action.arg as BoxType)])});    
        case actions.REMOVE_BOX:
            return Object.assign({}, state, {boxes: state.boxes.filter(box => box.id !== action.arg as number)});    
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
            return Object.assign({}, state, {boxes: boxes_2});
        case actions.DISMISS_ALERT:
            return Object.assign({}, state, {reportData: {...state.reportData, alerts: state.reportData.alerts.filter(alert => alert.id !== action.arg as number)}})
        case actions.BUY:
            if ((action.arg as number) !== 0) {
                let index = getTargetIndex(state.charts.slice(), state.selectedChart);
                if (index !== null) {
                    const { price: spent } = recordOrder('buy', index!.name, index!.current * state.buyQty, state.buyQty);
                    return Object.assign({}, state, {balance: state.balance - spent});
                } else {
                    return state;
                }
            } else {
                return state;
            }
        case actions.SELL:
            if ((action.arg as number) !== 0) {
                let index2 = getTargetIndex(state.charts.slice(), state.selectedChart);
                if (index2 !== null) {
                    const { price: earned } = recordOrder('sell', index2!.name, index2!.current * state.sellQty, state.buyQty);
                    return Object.assign({}, state, {balance: state.balance + earned});
                } else {
                    return state;
                }
            } else {
                return state;
            }
        case actions.SET_BUY_QTY:
            return Object.assign({}, state, {buyQty: action.arg as number});
        case actions.SET_SELL_QTY:
            return Object.assign({}, state, {sellQty: action.arg as number});
        case actions.SET_ORDER_HISTORY:
            console.log(action.arg as TableData)
            return Object.assign({}, state, {reportData: {...state.reportData, orderHistory: (action.arg as TableData)}});
        case actions.SET_ACTIVITIES:
            return Object.assign({}, state, {reportData: {...state.reportData, activities: (action.arg as ListData)}});
        default:
            return state;
    }
}