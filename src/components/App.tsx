import React from 'react';
import SidePanel from './SidePanel';
import Main from './Main';
import Search from './Search';
import IndicesList  from './IndicesList';
import StatusBar from './StatusBar';
import IndexDetails from './IndexDetails';
import ButtonGroup from './ButtonGroup';
import { Option, ChartDescriptor } from '../redux/store';
import Chart from './Chart';
import Reports from './Reports';
import { State, ReportData, ChartType } from '../redux/store';
import { connect } from 'react-redux';
import IndexData from '../IndexData';
import { Action } from '../redux/actions';
import * as actions from '../redux/actions';
import BoxData from '../BoxData';
import ChartData from '../ChartData';
import Row from './Row';

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

  reportButtons: Option[],
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
            <ButtonGroup options={prop.reportButtons} handleSelect={(type) => prop.dispatch(actions.addBox(BoxData.getBoxType(type)))} classes={'ml-auto'} />
        </StatusBar>
        <Row classes={'chart overflow-auto'}>
          {prop.charts.map(chart => <Chart key={chart.id} id={chart.id} type={chart.type} options={prop.chartOptions} data={chart.data} activeIndex={chart.activeIndex} dataSources={prop.dataSources} year={chart.year} dispatch={prop.dispatch} resolutionOptions={prop.resolutionOptions} chartResolution={chart.resolution} chartTypes={prop.chartTypes} chartType={prop.chartType} />)}

          {/* <Chart type={prop.chartType} options={prop.chartOptions} data={prop.indexHistory} activeIndex={prop.selectedIndex} chartDataSources={prop.chartDataSources} chartDataSource={prop.chartDataSource} handleDataSourceSelect={(source) => {prop.dispatch(actions.setChartDataSource(source))}} resolutionOptions={prop.resolutionOptions} chartResolution={prop.chartResolution} handleResolutionSelect={(resolution) => prop.dispatch(actions.setChartResolution(resolution))} />
          <Chart type={prop.chartType} options={prop.chartOptions} data={prop.indexHistory} activeIndex={prop.selectedIndex} chartDataSources={prop.chartDataSources} chartDataSource={prop.chartDataSource} handleDataSourceSelect={(source) => {prop.dispatch(actions.setChartDataSource(source))}} resolutionOptions={prop.resolutionOptions} chartResolution={prop.chartResolution} handleResolutionSelect={(resolution) => prop.dispatch(actions.setChartResolution(resolution))} /> */}
        </Row>
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
    chartOptions: state.chartOptions,
    chartTypes: state.chartTypes,
    dataSources: state.dataSources,
    chartDataSource: state.chartDataSource,
    resolutionOptions: state.resolutionOptions,
    chartResolution: state.chartResolution,
    indexHistory: state.indexHistory,
    charts: state.charts,

    reportButtons: state.reportButtons,
    reportData: state.reportData,
    boxes: state.boxes
  };
}

export default connect(mapStateToProps)(App);
