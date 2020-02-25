import Box from "../../models/Box";
import Alert from "../../models/Alert";
import Stock from "../../models/Stock";
import { ChartOptions, Option, Chart, State, CompanyInfoType } from "./types";
import { time, date } from "../../utility";
import { number } from "../../randomizer";
import { trackers } from "./data";
import { store } from "./store";
import * as actions from "../actions";
import FinnHub, { CompanyGeneralInfoSections, CompanyMetricSections } from "../../services/FinnHub";
import News, { Category } from "../../services/News";
import List, { ListRow } from "../../models/List";
import DB, { Key } from "../../services/DB";
import Table from "../../models/Table";

export const getLatestBoxId = (boxList: Box[]) => {
    return boxList.length !== 0 ? boxList[boxList.length - 1].id : 0;
}

export const getLatestAlertId = (alertList: Alert[]) => {
    return alertList.length !== 0 ? alertList[0].id : 0;
}

export const getBoxType = (boxes: Box[], id: number) => {
    for (const box of boxes) {
        if (box.id === id) {
            return box.type;
        }
    }
}

export const startSimulatedTracker = (stock: Stock, options: ChartOptions) => {
    return setInterval(() => {
        options.series[0].name = stock.name;
        options.series[0].data.push({x: time(new Date()), 
                                     y: number(trackers.simulated.priceMin, 
                                               trackers.simulated.priceMax)});
        store.dispatch(actions.updateChart(options));
        store.dispatch(actions.setStockDetails(new Stock(stock.id, stock.name, 
                                                     stock.open, stock.close, 
                                                     stock.high, stock.low, 
                                                     number(trackers.simulated.priceMin, 
                                                            trackers.simulated.priceMax), 
                                                     number(trackers.simulated.trendMin, 
                                                            trackers.simulated.trendMax), 
                                                            stock.companyName)));
    }, trackers.simulated.tickInterval);
}

export const stopSimulatedTracker = (tracker: number, onStop: () => void) => {
    clearInterval(tracker);
    onStop();
}

export const startLiveTracker = (stock: Stock, options: ChartOptions, onStart: () => void) => {
    return FinnHub.startTrack(stock.name, data => {
        if (data.t > trackers.live.timestamp + trackers.live.governor) {
            options.series[0].name = stock.name;
            options.series[0].data.push({x: time(new Date(data.t)), 
                                         y: data.p});
            store.dispatch(actions.updateChart(options));
            store.dispatch(actions.setStockDetails(new Stock(stock.id, stock.name, 
                                                         stock.open, stock.close, 
                                                         stock.high > data.p ? stock.high : data.p, 
                                                         stock.low < data.p ? stock.low : data.p, 
                                                         data.p, data.p - stock.close, 
                                                         stock.companyName)));
            trackers.live.timestamp = data.t;
        }
    }, onStart);
}

export const stopLiveTracker = (tracker: WebSocket, 
                         stock: Stock,
                         callback: () => void) => {
        FinnHub.stopTrack(tracker, stock.name, callback);
}

export const filterStocksByIndex = (list: Stock[], index: string) => {
    return list.filter(stock => 
                stock.name.toLowerCase()
                .startsWith(index.toLowerCase()));
}

export const filterStocksByName = (list: Stock[], name: string) => {
    return list.filter(stock => 
                stock.name.toLowerCase()
                .includes(name.toLowerCase()));
}

export const stockIsListed = (stock: Stock, list: Stock[]) => {
    return list.find(stock_ => stock_.name === stock.name);
}

export const findExchange = (list: Option[], name: string) => {
    for (const exch of list) {
        if (exch.name === name) {
            return {code: exch.data!.toString(), 
                    exchange: {name: exch.name, 
                               code: exch.data!}};
        }
    }
}

export const clearChart = (chart: Chart) => {
    let cleared = Object.assign({}, chart.options);
    cleared.series[0].data = [];
    return cleared;
}

export const toggleTracker = (state: State) => {
    let tracker = null;
    if (state.tracker.mode === 'simulated') {
        if (state.tracker.object) {
            stopSimulatedTracker(state.tracker.object as number, () => {});
        } else {
            let options = Object.assign({}, state.chart.options);
            tracker = startSimulatedTracker(state.chart.stock!, options);
        }
    } else {
        if (state.tracker.object) {
            stopLiveTracker(state.tracker.object as WebSocket, state.chart.stock!, () => {});
        } else {
            let options = Object.assign({}, state.chart.options);
            tracker = startLiveTracker(state.chart.stock!, options, () => {});
        }
    }
    return tracker;
}

