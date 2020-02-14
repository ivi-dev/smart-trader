import { Option } from './redux/store';
import * as config from './config';
import StockData from './StockData';

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
}