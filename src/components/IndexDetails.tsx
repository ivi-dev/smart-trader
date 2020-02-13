import React from 'react';
import './IndexDetails.css';
import IndexData from '../IndexData';

type IndexDetailsProp = {
    data: IndexData | null
}

const IndexDetails = (prop: IndexDetailsProp) =>
    <div className="col-4 row no-gutters index-details align-items-center">
        <div className="name mr-3 my-2">{prop.data?.name || '---'}</div>
        <div className="open pr-3 text-center">
            <div className="title">OPEN</div>
            <div className="value">{prop.data?.open || 'xxx'}</div>
        </div>
        <div className="current pr-3 text-center">
            <div className="title">CURRENT</div>
            <div className={`value ${prop.data && (prop.data?.current < 
                prop.data?.open) ? 'negative' : 'positive'}`}>
                    {prop.data?.current || 'xxx'}
            </div>
        </div>
    </div>

export default IndexDetails;