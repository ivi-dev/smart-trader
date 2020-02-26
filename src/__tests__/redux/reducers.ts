import * as actions from '../../redux/actions';
import Stock from '../../models/Stock';
import { filterStocksByIndex, filterStocksByName } from '../../redux/store/methods';
import { store } from '../../redux/store/store';
import Table, { TableCell, TableRow } from '../../models/Table';
import Box, { BoxType } from '../../models/Box';
import Alert from '../../models/Alert';
import { ORDER_HEADERS } from '../../redux/store/data';
import List, { ListRow } from '../../models/List';

test('set the stock index and filter the market list marketList', () => {
    const index = 'b';
    const list = [new Stock(0, 'ABC', 0, 0, 0, 0, 10, 0),
                  new Stock(1, 'BCD', 0, 0, 0, 0, 0, 0)];
    store.dispatch(actions.setStocksList(list));
    store.dispatch(actions.setStockIndex(index));
    expect(store.getState().stocks.stockIndex).toBe(index);
    expect(store.getState().stocks.marketList).toStrictEqual(filterStocksByIndex(list, index));
});

test('start tracking a stock in simulated mode', () => {
    const stock = new Stock(0, 'ABC', 0, 0, 0, 0, 0, 0);
    store.dispatch(actions.startStockTrack(stock));
    expect(store.getState().stocks.chart.stock).toStrictEqual(stock);
    expect(store.getState().stocks.chart.status).toBe('Loading Data...');
    expect(store.getState().stocks.chart.options.series).toStrictEqual([{name: '', data: []}]);
});

test('start tracking a stock in live mode', () => {
    const stock = new Stock(0, 'ABC', 0, 0, 0, 0, 0, 0);
    store.getState().stocks.tracker.mode = 'live';
    store.dispatch(actions.startStockTrack(stock));
    store.getState().stocks.tracker.mode = 'simulated';
});

test('set the stock list', () => {
    const list = [new Stock(0, 'ABC', 0, 0, 0, 0, 0, 0),
                  new Stock(1, 'BCD', 0, 0, 0, 0, 0, 0)];
    store.dispatch(actions.setStocksList(list));
    expect(store.getState().stocks.allStocksList).toStrictEqual(list);
    expect(store.getState().stocks.marketList).toStrictEqual(filterStocksByIndex(list, 
                                                                          store.getState()
                                                                          .stocks.stockIndex));
});

test('set the stock details', () => {
    const stock = new Stock(0, 'ABC', 0, 0, 0, 0, 0, 0);
    store.dispatch(actions.setStockDetails(stock));
    expect(store.getState().stocks.chart.stock).toStrictEqual(stock);
});

test('set the market search results', () => {
    const list = [new Stock(0, 'B', 0, 0, 0, 0, 0, 0),
                  new Stock(1, 'BA', 0, 0, 0, 0, 0, 0)];
    const name = 'a';
    store.dispatch(actions.setStocksList(list));
    store.dispatch(actions.searchMarket(name));
    expect(store.getState().stocks.marketSearchResultsList)
        .toStrictEqual(filterStocksByName(list, name));
});

test('set the watchlist search results', () => {
    const list = [new Stock(0, 'B', 0, 0, 0, 0, 0, 0),
                  new Stock(1, 'BA', 0, 0, 0, 0, 0, 0)];
    const name = 'a';
    store.dispatch(actions.addToWatchlist(list[0]));
    store.dispatch(actions.addToWatchlist(list[1]));
    store.dispatch(actions.searchWatchlist(name));
    expect(store.getState().stocks.watchListSearchResultsList)
        .toStrictEqual(filterStocksByName(list, name));
});

test('add stocks to the watchlist', () => {
    const list = [new Stock(0, 'B', 0, 0, 0, 0, 0, 0),
                  new Stock(1, 'BA', 0, 0, 0, 0, 0, 0)];
    for (let index = 0; store.getState().stocks.watchList.length; index++) {
        store.dispatch(actions.removeFromWatchlist(store.getState().stocks.watchList[0]));
    }
    store.dispatch(actions.addToWatchlist(list[0]));
    store.dispatch(actions.addToWatchlist(list[1]));
    expect(store.getState().stocks.watchList).toStrictEqual(list);
});

