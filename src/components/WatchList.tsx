import React from 'react';
import IndexData from '../IndexData';
import Index from './Index';
import './WatchList.css';

interface WatchListProp {
    title?: string,
    data: IndexData[],
    handleClick: (e: React.MouseEvent, data: IndexData) => void
}

export interface WatchListComponent {
    (prop: WatchListProp): JSX.Element;
}

const WatchList: WatchListComponent = (prop: WatchListProp) => {
    const title = prop.title ? <div className="row col-12 no-gutters pt-3 px-1 pb-2 text-muted">{prop.title}</div> : null;
    return (
        <>
            {title}
            <section id="watchlist" className="row col-12 no-gutters py-2 px-1">
                {prop.data.length === 0 ? <div className="empty-label row col-auto mt-5 mx-auto text-center text-muted">Empty</div> : prop.data.map(index => <Index key={index.id} data={index} handleClick={(e, data) => {prop.handleClick(e, data)}} />)}
            </section>
        </>
    );
}

export default WatchList;
