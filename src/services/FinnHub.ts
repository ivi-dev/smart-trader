import { Option } from '../redux/store';
import * as config from '../config';
import Stock from '../models/Stock';

class FinnHubAPILimitError extends Error {
    constructor() {
        super('FinnHub\'s call Limit reached. Wait a bit and try again.');
    }
}

export default class FinnHub {
    static listExchanges(callback: (list: Option[]) => void, 
        onError: (error: FinnHubAPILimitError) => void) {
        fetch(`https://finnhub.io/api/v1/stock/exchange?token=${config.config.finnHubAPIKey}`)
        .then(data => {
            if (data.status !== 200) {
                onError(new FinnHubAPILimitError());
            } else {
                if (callback) {
                    data.json().then(list => {
                        let list_: Option[] = [];
                        for (const exchange of list) {
                            list_.push({name: exchange.name, data: exchange.code});
                        }
                        callback(list_);
                    });
                }
            }
        });
    }

    static listStocks(exchange: string, callback: (stocks: Stock[]) => void, 
        onError: (error: FinnHubAPILimitError) => void) {
        fetch(`https://finnhub.io/api/v1//stock/symbol?exchange=${exchange}&token=${config.config.finnHubAPIKey}`)
        .then(data => {
            if (data.status !== 200) {
                onError(new FinnHubAPILimitError());
            } else {
                if (callback) {
                    data.json().then(stocks => {
                        let list: Stock[] = [];
                        for (let index = 0; index < stocks.length; index++) {
                            list.push(new Stock(index, stocks[index].displaySymbol, 0, 0, 0, 0, 0, 0, stocks[index].description));
                        }
                        callback(list);
                    });
                }
            }
        });
    }

    static quote(symbol: string, callback: (quote: {o:number , 
        c: number, pc: number, h: number, l:number}) => void, 
        onError: (error: FinnHubAPILimitError) => void) {
        fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${config.config.finnHubAPIKey}`)
        .then(data => {
            if (data.status !== 200) {
                onError(new FinnHubAPILimitError());
            } else {
                data.json().then(quote => {
                    callback(quote);
                });
            }
        });
    }

    static startTrack(symbol: string, onData: (data: {p: number, t: number}) => void) {
        const socket = new WebSocket(`wss://ws.finnhub.io?token=${config.config.finnHubAPIKey}`);
        socket.addEventListener('open', () => {
            socket.send(JSON.stringify({'type':'subscribe', 'symbol': symbol}));
        });
        socket.addEventListener('message', event => {
            try {
                onData(JSON.parse(event.data).data[0]);
            } catch (e) {}
        });
        return socket;
    }

    static stopTrack(socket: WebSocket, symbol: string, onClose?: () => void) {
        socket.send(JSON.stringify({'type':'unsubscribe','symbol': symbol}));
        socket.close();
        socket.addEventListener('close', () => {
            if (onClose) {
                onClose();
            }
        });
    }
    
    static companyProfile(symbol: string, callback: (info: {}) => void, 
        onError: (error: FinnHubAPILimitError) => void) {
        fetch(`https://finnhub.io/api/v1/stock/profile?symbol=${symbol}&token=${config.config.finnHubAPIKey}`)
        .then(data => {
            if (data.status !== 200) {
                onError(new FinnHubAPILimitError());
            } else {
                data.json().then(profile => callback(profile));
            }
        });
    }

    static ceo(symbol: string, callback: (info: {}) => void, 
        onError: (error: FinnHubAPILimitError) => void) {
        fetch(`https://finnhub.io/api/v1/stock/ceo-compensation?symbol=${symbol}&token=${config.config.finnHubAPIKey}`)
        .then(data => {
            if (data.status !== 200) {
                onError(new FinnHubAPILimitError());
            } else {
                data.json().then(ceo => callback(ceo));
            }
        });
    }

    static executives(symbol: string, callback: (info: {}[]) => void, 
        onError: (error: FinnHubAPILimitError) => void) {
        fetch(`https://finnhub.io/api/v1/stock/executive?symbol=${symbol}&token=${config.config.finnHubAPIKey}`)
        .then(data => {
            if (data.status !== 200) {
                onError(new FinnHubAPILimitError());
            } else {
                data.json().then(list => callback(list.executive));
            }
        });
    }

    static metrics(symbol: string, metric: 'price' | 'valuation' | 'growth' | 'margin' | 'management' | 'financialStrength' | 'perShare', 
            callback: (info: {}) => void, 
                onError: (error: FinnHubAPILimitError) => void) {
        fetch(`https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=${metric}&token=${config.config.finnHubAPIKey}`)
        .then(data => {
            if (data.status !== 200) {
                onError(new FinnHubAPILimitError());
            } else {
                data.json().then(info => callback(info.metric));
            }
        });
    }

    static investors(symbol: string, callback: (info: {}[]) => void, 
        onError: (error: FinnHubAPILimitError) => void) {
        fetch(`https://finnhub.io/api/v1/stock/investor-ownership?symbol=${symbol}&token=${config.config.finnHubAPIKey}`)
        .then(data => {
            if (data.status !== 200) {
                onError(new FinnHubAPILimitError());
            } else {
                data.json().then(info => callback(info.ownership));
            }
        });
    }

    static funds(symbol: string, callback: (info: {}[]) => void, 
        onError: (error: FinnHubAPILimitError) => void) {
        fetch(`https://finnhub.io/api/v1/stock/fund-ownership?symbol=${symbol}&token=${config.config.finnHubAPIKey}`)
        .then(data => {
            if (data.status !== 200) {
                onError(new FinnHubAPILimitError());
            } else {
                data.json().then(info => callback(info.ownership));
            }
        });
    }
}