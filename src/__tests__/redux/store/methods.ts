import { store } from '../../../redux/store/store';
import * as methods from '../../../redux/store/methods';
import * as actions from '../../../redux/actions';
import Box, { BoxType } from '../../../models/Box';
import Alert from '../../../models/Alert';
import Stock from '../../../models/Stock';
import DB, { Key } from '../../../services/DB';

test('get the latest box\'s id', () => {
    expect(methods.getLatestBoxId(store.getState().boxes)).toBe(0);
    const boxes = [new Box(1, '', BoxType.ALERTS)];
    store.dispatch(actions.setBoxes(boxes));
    expect(methods.getLatestBoxId(store.getState().boxes)).toBe(1);
});

test('get a box\'s type', () => {
    expect(methods.getBoxType(store.getState().boxes, 1)).toBe(BoxType.ALERTS);
    expect(methods.getBoxType(store.getState().boxes, 2)).toBe(undefined);
});

test('get the latest alert\'s id', () => {
    expect(methods.getLatestAlertId(store.getState().reportData.alerts)).toBe(0);
    const alerts = [new Alert(1, '')];
    store.dispatch(actions.updateAlerts(alerts));
    expect(methods.getLatestAlertId(store.getState().reportData.alerts)).toBe(1);
});

test('start a simulated tracker', () => {
    const stock = new Stock(1, 'ABC', 0, 0, 0, 0, 0, 0);
    expect(methods.startSimulatedTracker(stock, Object.assign({}, 
        store.getState().stocks.chart.options))).toBeTruthy();
});

test('stop a simulated tracker', done => {
    const onStop = () => {
        done();
    }
    methods.stopSimulatedTracker(1, onStop);
});

test('filter a stocks list by index', () => {
    const stocks = [new Stock(1, 'ABC', 0, 0, 0, 0, 0, 0),
                    new Stock(2, 'DEF', 0, 0, 0, 0, 0, 0)];
    const index = 'a';
    expect(methods.filterStocksByIndex(stocks, index)[0].name).toBe(stocks[0].name)
});

test('filter a stocks list by name', () => {
    const stocks = [new Stock(1, 'ABC', 0, 0, 0, 0, 0, 0),
                    new Stock(2, 'DEF', 0, 0, 0, 0, 0, 0)];
    const index = 'ab';
    expect(methods.filterStocksByName(stocks, index)[0].name).toBe(stocks[0].name)
});

test('find out if a stock is listed', () => {
    const stocks = [new Stock(1, 'ABC', 0, 0, 0, 0, 0, 0),
                    new Stock(2, 'DEF', 0, 0, 0, 0, 0, 0)];
    const stock1 = new Stock(1, 'ABC', 0, 0, 0, 0, 0, 0);
    const stock2 = new Stock(1, 'BCD', 0, 0, 0, 0, 0, 0);
    expect(methods.stockIsListed(stock1, stocks)).toBeTruthy();
    expect(methods.stockIsListed(stock2, stocks)).toBeFalsy();
});

test('find an exchange from a list', () => {
    const exchanges = [{name: 'Exchange 1', data: 'Code 1'}, 
                       {name: 'Exchange 2', data: 'Code 2'}];
    let exchange = methods.findExchange(exchanges, 'Exchange 1');
    expect(exchange).toStrictEqual({code: exchanges[0].data, exchange: 
        {name: exchanges[0].name, code: exchanges[0].data}});
    exchange = methods.findExchange(exchanges, '');
    expect(exchange).toBe(undefined);
});

test('clear a chart\'s series data', () => {
    const chart = store.getState().stocks.chart;
    chart.options.series[0].data = [{x: '1', y: 2}];
    expect(chart.options.series[0].data).toHaveLength(1);
    methods.clearChart(chart);
    expect(chart.options.series[0].data).toHaveLength(0);
});

test('select a section', () => {
    const sections = [{name: 'Section 1', selected: true}, {name: 'Section 2'}];
    const sections_ = methods.selectSection(sections, 'Section 2');
    expect(Object.keys(sections_[0]).includes('selected')).toBe(false);
    expect(Object.keys(sections_[1]).includes('selected')).toBe(true);
});

test('determine a company info type', () => {
    let section = 'ceo (us companies only)';
    expect(methods.determineCompanyInfoType(section)).toBe('general');
    section = 'price';
    expect(methods.determineCompanyInfoType(section)).toBe('metric');
    section = '';
    expect(methods.determineCompanyInfoType(section)).toBe(undefined);
});

test('find a company section by name', () => {
    const sections = [{name: 'Section 1'}],
    name = 'Section 1';
    expect(methods.findCompanySectionByName(sections, name)!.name).toBe(sections[0].name);
    expect(methods.findCompanySectionByName(sections, '')).toBe(undefined);
});