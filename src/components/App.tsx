import React from 'react';
import './App.css';
import SidePanel from './SidePanel';
import Main from './Main';
import Search from './Search';
import IndicesList  from './IndicesList';
import WatchList  from './WatchList';
import StatusBar from './StatusBar';
import IndexDetails from './IndexDetails';
import Selectors from './Selectors';
import ButtonGroup from './ButtonGroup';
import Selector, { Option } from './Selector';
import Chart, { ChartType } from './Chart';
import Reports from './Reports';
import Box from './Box';
import { State } from '../redux/store';
import { connect } from 'react-redux';
import IndexData from '../IndexData';
import { Action } from '../redux/actions';
import * as actions from '../redux/actions';
import ChartDataEntry from '../ChartDataEntry';
import TableData from '../TableData';
import ListData from '../ListData';
import Alert from '../Alert';

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
  orderHistory: TableData,
  activities: ListData,
  headlines: ListData,
  notifications: Alert[],
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
        <IndicesList data={prop.searchResultsList.length === 0 ? prop.indicesList : prop.searchResultsList} handleClick={(e, data) => {handleIndicesListClick(e, data)}} />
        <IndicesList title={'Watchlist'} data={prop.watchList} handleClick={(e, data) => {handleWatchlistClick(e, data)}} />
      </SidePanel>
      <Main>
        <StatusBar>
          <IndexDetails data={prop.selectedIndex} />
          <Selector title={'Chart type:'} options={prop.chartTypes} selected={prop.chartType} 
            classes={'ml-4'} handleSelect={(type) => {prop.dispatch(actions.setChartType(type))}} />
        </StatusBar>
        <Selectors>
          <Selector title={'Chart type:'} options={prop.chartDataSources} selected={prop.chartDataSource} handleSelect={(source) => {prop.dispatch(actions.setChartDataSource(source))}} />
          <ButtonGroup options={prop.resolutionOptions} active={prop.chartResolution} handleSelect={(resolution) => prop.dispatch(actions.setChartResolution(resolution))} />
        </Selectors>
        <Chart type={prop.chartType} data={prop.indexHistory} activeIndex={prop.selectedIndex} />
        <Reports>
          <Box title={'Order History'} tableData={prop.orderHistory} />
          <Box title={'Recent Activity'} listData={prop.activities} />
          <Box title={'Latest Headlines'} listData={prop.headlines} />
          <Box title={'Notifications'} alerts={prop.notifications} dismissAlert={(id) => prop.dispatch(actions.dismissAlert(id))} />
        </Reports>
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
    orderHistory: state.orderHistory,
    activities: state.activities,
    headlines: state.headlines,
    notifications: state.alerts
  };
}

export default connect(mapStateToProps)(App);
