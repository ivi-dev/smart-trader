import React from 'react';

interface OptionsProp {
    children: {}
}

interface OptionsComponent {
    (prop: OptionsProp): JSX.Element;
}

const Options: OptionsComponent = (prop: OptionsProp) =>
    <div className="col-4 row no-gutters chart-controls align-items-center">
        {prop.children}
    </div>

export default Options;
