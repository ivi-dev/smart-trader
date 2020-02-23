export type AlertLevel = 'all' | 'error' | 'warning' | 'info';

export default class Alert {
    constructor(public id: number, public text: string, 
                public level: AlertLevel = 'info') {}
}