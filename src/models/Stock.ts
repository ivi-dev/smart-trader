export default class Stock {
    constructor(public id: number, public name: string, public open: number, 
        public close: number, public high: number, public low: number, 
        public current: number, public trend: number, public companyName?: string) {}
}