export type AlertLevel = 'all' | 'error' | 'warning' | 'info';

export default class AlertData {
    constructor(public id: number, public text: string, 
        public level: AlertLevel = 'info') {}
}