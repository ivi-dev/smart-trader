import React from 'react';
import './Reports.css';

interface ReportsProp {
    children: {}
}

export interface ReportsComponent {
    (prop: ReportsProp): JSX.Element;
}

const Reports: ReportsComponent = (prop: ReportsProp) =>
    <section className="reports row no-gutters px-4 mt-4">
        {prop.children}
    </section>

export default Reports;