test('try adding already existing stocks to the watchlist', () => {
    const watchlistBefore = store.getState().stocks.watchList;
    const list = [new Stock(0, 'B', 0, 0, 0, 0, 0, 0),
                  new Stock(1, 'BA', 0, 0, 0, 0, 0, 0)];
    store.dispatch(actions.addToWatchlist(list[0]));
    store.dispatch(actions.addToWatchlist(list[1]));
    expect(store.getState().stocks.watchList).toStrictEqual(watchlistBefore);
});

test('remove a stock from the watchlist', () => {
    for (let index = 0; store.getState().stocks.watchList.length; index++) {
        store.dispatch(actions.removeFromWatchlist(store.getState().stocks.watchList[0]));
    }
    expect(store.getState().stocks.watchList).toStrictEqual([]);
});

test('set the watchlist', () => {
    const list = [new Stock(0, 'B', 0, 0, 0, 0, 0, 0),
                  new Stock(1, 'BA', 0, 0, 0, 0, 0, 0)];
    for (let index = 0; store.getState().stocks.watchList.length; index++) {
        store.dispatch(actions.removeFromWatchlist(store.getState().stocks.watchList[0]));
    }
    store.dispatch(actions.setWatchList(list));
    expect(store.getState().stocks.watchList).toStrictEqual(list);
});

test('set the exchanges list', () => {
    const list = [{name: 'Exchange 1', code: '1'},
                  {name: 'Exchange 2', code: '2'}];
    store.dispatch(actions.setExchanges(list));
    expect(store.getState().stocks.exchanges).toStrictEqual(list);
});

test('set the selected exchange', () => {
    const exchange = {name: 'Exchange 1', code: '1'};
    store.dispatch(actions.setSelectedExchange(exchange.name));
    expect(store.getState().stocks.selectedExchange).toStrictEqual({name: exchange.name});
});

test('update the chart', () => {
    const stroke = 1;
    const options = Object.assign({}, store.getState().stocks.chart.options);
    options.stroke = stroke;
    store.dispatch(actions.updateChart(options));
    expect(store.getState().stocks.chart.options.stroke).toBe(stroke);
});

test('toggle a simulated tracker', () => {
    store.dispatch(actions.toggleTracker());
    expect(store.getState().stocks.tracker.object).toBeTruthy();
    store.dispatch(actions.toggleTracker());
    expect(store.getState().stocks.tracker.object).toBeFalsy();
});

test('toggle the tracker\'s mode', () => {
    store.getState().stocks.tracker.object = 1;
    expect(store.getState().stocks.tracker.object).toBe(1);
    store.dispatch(actions.toggleTrackerMode());
    expect(store.getState().stocks.tracker.object).toBeInstanceOf(WebSocket);
});

test('set a simulated tracker', () => {
    const tracker = 1;
    store.dispatch(actions.setTracker(tracker));
    expect(store.getState().stocks.tracker.object).toBe(tracker);
});

