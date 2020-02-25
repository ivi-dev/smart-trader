import { Option } from '../redux/store/types';
import * as config from '../config';
import Stock from '../models/Stock';

export type Quote = {o:number, 
              c: number, 
              pc: number, 
              h: number, 
              l:number};

export const CompanyGeneralInfoSections: {[index: string]: string} = {
        'ceo (us companies only)': 'ceo-compensation',
        'executives': 'executive',
        'investors ownership': 'investor-ownership',
        'fund ownership': 'fund-ownership'
}

export const CompanyMetricSections: {[index: string]: string} = {
    'price': 'price',
    'valuation': 'valuation',
    'margin': 'margin',
    'management': 'management',
    'financial strength': 'financialStrength',
    'per share': 'perShare',
}

class FinnHubAPILimitError extends Error {
    constructor() {
        super('FinnHub\'s call Limit reached. Wait a bit and try again.');
    }
}

export default class FinnHub {
    static listExchanges(onSuccess: (list: Option[]) => void, 
                         onError: (error: FinnHubAPILimitError) => void) {
        fetch(`https://finnhub.io/api/v1/stock/exchange?token=${config.config.finnHubAPIKey}`)
        .then(data => {
            if (data.status !== 200) {
                onError(new FinnHubAPILimitError());
            } else {
                if (onSuccess) {
                    data.json().then(list => {
                        let list_: Option[] = [];
                        for (const exchange of list) {
                            list_.push({name: exchange.name, data: exchange.code});
                        }
                        onSuccess(list_);
                    });
                }
            }
        });
    }

    static listStocks(exchange: string, 
                      onSuccess: (stocks: Stock[]) => void, 
                      onError: (error: FinnHubAPILimitError) => void) {
        fetch(`https://finnhub.io/api/v1//stock/symbol?exchange=${exchange}&token=${config.config.finnHubAPIKey}`)
        .then(data => {
            if (data.status !== 200) {
                onError(new FinnHubAPILimitError());
            } else {
                if (onSuccess) {
                    data.json().then(stocks => {
                        let list: Stock[] = [];
                        for (let index = 0; index < stocks.length; index++) {
                            list.push(new Stock(index, stocks[index].displaySymbol, 0, 0, 0, 0, 0, 0, stocks[index].description));
                        }
                        onSuccess(list);
                    });
                }
            }
        });
    }

    static quote(symbol: string, 
                 onSuccess: (quote: Quote) => void, 
                 onError: (error: FinnHubAPILimitError) => void) {
        fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${config.config.finnHubAPIKey}`)
        .then(data => {
            if (data.status !== 200) {
                onError(new FinnHubAPILimitError());
            } else {
                data.json().then(quote => {
                    onSuccess(quote);
                });
            }
        });
    }

    static startTrack(symbol: string, 
                      onData: (data: {p: number, t: number}) => void,
                      onStart: () => void) {
        const socket = new WebSocket(`wss://ws.finnhub.io?token=${config.config.finnHubAPIKey}`);
        socket.addEventListener('open', () => {
            socket.send(JSON.stringify({'type':'subscribe', 'symbol': symbol}));
            onStart();
        });
        socket.addEventListener('message', event => {
            try {
                onData(JSON.parse(event.data).data[0]);
            } catch (e) {}
        });
        return socket;
    }

    static stopTrack(socket: WebSocket, symbol: string, onStop: () => void) {
        socket.send(JSON.stringify({'type':'unsubscribe','symbol': symbol}));
        socket.close();
        socket.addEventListener('close', onStop);
    }
    
    static companyProfile(symbol: string, 
                          onSuccess: (info: {}) => void, 
                          onError: (error: FinnHubAPILimitError) => void) {
        fetch(`https://finnhub.io/api/v1/stock/profile?symbol=${symbol}&token=${config.config.finnHubAPIKey}`)
        .then(data => {
            if (data.status !== 200) {
                onError(new FinnHubAPILimitError());
            } else {
                data.json().then(profile => onSuccess(profile));
            }
        });
    }

    static companyGeneralInfo = (symbol: string, 
                                 section: string,
                                 onSuccess: (info: {}) => void, 
                                 onError: (error: FinnHubAPILimitError) => void) => {
        fetch(`https://finnhub.io/api/v1/stock/${section}?symbol=${symbol}&token=${config.config.finnHubAPIKey}`)
        .then(data => {
            if (data.status !== 200) {
                onError(new FinnHubAPILimitError());
            } else {
                data.json().then(data => onSuccess(data));
            }
        });
    }

    static companyMetrics = (symbol: string, 
                             metric: string,
                             onSuccess: (info: {}) => void, 
                             onError: (error: FinnHubAPILimitError) => void) => {
        fetch(`https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=${metric}&token=${config.config.finnHubAPIKey}`)
        .then(data => {
            if (data.status !== 200) {
                onError(new FinnHubAPILimitError());
            } else {
                data.json().then(data => onSuccess(data.metric));
            }
        });
    }
}