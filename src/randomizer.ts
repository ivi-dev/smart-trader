import IndexData from './IndexData';
import ChartData, { ChartDataEntry } from './ChartData';
import TableData, { TableRow, TableCell } from './TableData';
import ListData, { ListDataRow } from './ListData';
import { formatDate } from './utility';
import Alert from './Alert';
import { ORDER_HEADERS } from './redux/store';

export const number = (min: number, max: number) => {
    return Math.floor(Math.random() * ((max - min) + min + 1));
}

export const indexName = (numLetters = 3) => {
    const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 
        'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 
        'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    let indexName = '';
    for(let i = 0; i < numLetters; i++) {
        indexName += alphabet[number(0, alphabet.length - 1)];
    }
    return indexName;
}

export const sign = () => {
    const signs = ['+', '-'];
    return signs[number(0, signs.length - 1)];
}

export const indices = (num: number, list?: IndexData[] | undefined) => {
    let indices: IndexData[] = [];
    if(!list) {
        for (let index = 0; index < num; index++) {
            const name = indexName();
            const open = number(25, 1000);
            const variation = sign();
            const close = variation === '+' ? open + open * 0.1 : open - open * 0.1;
            const high = Math.round(open + open * 0.3), low = Math.round(open - open * 0.3);
            const current = number(0, (high - low)) + low;
            let trend = open - current;
            indices.push(new IndexData(index, name, Number(`${open}.${number(10, 99)}`), Number(`${close.toFixed(0)}.${number(10, 99)}`), Number(`${high}.${number(10, 99)}`), Number(`${low}.${number(10, 99)}`), Number(`${current}.${number(10, 99)}`), Number(`${trend}.${number(10, 99)}`)));
        }
        return indices;
    } else {
        if(num >= list.length) {
            throw new Error('The number of requested indices should be less than the length of the provided IndexData list');
        }
        let indices: IndexData[] = [];
        let list_ = list.slice();
        for (let index = 0; index < num; index++) {
            indices.push(list_.splice(number(0, list_.length - 1), 1)[0]);
        }
        return indices;
    }
}

export const indexHistory = (year: number | string = (new Date().getFullYear() - 1)) => {
    let history: ChartData = new ChartData([]);
    const months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    for (let index = 1; index < months.length + 1; index++) {
        for (let index2 = 1; index2 < months[index - 1] + 1; index2++) {
            const open = number(10, 149), 
            highest = number(10, 150), lowest = Math.round(highest - highest * 0.2), 
            close = number(0, (highest - lowest)) + lowest;
            const month = index < 10 ? `0${index}` : index, date = index2 < 10 ? `0${index2}` : index2;
            history.entries.push(new ChartDataEntry(`${year}-${month}-${date}`, Number(`${open}.${number(0, 99)}`), Number(`${close}.${number(0, 99)}`), Number(`${highest}.${number(0, 99)}`), Number(`${lowest}.${number(0, 99)}`)));
        }
    }
    return history;
}

export const indexHistories = (upTo: number = 2000) => {
    let histories: {source: number | string, data: ChartData}[] = [{source: 'Intraday', data: indexHistory('Intraday')}],
    years: {name: number | string, selected?: boolean}[] = [];
    for (let index = (new Date()).getFullYear() - 1; index > upTo; index--) {
        histories.push({source: index, data: indexHistory(index)});
    }
    for (let index = 0; index < histories.length; index++) {
        const entry = index === 0 ? {name: histories[index].source, selected: true} : {name: histories[index].source};
        years.push(entry);
    }
    return {years: years, archive: histories};
}

export const orders = (num = 50) => {
    const tableData = new TableData(ORDER_HEADERS, []);
    const types = ['buy', 'sell'];
    for (let index = 0; index < num; index++) {
        let cells: TableCell[] = [];
        cells.push(new TableCell(`${number(1, 59)}m`));
        cells.push(new TableCell(indexName()));
        cells.push(new TableCell(`${number(10, 150)}.${number(0, 99)}`));
        cells.push(new TableCell(number(10, 150).toString()));
        const type = types[number(0, types.length - 1)];
        cells.push(new TableCell(type.toUpperCase(), type));
        let row = new TableRow(cells);
        tableData.rows?.push(row);
    }
    return tableData;
}

export const activities = (num = 50) => {
    let items: ListDataRow[] = [];
    for (let index = 0; index < num; index++) {
        items.push(new ListDataRow('Lorem ipsum', formatDate((new Date((new Date()).getFullYear(), number(1, 12), number(1, 28), number(0, 23), number(0, 59))))));
    }
    return new ListData(items);
}

export const headlines = (num = 15) => {
    let items: ListDataRow[] = [];
    for (let index = 0; index < num; index++) {
        items.push(new ListDataRow('Lorem ipsum', 'Lorem ipsum'));
    }
    return new ListData(items);
}

export const alerts = (num = 20) => {
    let list: Alert[] = [];
    for (let index = 0; index < num; index++) {
        list.push(new Alert(index, 'Lorem ipsum'));
    }
    return list;
}