describe('Company info section', () => {
    test('set a company\'s profile', () => {
        const profile = {value: 'Company'};
        store.dispatch(actions.updateCompanyProfile(profile));
        expect(store.getState().stocks.company.profile).toStrictEqual(profile);
    });
    
    test('set a company\'s ceo info', () => {
        const ceo = {value: 'CEO'};
        store.dispatch(actions.updateCEOInfo(ceo));
        expect(store.getState().stocks.company.ceo).toStrictEqual(ceo);
    });

    test('set a company\'s executives info', () => {
        const executives = [{name: 'Executive 1'}, {name: 'Executive 2'}];
        store.dispatch(actions.updateExecutivesList(executives));
        expect(store.getState().stocks.company.executives).toStrictEqual(executives);
    });

    test('set a company\'s price', () => {
        const price = {value: 1};
        store.dispatch(actions.updateCompanyPriceMetric(price));
        expect(store.getState().stocks.company.price).toStrictEqual(price);
    });

    test('set a company\'s valuation', () => {
        const valuation = {value: 1};
        store.dispatch(actions.updateCompanyValuationMetric(valuation));
        expect(store.getState().stocks.company.valuation).toStrictEqual(valuation);
    });

    test('set a company\'s growth', () => {
        const growth = {value: 1};
        store.dispatch(actions.updateCompanyGrowthMetric(growth));
        expect(store.getState().stocks.company.growth).toStrictEqual(growth);
    });

    test('set a company\'s margin', () => {
        const margin = {value: 1};
        store.dispatch(actions.updateCompanyMarginMetric(margin));
        expect(store.getState().stocks.company.margin).toStrictEqual(margin);
    });

    test('set a company\'s management', () => {
        const management = {value: 1};
        store.dispatch(actions.updateCompanyManagementMetric(management));
        expect(store.getState().stocks.company.management).toStrictEqual(management);
    });

    test('set a company\'s financial strength', () => {
        const financialStrength = {value: 1};
        store.dispatch(actions.updateCompanyFinancialStrengthMetric(financialStrength));
        expect(store.getState().stocks.company.financialStrength).toStrictEqual(financialStrength);
    });

    test('set a company\'s per share', () => {
        const perShare = {value: 1};
        store.dispatch(actions.updateCompanyPerShareMetric(perShare));
        expect(store.getState().stocks.company.perShare).toStrictEqual(perShare);
    });

    test('set a company\'s investors ownership', () => {
        const investors = [{value: 'Investor 1'}, {value: 'Investor 2'}];
        store.dispatch(actions.updateCompanyInvestorsOwnership(investors));
        expect(store.getState().stocks.company.investors).toStrictEqual(investors);
    });

    test('set a company\'s fund ownership', () => {
        const funds = [{value: 'Fund 1'}, {value: 'Fund 2'}];
        store.dispatch(actions.updateCompanyFundOwnership(funds));
        expect(store.getState().stocks.company.funds).toStrictEqual(funds);
    });
});

test('buy a stock', () => {
    const balanceBefore = store.getState().balance;
    store.dispatch(actions.buy());
    expect(store.getState().balance).toBe(balanceBefore - (store.getState().stocks.chart.stock?.current! * store.getState().buyQty));

    const latestOrder = store.getState().reportData.orderHistory.rows[store.getState().reportData.orderHistory.rows.length - 1];
    expect(latestOrder.cells[0].content).toBeTruthy();
    expect(latestOrder.cells[1].content).toBe(store.getState().stocks.chart.stock?.name);
    expect(latestOrder.cells[2].content).toBe((store.getState().stocks.chart.stock?.current! * store.getState().buyQty).toString());
    expect(latestOrder.cells[3].content).toBe(store.getState().buyQty.toString());
    expect(latestOrder.cells[4].content).toBe('BUY');

    const latestAcitvity = store.getState().reportData.activities.items[store.getState().reportData.activities.items.length - 1];
    expect(latestAcitvity.main).toBe(actions.activityLabels.buy(store.getState().buyQty, 
        store.getState().stocks.chart.stock!.name.toUpperCase(), 
        store.getState().stocks.chart.stock!.current));
    expect(latestAcitvity.data).toBe('trade');
    expect(latestAcitvity.graphic).toBe('fas fa-dollar-sign buy');
});

test('try buying a stock with no stock slected', () => {
    const balanceBefore = store.getState().balance;
    store.getState().stocks.chart.stock = null;
    store.dispatch(actions.buy());
    expect(store.getState().balance).toBe(balanceBefore);
    store.getState().stocks.chart.stock = new Stock(0, 'ABC', 0, 0, 0, 0, 0, 0);
});

test('try buying a stock with the buy quantity set to 0', () => {
    const balanceBefore = store.getState().balance;
    store.dispatch(actions.setBuyQty(0));
    store.dispatch(actions.buy());
    expect(store.getState().balance).toBe(balanceBefore);
    store.dispatch(actions.setBuyQty(1));
});

