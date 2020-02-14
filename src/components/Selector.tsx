import React from 'react';
import { capitalize } from '../utility';
import { Option } from '../redux/store';
import './Selector.css';

type SelectorProp = {
    title: string,
    options: Option[],
    selected: string | number,
    flush?: boolean,
    sortOrder?: 'asc' | 'desc',
    classes?: string,
    handleSelect: (value: string, ...other: any[]) => void
}

const Selector = (prop: SelectorProp) => {
    const sortOptions = (sortOrder = 'asc') => {
        let options = prop.options.slice();
        return options.sort((item1, item2) => {
            if (item1.name < item2.name) {
                return sortOrder === 'asc' ? -1 : 1;
            } else if (item1.name > item2.name) {
                return sortOrder === 'asc' ? 1 : -1;
            } else {
                return 0;
            }
        });
    }
    return (
        <div className={`row no-gutters align-items-center 
            col-auto selector ${prop.classes}`}>
            <div className="col-auto title">
                {prop.title}
            </div>
            <select className={`col-auto ${!prop.flush ? 'ml-2' : null}`} 
                    onChange={(e) => {prop.handleSelect(
                        (e.target as HTMLSelectElement).value)}} 
                    value={prop.selected}>
                {sortOptions(prop.sortOrder).sort().map((option, index) => 
                    <option key={index} value={option.name}>
                    {capitalize(option.name.toString())}
                </option>)}
            </select>
        </div>
    );
}

export default Selector;