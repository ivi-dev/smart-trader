import React from 'react';

interface ListItemProp {
    children: JSX.Element[]
}

export interface ListItemComponent {
    (prop: ListItemProp): JSX.Element;
}

const ListItem: ListItemComponent = (prop: ListItemProp) => 
    <div className="row data-row no-gutters px-3 pb-2">
        {prop.children}
    </div>

export default ListItem;