test('sell a stock', () => {
    const balanceBefore = store.getState().balance;
    store.dispatch(actions.sell());
    expect(store.getState().balance).toBe(balanceBefore + (store.getState().stocks.chart.stock?.current! * store.getState().buyQty));
    const latestRow = store.getState().reportData.orderHistory.rows[store.getState().reportData.orderHistory.rows.length - 1];
    expect(latestRow.cells[0].content).toBeTruthy();
    expect(latestRow.cells[1].content).toBe(store.getState().stocks.chart.stock?.name);
    expect(latestRow.cells[2].content).toBe((store.getState().stocks.chart.stock?.current! * store.getState().sellQty).toString());
    expect(latestRow.cells[3].content).toBe(store.getState().buyQty.toString());
    expect(latestRow.cells[4].content).toBe('SELL');

    const latestAcitvity = store.getState().reportData.activities.items[store.getState().reportData.activities.items.length - 1];
    expect(latestAcitvity.main).toBe(actions.activityLabels.sell(store.getState().sellQty, 
        store.getState().stocks.chart.stock!.name.toUpperCase(), 
        store.getState().stocks.chart.stock!.current));
    expect(latestAcitvity.data).toBe('trade');
    expect(latestAcitvity.graphic).toBe('fas fa-dollar-sign sell');
});

test('try selling a stock with the sell quantity set to 0', () => {
    const balanceBefore = store.getState().balance;
    store.dispatch(actions.setSellQty(0));
    store.dispatch(actions.sell());
    expect(store.getState().balance).toBe(balanceBefore);
    store.dispatch(actions.setSellQty(1));
});

test('try selling a stock with no stock slected', () => {
    const balanceBefore = store.getState().balance;
    store.getState().stocks.chart.stock = null;
    store.dispatch(actions.sell());
    expect(store.getState().balance).toBe(balanceBefore);
    store.getState().stocks.chart.stock = new Stock(0, 'ABC', 0, 0, 0, 0, 0, 0);
});

test('set the buy quantity', () => {
    const quantity = 2;
    store.dispatch(actions.setBuyQty(quantity));
    expect(store.getState().buyQty).toStrictEqual(quantity);
});

test('set the sell quantity', () => {
    const quantity = 2;
    store.dispatch(actions.setSellQty(quantity));
    expect(store.getState().sellQty).toStrictEqual(quantity);
});

test('update the balance', () => {
    const balance = 1;
    const balanceBefore = store.getState().balance;
    store.dispatch(actions.updateBalance(balance));
    expect(store.getState().balance).toBe(balance);
});

