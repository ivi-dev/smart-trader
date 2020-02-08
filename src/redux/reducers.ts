import * as actions from './actions';
import { state as initialState, ChartType, ChartDescriptor } from './store';
import IndexData from '../IndexData';
import { Action } from './actions';
import ChartData, { ChartDataEntry } from '../ChartData';
import BoxData, { BoxType } from '../BoxData';

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
        case actions.DISMISS_ALERT:
            return Object.assign({}, state, {reportData: {...state.reportData, alerts: state.reportData.alerts.filter(alert => alert.id !== action.arg as number)}})
        default:
            return state;
    }
}