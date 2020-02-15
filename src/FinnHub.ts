import { Option } from './redux/store';
import * as config from './config';
import StockData from './StockData';
import CompanyProfile from './CompanyProfile';

export type CompanyInfo = {
    address: string,
    city: string,
    country: string,
    currency: string,
    cusip: string,
    description: string,
    exchange: string,
    ggroup: string,
    gind: string,
    gsector: string,
    gsubind: string,
    ipo: string,
    isin: string,
    naics: string,
    name: string,
    phone: string,
    state: string,
    ticker: string,
    weburl: string
}

export default class FinnHub {
    static listExchanges(callback?: (list: Option[]) => void) {
        fetch(`https://finnhub.io/api/v1/stock/exchange?token=${config.config.finnHubAPIKey}`)
        .then(list => {
            if (callback) {
                list.json().then(list => {
                    let list_: Option[] = [];
                    for (const exchange of list) {
                        list_.push({name: exchange.name, data: exchange.code});
                    }
                    callback(list_);
                });
            }
        });
    }

    static listStocks(exchange: string, callback?: (stocks: StockData[]) => void) {
        fetch(`https://finnhub.io/api/v1//stock/symbol?exchange=${exchange}&token=${config.config.finnHubAPIKey}`)
        .then(stocks => {
            if (callback) {
                stocks.json().then(stocks => {
                    let list: StockData[] = [];
                    for (let index = 0; index < stocks.length; index++) {
                        list.push(new StockData(index, stocks[index].displaySymbol, 0, 0, 0, 0, 0, 0, stocks[index].description));
                    }
                    callback(list);
                });
            }
        });
    }

    static quote(symbol: string, callback: (quote: {o:number , 
        c: number, pc: number, h: number, l:number}) => void) {
        fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${config.config.finnHubAPIKey}`)
        .then(data => {
            data.json().then(quote => {
                callback(quote);
            });
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
    
    static companyProfile(symbol: string, callback: (info: CompanyProfile) => void) {
        fetch(`https://finnhub.io/api/v1/stock/profile?symbol=${symbol}&token=${config.config.finnHubAPIKey}`)
        .then(data => {
            data.json().then(info => {
                callback(new CompanyProfile(info.address, info.city, info.country, info.currency, info.cusip, info.description, info.exchange, info.ggroup, info.gind, info.gsector, info.gsubind, info.ipo, info.isin, info.naics, info.name, info.phone, info.state, info.ticker, info.weburl));
            });
        });
    }
}