import * as actions from './actions';
import { state as initialState } from './store';
import IndexData from '../IndexData';
import { Action } from './actions';
import ChartDataEntry from '../ChartDataEntry';
import BoxData, { BoxType } from '../BoxData';

const formatIndexHistory = (history: ChartDataEntry[], format: string) => {
    const formatter = (history: ChartDataEntry[], chunk: number) => {
        let formattedData: ChartDataEntry[] = [];
        const slices = history.length / chunk;
        const runs = slices % chunk !== 0 ? Math.floor(slices + 1) : slices;
        for (let index = 0; index < runs; index++) {
            let open = 0, close = 0, high = 0, low = 0;
            const startIndex = index !== 0 ? index * chunk : 0,
            endIndex = index !== 0 ? index * chunk + chunk : chunk;
            let entries = 0;
            for (let index2 = startIndex; index2 < endIndex; index2++) {
                if (!history[index2]) {
                    break;
                }
                open += history[index2].open;
                close += history[index2].close;
                high += history[index2].high;
                low += history[index2].low;
                if (index2 === endIndex - 1) {
                    formattedData.push(new ChartDataEntry(history[index2].time, Number((open / entries).toFixed(2)), Number((close / entries).toFixed(2)), Number((high / entries).toFixed(2)), Number((low / entries).toFixed(2))));
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

export const main = (state = initialState, action: Action) => {
    switch (action.type) {
        case actions.SELECT_INDEX:
            return Object.assign({}, state, {selectedIndex: action.arg as IndexData});
        case actions.SEARCH_FOR_INDEX:
            return Object.assign({}, state, {searchResultsList: state.indicesList.filter(index => index.name.toLowerCase().includes(action.arg.toLowerCase() as string))});    
        case actions.ADD_TO_WATCHLIST:
            return Object.assign({}, state, {watchList: state.watchList.concat([action.arg as IndexData])});    
        case actions.REMOVE_FROM_WATCHLIST:
            return Object.assign({}, state, {watchList: state.watchList.filter(index => index !== (action.arg as IndexData))});    
        case actions.SET_CHART_TYPE:
            return Object.assign({}, state, {chartType: (action.arg as string).toLowerCase()});    
        case actions.SET_CHART_DATA_SOURCE:
            const year = Number(action.arg), data = formatIndexHistory(state.chartDataSourceArchive.find(entry => entry.year === year)!.data, state.chartResolution);;
            return Object.assign({}, state, {chartDataSource: year, indexHistory: data});    
        case actions.SET_CHART_RESOLUTION:
            const resolution = action.arg as string;
            const formatted = formatIndexHistory(state.chartDataSourceArchive.find(entry => entry.year === state.chartDataSource)!.data, resolution);
            return Object.assign({}, state, {chartResolution: resolution}, {indexHistory: formatted});    
        case actions.ADD_BOX:
            let boxTitle: string = '';
            switch (action.arg as BoxType) {
                case BoxType.ORDER_HISTORY:
                    boxTitle = 'Order History';
                    break;
                    case BoxType.RECENT_ACTIVIY:
                    boxTitle = 'Recent Activity';
                    break;
                    case BoxType.HEADLINES:
                    boxTitle = 'Headlines';
                    break;
                default:
                    boxTitle = 'Notifications';
                    break;
            }
            return state.boxes.length < 4 ? Object.assign({}, state, {boxes: state.boxes.concat([new BoxData(getLatestBoxId(state.boxes) + 1, boxTitle, action.arg as BoxType)])}) : state;    
        case actions.REMOVE_BOX:
            return Object.assign({}, state, {boxes: state.boxes.filter(box => box.id !== action.arg as number)});    
        case actions.DISMISS_ALERT:
            return Object.assign({}, state, {reportData: {...state.reportData, alerts: state.reportData.alerts.filter(alert => alert.id !== action.arg as number)}})
        default:
            return state;
    }
}