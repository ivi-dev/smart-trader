import React from 'react';
import './App.css';
import Search from './Search';
import IndicesList  from './IndicesList';
import { Option, ChartDescriptor } from '../redux/store';
import Chart from './Chart';
import Reports from './Reports';
import { State, ReportData, ChartType } from '../redux/store';
import { connect } from 'react-redux';
import IndexData from '../IndexData';
import { Action } from '../redux/actions';
import * as actions from '../redux/actions';
import ButtonGroup from './ButtonGroup';
import BoxData from '../BoxData';
import ChartData from '../ChartData';
import Row from './Row';
import Text from './Text';
import Column from './Column';

interface AppProp {
  selectedIndex: IndexData | null,
  indicesList: IndexData[],
  searchResultsList: IndexData[],
  watchList: IndexData[],

  chartType: ChartType,
  chartOptions: any,
  chartTypes: Option[],
  dataSources: Option[],
  chartDataSource: number,
  resolutionOptions: Option[],
  chartResolution: string,
  indexHistory: ChartData,
  charts: ChartDescriptor[],
  selectedChart: number | null,

  reportButtons: Option[],
  reportData: ReportData,
  boxes: BoxData[],
  selectedBox: number | null,
  dispatch: (action: Action) => void
}

const App = (prop: AppProp) => {
  const handleIndicesListClick = (altKey: boolean, data: IndexData) => {
      if (prop.dispatch) {
          if (altKey) {
              prop.dispatch!(actions.addToWatchlist(data));
          } else {
              prop.dispatch!(actions.selectIndex(data));
          }
      }
  }
  const handleWatchlistClick = (altKey: boolean, data: IndexData) => {
      if (prop.dispatch) {
        if (altKey) {
            prop.dispatch!(actions.removeFromWatchlist(data));
        } else {
            prop.dispatch!(actions.selectIndex(data));
        }
      }
  }
  return (
    <>
      <Column classes={'col-2 p-2 vh-100 side-panel'}>
        <Search placeholder="Search for indices" dispatch={prop.dispatch} />
        <IndicesList data={prop.searchResultsList.length === 0 ? prop.indicesList : prop.searchResultsList} 
        handleClick={(altKey, data) => {handleIndicesListClick(altKey, data)}} />
        <IndicesList title={'Watchlist'} data={prop.watchList} handleClick={(altKey, data) => {handleWatchlistClick(altKey, data)}} />
      </Column>
      <Column classes={'col-10 vh-100 main-area'}>
        <Row classes={'px-4 border-bottom status-bar'}>
          <Text content={'Smart Trader'} classes={'h5 font-weight-light mt-1'} />
          <Text content={'v0.1'} classes={'ml-2 h6 position-relative small'} style={{'top': '1px'}} />
          <ButtonGroup options={prop.reportButtons} handleSelect={(type) => prop.dispatch(actions.addBox(BoxData.getBoxType(type)))} classes={'ml-auto my-3'} />
        </Row>
        <Row classes={'chart overflow-auto'} style={{'height': '52vh'}}>
          {prop.charts.map(chart => <Chart key={chart.id} id={chart.id} type={chart.type} width={prop.charts.length === 1 ? 12 : 6} options={prop.chartOptions} data={chart.data} activeIndex={chart.activeIndex} dataSources={prop.dataSources} year={chart.year} dispatch={prop.dispatch} resolutionOptions={prop.resolutionOptions} chartResolution={chart.resolution} chartTypes={prop.chartTypes} chartType={prop.chartType} selected={prop.selectedChart === chart.id ? true : false} />)}
        </Row>
        <Reports boxes={prop.boxes} selectedBox={prop.selectedBox} data={prop.reportData} dispatch={prop.dispatch} />
      </Column>
    </>
  );
}

function mapStateToProps(state: State) {
  return { 
    selectedIndex: state.selectedIndex,
    indicesList: state.indicesList,
    searchResultsList: state.searchResultsList,
    watchList: state.watchList,

    chartType: state.chartType,
    chartOptions: state.chartOptions,
    chartTypes: state.chartTypes,
    dataSources: state.dataSources,
    chartDataSource: state.chartDataSource,
    resolutionOptions: state.resolutionOptions,
    chartResolution: state.chartResolution,
    indexHistory: state.indexHistory,
    charts: state.charts,
    selectedChart: state.selectedChart,

    reportButtons: state.reportButtons,
    reportData: state.reportData,
    boxes: state.boxes,
    selectedBox: state.selectedBox
  };
}

export default connect(mapStateToProps)(App);