export const toggleTrackerMode = (state: State) => {
    let tracker = null, mode = '';
    if (state.tracker.mode === 'simulated') {
        if (state.tracker.object) {
            stopSimulatedTracker(state.tracker.object as number, () => {});
            let options = clearChart(state.chart);
            tracker = startLiveTracker(state.chart.stock!, options, () => {});
            mode = 'live';
        }
    } else {
        if (state.tracker.object) {
            let options = clearChart(state.chart);
            FinnHub.stopTrack(state.tracker.object as WebSocket, 
                state.chart.stock!.name, () => {
                    store.dispatch(actions.setTracker(
                        startSimulatedTracker(state.chart.stock!, 
                        options)));
                    });
                mode = 'simulated';
        }
    }
    return {tracker, mode};
}

export const selectHelpSection = (sections: Option[], sectionName: string) => {
    const sections_ = sections.slice();
    sections_.forEach(section => {
        if (section.name === sectionName) {
            section.selected = true;
        } else {
            delete section.selected;
        }});
    return sections_;
}

export const selectCompanySection = (sections: Option[], sectionName: string) => {
    const sections_ = sections.slice();
    sections_.forEach(section => {
        if (section.name === sectionName) {
            section.selected = true;
        } else {
            delete section.selected;
        }});
    return sections_;
}

export const determineCompanyInfoType = (section: string): CompanyInfoType | undefined => {
    const section_ = section.toLowerCase();
    if (Object.keys(CompanyGeneralInfoSections).includes(section_)) {
        return 'general';
    } else if (Object.keys(CompanyMetricSections).includes(section_)) {
        return 'metric';
    }
    return;
}

export const findCompanySectionByName = (sections: Option[], name: string) => {
    for (const section of sections) {
        if (section.name === name) {
            return section;
        }
    }
}

export const fetchHeadlines = (category: Category) =>
    News.headlines(category, articles => {
        const headlines: ListRow[] = [];
        articles.forEach(article => headlines.push(new ListRow(article.title, 'other', undefined, `${article.author} @ ${date(new Date(article.publishedAt))}`, article.url)));
        store.dispatch(actions.updateHeadlines(new List(headlines), category));
    }, () => store.dispatch(actions.updateHeadlines(new List([new ListRow('An error occurred while trying get the latest headlines.')]), category)));

const fetchExchanges = () => {
    FinnHub.listExchanges(list => store.dispatch(actions.setExchanges(list)), 
        error => {
            if (error) {
                store.dispatch(actions.addAlert('error', error.message))
            }
    });
}

const fetchSelectedExchange = () => {
    DB.fetch(Key.EXCHANGE).then(exchange => {
        if (exchange) {
            const exchange_ = exchange as {name: string, code: string};
            fetchStocks(exchange_.code);
            store.dispatch(actions.setSelectedExchange(exchange_.name));
        } else {
            store.dispatch(actions.setSelectedExchange('US Exchanges'))
            fetchStocks('US');
        }
    });
}

export const fetchStocks = (exchange: string) => {
    FinnHub.listStocks(exchange, list => {store.dispatch(actions.setStocksList(list))},
        error => {
            if (error) {
                store.dispatch(actions.addAlert('error', error.message))
            }
    });
}

export const initializeData = () => {
    DB.fetch(Key.ORDERS).then(orders => { 
        if (orders) {
            store.dispatch(actions.setOrderHistory(orders as Table));
        }
    });
    
    DB.fetch(Key.ACTIVITIES).then(activity => { 
        if (activity) {
            store.dispatch(actions.updateActivities(activity as List));
        }
    });
    
    DB.fetch(Key.BALANCE).then(balance => { 
        if (balance) {
            store.dispatch(actions.updateBalance(balance as number));
        }
    });
    
    DB.fetch(Key.ALERTS).then(alerts => {
        if (alerts) {
            store.dispatch(actions.updateAlerts(alerts as Alert[]));
        }
    });
    
    DB.fetch(Key.BOXES).then(boxes => {
        if (boxes) {
            store.dispatch(actions.setBoxes(boxes as Array<Box>));
        }
    });
    
    DB.fetch(Key.WATCHLIST).then(watchlist => {
        if (watchlist) {
            store.dispatch(actions.setWatchList(watchlist as Array<Stock>));
        }
    });
    
    DB.fetch(Key.STOCK_INDEX).then(index => {
        if (index) {
            store.dispatch(actions.setStockIndex(index as string));
        }
    });
    
    DB.fetch(Key.STOCK).then(stock => {
        store.dispatch(actions.startStockTrack(stock as Stock));
    });

    fetchHeadlines('business');
    fetchExchanges();
    fetchSelectedExchange();
}
initializeData();