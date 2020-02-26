import Table, { OrderType } from "../../models/Table";
import List from "../../models/List";
import { ActivityType } from "../../models/Activity";
import Alert, { AlertLevel } from "../../models/Alert";
import Stock from "../../models/Stock";
import Box from "../../models/Box";

export type Option = {
    name: string | number,
    graphic?: string,
    title?: string,
    data?: string,
    altData?: string,
    onClick?: (value: any, 
               ...other: any) => void,
    selected?: boolean
}
export type ReportData = {
    orderHistory: Table,
    activities: List,
    headlines: List,
    headlinesTitle?: string,
    ordersDisplayOptions: Option[],
    activityDisplayOptions: Option[],
    headlinesMenuItems: Option[],
    alertDisplayOptions: Option[],
    displayedOrdersLevel: OrderType,
    displayedActivitiesLevel: ActivityType,
    displayedAlertsLevel: AlertLevel,
    alerts: Alert[],
    menuVisible: boolean
}
export type Company = {
    [index: string]: CompanyInfo,
    profile: {},
    ceo: {},
    executives: {}[],
    price: {},
    valuation: {},
    growth: {},
    margin: {},
    management: {},
    financialStrength: {},
    perShare: {},
    investors: {}[],
    funds: {}[],
    sections: Option[]
}
export interface CompanyInfo {}
export type CompanyInfoType = 'general' | 'metric';
export type ChartOptions = {
        chart: {},
        grid: {},
        xaxis: {},
        stroke: {},
        noData: {},
        series: {name: string,
                 data: {x: string, 
                        y: number}[]}[]
}
export type Chart = {
    stock: Stock | null,
    options: ChartOptions,
    status: string,
}
export type HelpType = {
    visible: boolean,
    sections: Option[]
}
export type Tracker = {
    object: WebSocket | number | null,
        mode: TrackerMode
}
export type TrackerMode = 'simulated' | 'live';
export type Exchange = {name: string, 
                        code: string};
export type Stocks = {
    stockIndexOptions: Option[],
    stockIndex: string,
    marketList: Stock[],
    watchList: Stock[],
    allStocksList: Stock[],
    marketSearchResultsList: Stock[],
    watchListSearchResultsList: Stock[],
    exchanges: Option[],
    selectedExchange: Exchange,
    chart: Chart,
    company: Company,
    tracker: {
        object: WebSocket | number | null,
        mode: TrackerMode
    }
}

export interface State {
    stocks: Stocks,

    buyButtons: Option[],
    sellButtons: Option[],
    reportButtons: Option[],
    generalButtons: Option[],
    reportData: ReportData,
    boxes: Box[],
    selectedBox: number | null,

    balance: number,
    buyQty: number,
    sellQty: number,

    help: HelpType
}