describe('Reports', () => {
    test('add a box', () => {
        expect(store.getState().boxes).toHaveLength(0);
        store.dispatch(actions.addBox(BoxType.ALERTS));
        expect(store.getState().boxes).toHaveLength(1);
        expect(store.getState().boxes[0].type).toBe(BoxType.ALERTS);
    });

    test('remove a box', () => {
        expect(store.getState().boxes).toHaveLength(1);
        store.dispatch(actions.removeBox(1));
        expect(store.getState().boxes).toHaveLength(0);
    });

    test('set the list of box', () => {
        const boxes = [new Box(1, '', BoxType.HEADLINES), new Box(2, '', BoxType.ALERTS)];
        store.dispatch(actions.setBoxes(boxes));
        expect(store.getState().boxes).toStrictEqual(boxes);
    });

    test('select an unselected box', () => {
        const id = 1;
        store.dispatch(actions.selectBox(id));
        expect(store.getState().selectedBox).toBe(id);
    });

    test('select a selected box', () => {
        const id = 1;
        store.dispatch(actions.selectBox(id));
        expect(store.getState().selectedBox).toBe(null);
    });

    test('move a box back', () => {
        const id = 2;
        store.dispatch(actions.moveBoxBack(id));
        expect(store.getState().boxes[0].id).toBe(2);
        store.dispatch(actions.moveBoxBack(id));
        expect(store.getState().boxes[0].id).toBe(2);
    });

    test('move a box forward', () => {
        const id = 2;
        store.dispatch(actions.moveBoxForward(id));
        expect(store.getState().boxes[0].id).toBe(1);
        store.dispatch(actions.moveBoxForward(id));
        expect(store.getState().boxes[0].id).toBe(1);
    });

    test('dismiss an alert', () => {
        const id = 1;
        store.dispatch(actions.addAlert('info', ''));
        store.dispatch(actions.dismissAlert(id));
        expect(store.getState().reportData.alerts).toHaveLength(0);
    });

    test('dismiss an alert with an id of -1', () => {
        const alertsBefore = store.getState().reportData.alerts;
        const id = -1;
        store.dispatch(actions.dismissAlert(id));
        expect(store.getState().reportData.alerts).toHaveLength(alertsBefore.length);
    });

    test('set displayed orders level', () => {
        const level = 'sell';
        store.dispatch(actions.setOrdersDisplayLevel(level));
        expect(store.getState().reportData.displayedOrdersLevel).toBe(level);
    });

    test('set displayed activities level', () => {
        const level = 'trade';
        store.dispatch(actions.setDisplayedActivitiesLevel(level));
        expect(store.getState().reportData.displayedActivitiesLevel).toBe(level);
    });

    test('set displayed alerts', () => {
        const level = 'info';
        store.dispatch(actions.setDisplayedAlertsLevel(level));
        expect(store.getState().reportData.displayedAlertsLevel).toBe(level);
    });
});

test('toggle a boex\'s menu', () => {
    const boxId = 1;
    expect(store.getState().boxes[0].id).toBe(boxId);
    expect(store.getState().boxes[0].menuVisible).toBe(false);
    store.dispatch(actions.toggleMenu(boxId));
    expect(store.getState().boxes[0].menuVisible).toBe(true);
    store.dispatch(actions.toggleMenu(boxId));
    expect(store.getState().boxes[0].menuVisible).toBe(false);
});

test('add an alert', () => {
    expect(store.getState().reportData.alerts).toHaveLength(0);
    store.dispatch(actions.addAlert('info', ''));
    expect(store.getState().reportData.alerts).toHaveLength(1);
});

test('set the order history', () => {
    const history = new Table(ORDER_HEADERS, [new TableRow([new TableCell(''),
                                                            new TableCell(''),
                                                            new TableCell(''),
                                                            new TableCell(''),
                                                            new TableCell('')], 
                                                            'sell')]);
    store.dispatch(actions.setOrderHistory(history));
    expect(store.getState().reportData.orderHistory).toStrictEqual(history);
});

test('set the list of activities', () => {
    const activities = new List([new ListRow('')]);
    store.dispatch(actions.updateActivities(activities));
    expect(store.getState().reportData.activities).toStrictEqual(activities);
});

test('set the list of headlines', () => {
    const headlines = new List([new ListRow('')]),
    title = 'Business';
    store.dispatch(actions.updateHeadlines(headlines, title));
    expect(store.getState().reportData.headlines).toStrictEqual(headlines);
    expect(store.getState().reportData.headlinesTitle).toBe(title);
});

test('set the list of alerts', () => {
    const alerts = [new Alert(1, '')];
    store.dispatch(actions.updateAlerts(alerts));
    expect(store.getState().reportData.alerts).toStrictEqual(alerts);
});

describe('Help', () => {
    test('toggle help', () => {
        expect(store.getState().help.visible).toBe(false);
        store.dispatch(actions.toggleHelp('open'));
        expect(store.getState().help.visible).toBe(true);
        store.dispatch(actions.toggleHelp('close'));
        expect(store.getState().help.visible).toBe(false);
    });

    test('set active help section', () => {
        const section = 'profile';
        store.dispatch(actions.setActiveHelpSection(section));
        for (const section of store.getState().help.sections) {
            if (section.selected) {
                expect(section.name).toBe(section);
            }
        }
    });
});