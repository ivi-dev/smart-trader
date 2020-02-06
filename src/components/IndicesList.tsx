import React from 'react';
import IndexData from '../IndexData';
import Index from './Index';
import './IndicesList.css';

interface IndicesListProp {
    title?: string,
    data: IndexData[],
    handleClick: (e: React.MouseEvent, data: IndexData) => void
}

export interface IndicesListComponent {
    (prop: IndicesListProp): JSX.Element
}

const IndicesList: IndicesListComponent = (prop: IndicesListProp) => {
    const title = prop.title ? <div className="row col-12 no-gutters pt-3 px-1 pb-2 text-muted">{prop.title}</div> : null;
    return (
        <>
            {title}
            <section className="indices-list align-items-start">
                {prop.data.length === 0 ? <div className="empty-label row justify-content-center col-auto mt-5 mx-auto text-muted">Empty</div> : prop.data.map(index => <Index key={index.id} data={index} handleClick={(e, data) => {prop.handleClick(e, data)}} />)}
            </section>
        </>
    )
};
    
export default IndicesList;