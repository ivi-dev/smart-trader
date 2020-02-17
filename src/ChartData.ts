export class ChartDataEntry {
    constructor(public time: string, public price: number) {}
}

export default class ChartData {
    constructor(public entries: ChartDataEntry[]) {}

    static addSeries(chart: any, data: ChartDataEntry[], title?: string) {
        chart.addLineSeries({
            title: title?.toUpperCase() || '',
            lineWidth: 1,
            color: '#0099ff'
        }).setData(data, 'line');
    }
}