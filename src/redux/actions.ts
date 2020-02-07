import IndexData from '../IndexData';
import { BoxType } from '../BoxData';

export const SELECT_INDEX = 'SELECT_INDEX';
export const SEARCH_FOR_INDEX = 'SEARCH_FOR_INDEX';
export const ADD_TO_WATCHLIST = 'ADD_TO_WATCHLIST';
export const REMOVE_FROM_WATCHLIST = 'REMOVE_FROM_WATCHLIST';

export const SET_CHART_TYPE = 'SET_CHART_TYPE';
export const SET_CHART_YEAR = 'SET_CHART_SOURCE';
export const SET_CHART_RESOLUTION = 'SET_CHART_RESOLUTION';

export const ADD_CHART = 'ADD_CHART';
export const ADD_BOX = 'ADD_BOX';
export const REMOVE_BOX = 'REMOVE_BOX';

export const DISMISS_ALERT = 'DISMISS_ALERT';

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

export const setChartResolution = (resolution: string, chartId: number, year: number) => ({
    type: SET_CHART_RESOLUTION,
    arg: { resolution: resolution, chartId: chartId, year: year }
});

export const addChart = (chartId: number) => ({
    type: ADD_CHART,
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

export const dismissAlert = (id: number) => ({
    type: DISMISS_ALERT,
    arg: id
});