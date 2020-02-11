import { ChartType } from './redux/store';

export class ChartDataEntry {
    constructor(public time: string, public open: number, 
        public close: number, public high: number, 
        public low: number) {}
}

export default class ChartData {
    constructor(public entries: ChartDataEntry[]) {}
    
    static convertData(data: ChartDataEntry[], to: ChartType) {
        let newData: {time: string, value: number}[] = [];
        for (const entry of data) {
            if (to === 'line')
            newData.push({time: !entry.time.includes('Intraday') ? entry.time : entry.time.replace('Intraday', (new Date()).getFullYear().toString()), value: entry.close});
        }
        return newData;
    }

    static addSeries(chart: any, data: ChartDataEntry[], type: string, title?: string) {
        switch (type) {
            case 'bar': 
                chart.addBarSeries({
                    title: title?.toUpperCase() || '',
                    thinBars: false
                }).setData(data);
            break;
            case 'line': 
                chart.addLineSeries({
                    title: title?.toUpperCase() || '',
                    lineWidth: 1,
                    color: '#0099ff'
                }).setData(ChartData.convertData(data, 'line'));
            break;
            default:
                chart.addCandlestickSeries({
                    title: title?.toUpperCase() || ''
                }).setData(data);
        }
    }
}