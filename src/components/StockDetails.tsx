import React from 'react';
import './StockDetails.css';
import StockData from '../StockData';

type IndexDetailsProp = {
    data: StockData | null
}

const StockDetails = (prop: IndexDetailsProp) => {
    let color = 'positive';
    if (prop.data) {
        if (prop.data!.open > prop.data!.current) {
            color = 'negative';
        }
    }
    return (
        <div className="col-4 row no-gutters index-details align-items-center">
            <div className="name mr-3 my-2">{prop.data?.name || '---'}</div>
            <div className="mr-3 my-2 text-muted">{prop.data?.companyName || '---'}</div>
            <div className={`pr-3 text-center ${color}`}>
                {`${prop.data?.trend || '---'}%`}
            </div>
        </div>
    )
}

export default StockDetails;