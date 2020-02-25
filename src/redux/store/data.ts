import { TableCell } from "../../models/Table";

export const trackers = {
    simulated: {
        priceMin: 90,
        priceMax: 100,
        trendMin: -5,
        trendMax: 5,
        tickInterval: 2000,
    },
    live: {
        timestamp: 0,
        governor: 2000
    }
}

export const ORDER_HEADERS = [
    new TableCell('Time'), 
    new TableCell('Stock'), 
    new TableCell('Price'), 
    new TableCell('Amount'), 
    new TableCell('Type')
];