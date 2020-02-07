import React from 'react';
import SidePanel from './SidePanel';
import Main from './Main';
import Search from './Search';
import IndicesList  from './IndicesList';
import StatusBar from './StatusBar';
import IndexDetails from './IndexDetails';
import Selectors from './Selectors';
import ButtonGroup from './ButtonGroup';
import Selector, { Option } from './Selector';
import Chart, { ChartType } from './Chart';
import Reports from './Reports';
import { State, ReportData } from '../redux/store';
import { connect } from 'react-redux';
import IndexData from '../IndexData';
import { Action } from '../redux/actions';
import * as actions from '../redux/actions';
import ChartDataEntry from '../ChartDataEntry';
import BoxData from '../BoxData';

interface AppProp {
  selectedIndex: IndexData | null,
  indicesList: IndexData[],
  searchResultsList: IndexData[],
  watchList: IndexData[],
  chartType: ChartType,
  chartTypes: Option[],
  chartDataSources: Option[],
  chartDataSource: number,
  resolutionOptions: Option[],
  chartResolution: string,
  indexHistory: ChartDataEntry[],
  reportData: ReportData,
  boxes: BoxData[],
  dispatch: (action: Action) => void
}

const App = (prop: AppProp) => {
  const handleIndicesListClick = (e: React.MouseEvent, data: IndexData) => {
      if (prop.dispatch) {
          if (e.altKey) {
              prop.dispatch!(actions.addToWatchlist(data));
          } else {
              prop.dispatch!(actions.selectIndex(data));
          }
      }
  }
  const handleWatchlistClick = (e: React.MouseEvent, data: IndexData) => {
      if (prop.dispatch) {
        if (e.altKey) {
            prop.dispatch!(actions.removeFromWatchlist(data));
        } else {
            prop.dispatch!(actions.selectIndex(data));
        }
      }
  }
  return (
    <>
      <SidePanel>
        <Search placeholder="Search for indices" />
        <IndicesList data={prop.searchResultsList.length === 0 ? prop.indicesList : prop.searchResultsList} 
        handleClick={(e, data) => {handleIndicesListClick(e, data)}} />
        <IndicesList title={'Watchlist'} data={prop.watchList} handleClick={(e, data) => {handleWatchlistClick(e, data)}} />
      </SidePanel>
      <Main>
        <StatusBar>
          <IndexDetails data={prop.selectedIndex} />
          <Selector title={'Chart type:'} options={prop.chartTypes} selected={prop.chartType} 
            classes={'ml-4'} handleSelect={(type) => {prop.dispatch(actions.setChartType(type))}} />
            <ButtonGroup options={[{name: '', graphic: 'fas fa-history'}, {name: '+ Activity', graphic: 'fas fa-chart-line'}, {name: '+ Headlines', graphic: 'far fa-newspaper'}, {name: '+ Notification', graphic: 'far fa-bell'}]} handleSelect={(type) => prop.dispatch(actions.addBox(BoxData.getBoxType(type)))} classes={'ml-auto'} />
        </StatusBar>
        <Selectors>
          <Selector title={'Data Source:'} options={prop.chartDataSources} sortOrder={'desc'} selected={prop.chartDataSource} handleSelect={(source) => {prop.dispatch(actions.setChartDataSource(source))}} />
          <ButtonGroup options={prop.resolutionOptions} active={prop.chartResolution} handleSelect={(resolution) => prop.dispatch(actions.setChartResolution(resolution))} />
        </Selectors>
        <Chart type={prop.chartType} data={prop.indexHistory} activeIndex={prop.selectedIndex} />
        <Reports boxes={prop.boxes} removeBox={(id) => prop.dispatch(actions.removeBox(id))} dismissAlert={(id) => prop.dispatch(actions.dismissAlert(id))} reportData={prop.reportData} />
      </Main>
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
    chartTypes: state.chartTypes,
    chartDataSources: state.chartDataSources,
    chartDataSource: state.chartDataSource,
    resolutionOptions: state.resolutionOptions,
    chartResolution: state.chartResolution,
    indexHistory: state.indexHistory,
    reportData: state.reportData,
    boxes: state.boxes
  };
}

export default connect(mapStateToProps)(App);
