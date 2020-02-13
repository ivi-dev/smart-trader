import React from 'react';
import './Search.css';
import { Action } from '../redux/actions';
import * as actions from '../redux/actions';

type SearchProp = {
    placeholder: string,
    dispatch: (action: Action) => void
}

const Search = (prop: SearchProp) =>
    <section id="search" className="mb-4 mt-2">
        <input type="search" className="col-12" 
            placeholder={prop.placeholder} 
            onKeyUp={(e) => {
                prop.dispatch(actions.searchForIndex(
                    (e.target as HTMLInputElement).value))}} />
        <i className="fas fa-search position-absolute"></i>
    </section>

export default Search;