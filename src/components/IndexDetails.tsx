import React from 'react';
import './IndexDetails.css';
import IndexData from '../IndexData';

interface IndexDetailsProp {
    data: IndexData | null
}

const IndexDetails = (prop: IndexDetailsProp) =>
    <div className="col-4 row no-gutters index-details align-items-center">
        <div className="name mr-3 my-2">{prop.data?.name || '---'}</div>
        <div className="open pr-3 text-center">
            <div className="title">OPEN</div>
            <div className="value">{prop.data?.open ||'xxx'}</div>
        </div>
        <div className="high pr-3 text-center">
            <div className="title">HIGH</div>
            <div className="value">{prop.data?.high ||'xxx'}</div>
        </div>
        <div className="low pr-3 text-center">
            <div className="title">LOW</div>
            <div className="value">{prop.data?.low || 'xxx'}</div>
        </div>
    </div>

export default IndexDetails;