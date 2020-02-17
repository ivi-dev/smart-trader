import React, { RefObject } from 'react';
import './Search.css';

type SearchProp = {
    placeholder?: string,
    classes?: string,
    style?: {},
    onKeyUp: (value: string) => void
}

const Search = (prop: SearchProp) => {
    let inputRef: RefObject<HTMLInputElement> = React.createRef();
    return (
    <section className={`search position-relative ${prop.classes}`} style={prop.style}>
        <input ref={inputRef} type="search" className="col-12" 
            placeholder={prop.placeholder} 
            onKeyUp={(e) => {
                prop.onKeyUp((e.target as HTMLInputElement).value)}} />
        <i className="fas fa-search position-absolute" onClick={() => {inputRef.current?.focus()}}></i>
    </section>
    )
}

export default Search;