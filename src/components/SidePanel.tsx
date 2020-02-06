import React from 'react';
import './SidePanel.css';

interface SidePanelProp {
    children?: {}
}

export interface SidePanelComponent {
    (prop: SidePanelProp): JSX.Element;
}

const SidePanel: SidePanelComponent = (prop: SidePanelProp) =>
    <aside id="side-panel" className="col-2 p-2 vh-100">
        {prop.children}
    </aside>

export default SidePanel;