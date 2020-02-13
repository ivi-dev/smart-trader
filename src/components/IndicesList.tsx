import React from 'react';
import IndexData from '../IndexData';
import Index from './Index';
import './IndicesList.css';

type IndicesListProp = {
    title?: string,
    data: IndexData[],
    handleClick: (altKey: boolean, data: IndexData) => void
}

const IndicesList = (prop: IndicesListProp) => {
    const title = prop.title ? 
    <div className="row col-12 no-gutters pt-3 px-1 pb-2 text-muted">
        {prop.title}
    </div> : null;
    return (
        <>
            {title}
            <section className="indices-list align-items-start">
                {prop.data.length === 0 ? 
                <div className="empty-label row justify-content-center col-auto mt-5 mx-auto text-muted">Empty</div> : 
                prop.data.map(index => 
                <Index key={index.id} 
                       data={index} 
                       handleClick={(altKey, data) => 
                       {prop.handleClick(altKey, data)}} />)}
            </section>
        </>
    )
};
    
export default IndicesList;