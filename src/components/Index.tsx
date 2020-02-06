import React from 'react';
import IndexData from '../IndexData';
import './Index.css';

interface IndexProp {
    data: IndexData,
    handleClick: (e: React.MouseEvent, data: IndexData) => void
}

const Index = (prop: IndexProp) => {
    return (
    <div className="index col-12 p-2 pl-3 mb-2 row align-items-center no-gutters rounded"
    onClick={(e) => {prop.handleClick(e, prop.data);}}>
        <div className="col name font-weight-bold">{prop.data.name}</div>
        <div className="col current">{prop.data.current}</div>
        <div className={`col-5 trend text-right ${prop.data.trend > 0 ? 'text-danger' : 'text-success'}`}>
            {prop.data.trend > 0 && '-'}{Math.abs(prop.data.trend)} 
            &nbsp;({Math.abs(Number((prop.data.trend / prop.data.open * 100).toFixed(2)))}%)
        </div>
    </div>
    );
}

export default Index;