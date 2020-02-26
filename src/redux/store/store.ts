import { createStore } from 'redux';
import { mainReducer } from '../reducers';
import Table from '../../models/Table';
import ListData from '../../models/List';
import Box from '../../models/Box';
import * as actions from '../actions';
import { Category } from '../../services/News';
import { alphabet, digits } from '../../utility';
import { help } from '../../help';
import { State } from './types';
import { ORDER_HEADERS } from './data';
import { fetchHeadlines } from './methods';

export const state: State = {
    stocks: {
        stockIndex: 'a',
        allStocksList: [],
        marketList: [],
        watchList: [],
        marketSearchResultsList: [],
        watchListSearchResultsList: [],
        exchanges: [],
        selectedExchange: {name: '', code: ''},
        stockIndexOptions: alphabet.concat(digits).map(
                                        character => ({name: character})),
        chart: {
            stock: null,
            status: 'No Data Yet.',
            options: {
                chart: {
                    type: 'line',
                    width: '100%',
                    height: '90%',
                    foreColor: 'rgba(255, 255, 255, 0.5)',
                    animations: {
                        enabled: false
                    }
                },
                stroke: {width: 2},
                grid: {borderColor: 'rgba(255, 255, 255, 0.2)'},
                xaxis: {
                    axisBorder: {show: false},
                    axisTicks: {show: false}
                },
                noData: {
                    text: 'No data yet.',
                    style: {fontSize: '20px'}
                },
                series: [{name: '', data: []}]
            }
        },
        company: {
            profile: {}, ceo: {},
            executives: [], price: {},
            growth: {}, margin: {},
            management: {}, financialStrength: {},
            perShare: {}, investors: [],
            funds: [], valuation: {},
            sections: [{name: 'Profile', onClick: data => store.dispatch(actions.updateCompanyProfile(data)), data: 'profile', selected: true}, 
                        {name: 'CEO (US Companies Only)', onClick: data => store.dispatch(actions.updateCEOInfo(data)), data: 'ceo'}, 
                        {name: 'Executives', onClick: data => store.dispatch(actions.updateExecutivesList(data)), data: 'executives'}, 
                        {name: 'Price', onClick: data => store.dispatch(actions.updateCompanyPriceMetric(data)), data: 'price'},
                        {name: 'Valuation', onClick: data => store.dispatch(actions.updateCompanyValuationMetric(data)), data: 'valuation'},
                        {name: 'Growth', onClick: data => store.dispatch(actions.updateCompanyGrowthMetric(data)), data: 'growth'},
                        {name: 'Margin', onClick: data => store.dispatch(actions.updateCompanyMarginMetric(data)), data: 'margin'},
                        {name: 'Management', onClick: data => store.dispatch(actions.updateCompanyManagementMetric(data)), data: 'management'},
                        {name: 'Financial Strength', onClick: data => store.dispatch(actions.updateCompanyFinancialStrengthMetric(data)), data: 'financialStrength'},
                        {name: 'Per Share', onClick: data => store.dispatch(actions.updateCompanyPerShareMetric(data)), data: 'perShare'},
                        {name: 'Investors Ownership', onClick: data => store.dispatch(actions.updateCompanyInvestorsOwnership(data)),data: 'investors'},
                        {name: 'Fund Ownership', onClick: data => store.dispatch(actions.updateCompanyFundOwnership(data)),data: 'funds'}]
        },
        tracker: {
            object: null,
            mode: 'simulated'
        }
    },

    buyButtons: [{name: 'Buy', onClick: () => store.dispatch(actions.buy())}],
    sellButtons: [{name: 'Sell', onClick: () => store.dispatch(actions.sell())}],
    reportButtons: [{name: '', graphic: 'fas fa-history', title: 'Add a History Report', data: 'history', onClick: () => store.dispatch(actions.addBox(Box.getBoxType('history')))},
                    {name: '', graphic: 'fas fa-flag', title: 'Add an Activity Report', data: 'activity', onClick: () => store.dispatch(actions.addBox(Box.getBoxType('activity')))},
                    {name: '', graphic: 'far fa-newspaper', title: 'Add a Headlines Report', data: 'headlines', onClick: () => store.dispatch(actions.addBox(Box.getBoxType('headlines')))}, 
                    {name: '', graphic: 'far fa-bell', title: 'Add a Notifications Report', data: 'alerts', onClick: () => store.dispatch(actions.addBox(Box.getBoxType('alerts')))}],
    generalButtons: [{name: '', graphic: 'fas fa-question-circle', onClick: () => store.dispatch(actions.toggleHelp('open'))}],
    reportData: {
        orderHistory: new Table(ORDER_HEADERS, []),
        activities: new ListData([]),
        headlines: new ListData([]),
        headlinesTitle: 'Business',
        ordersDisplayOptions: [
            {name: 'all', onClick: () => store.dispatch(actions.setOrdersDisplayLevel('all'))}, 
            {name: 'buy', onClick: () => store.dispatch(actions.setOrdersDisplayLevel('buy'))}, 
            {name: 'sell', onClick: () => store.dispatch(actions.setOrdersDisplayLevel('sell'))}
        ],
        activityDisplayOptions: [
            {name: 'all', onClick: () => store.dispatch(actions.setDisplayedActivitiesLevel('all'))},
            {name: 'application', onClick: () => store.dispatch(actions.setDisplayedActivitiesLevel('application'))},
            {name: 'trade', onClick: () => store.dispatch(actions.setDisplayedActivitiesLevel('trade'))}
        ],
        headlinesMenuItems: [
            {name: 'business', onClick: (category) => fetchHeadlines(category as Category)}, 
            {name: 'entertainment', onClick: (category) => fetchHeadlines(category as Category)}, 
            {name: 'general', onClick: (category) => fetchHeadlines(category as Category)}, 
            {name: 'health', onClick: (category) => fetchHeadlines(category as Category)}, 
            {name: 'science', onClick: (category) => fetchHeadlines(category as Category)}, 
            {name: 'sports', onClick: (category) => fetchHeadlines(category as Category)}, 
            {name: 'technology', onClick: (category) => fetchHeadlines(category as Category)}
        ],
        alertDisplayOptions: [
            {name: 'all', onClick: () => store.dispatch(actions.setDisplayedAlertsLevel('all'))},
            {name: 'info', onClick: () => store.dispatch(actions.setDisplayedAlertsLevel('info'))},
            {name: 'warning', onClick: () => store.dispatch(actions.setDisplayedAlertsLevel('warning'))},
            {name: 'error', onClick: () => store.dispatch(actions.setDisplayedAlertsLevel('error'))}
        ],
        menuVisible: false,
        displayedOrdersLevel: 'all',
        displayedActivitiesLevel: 'all',
        displayedAlertsLevel: 'all',
        alerts: []
    },
    boxes: [],
    selectedBox: null,

    balance: 10000,
    buyQty: 1,
    sellQty: 1,

    help: {
        visible: false,
        sections: [
            {name: 'Overview', data: help.overview.text, altData: help.overview.next, onClick: (section) => store.dispatch(actions.setActiveHelpSection(section.toString())), selected: true},
            {name: 'Navigation', data: help.basicNavigation.text, onClick: (section) => store.dispatch(actions.setActiveHelpSection(section.toString()))},
            {name: 'Stocks/Companies', data: help.stocksAndCompanies.text, onClick: (section) => store.dispatch(actions.setActiveHelpSection(section.toString()))},
            {name: 'Trading', data: help.trading.text, onClick: (section) => store.dispatch(actions.setActiveHelpSection(section.toString()))},
            {name: 'Workspace', data: help.workspace.text, onClick: (section) => store.dispatch(actions.setActiveHelpSection(section.toString()))}
        ]
    }
}

export const store = createStore(mainReducer);