export type AlertLevel = 'error' | 'warning' | 'info';

export default class AlertData {
    constructor(public id: number, public text: string, 
        public level: AlertLevel = 'info') {}
}