enum OrderType { BUY = 'BUY', SELL = 'SELL' };

export default class OrderData {
    constructor(public date: Date, public item: string, public price: number, 
        public amount: number, public type: OrderType) {}
}