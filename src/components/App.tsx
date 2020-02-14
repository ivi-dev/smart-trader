import React from 'react';
import './App.css';
import StocksList  from './StocksList';
import { Option, ChartDescriptor, HelpType } from '../redux/store';
import Chart from './Chart';
import Reports from './Reports';
import { State, ReportData, ChartType } from '../redux/store';
import { connect } from 'react-redux';
import StockData from '../StockData';
import { Action } from '../redux/actions';
import * as actions from '../redux/actions';
import ButtonGroup from './ButtonGroup';
import BoxData from '../BoxData';
import ChartData from '../ChartData';
import Row from './Row';
import Text from './Text';
import Column from './Column';
import Input from './Input';
import Help from './Help';
import Selector from './Selector';
import { alphabet, digits } from '../utility';
import Button from './Button';

type AppProp = {
  selectedIndex: StockData | null,
  stocksList: StockData[],
  stockStartLetter: string,
  marketSearchResultsList: StockData[],
  watchListSearchResultsList: StockData[],
  watchList: StockData[],
  exchanges: Option[],
  selectedExchange: {name: string, code: string},

  chartType: ChartType,
  chartOptions: any,
  chartTypes: Option[],
  dataSources: Option[],
  chartDataSource: number | string,
  resolutionOptions: Option[],
  chartResolution: string,
  indexHistory: ChartData,
  charts: ChartDescriptor[],
  selectedChart: number | null,

  buyButtons: Option[],
  sellButtons: Option[],
  reportButtons: Option[],
  generalButtons: Option[],
  reportData: ReportData,
  boxes: BoxData[],
  selectedBox: number | null,
  balance: number,
  buyQty: number,
  sellQty: number,

  help: HelpType,

  dispatch: (action: Action) => void
}

const App = (prop: AppProp) => {
  const getActiveHelpSection = () => {
    for (const section of prop.help.sections) {
      if (section.selected) {
        return section;
      }
    }
    return prop.help.sections[0];
  }
  return (
    <>
      <Help sections={prop.help.sections} 
            active={getActiveHelpSection().name.toString()} 
            content={getActiveHelpSection().data!} 
            visible={prop.help.visible} 
            dispatch={prop.dispatch} />

      <Column classes={`col-2 p-2 vh-100 side-panel ${prop.help.visible ? 'faded' : null}`}>
        {alphabet.map((letter, index) => <Button key={index} title={letter} classes={`mr-2 mb-2 ${letter === prop.stockStartLetter ? 'active' : null}`} style={{width: '25px', height: '25px'}} onClick={() => prop.dispatch(actions.selectStockStartLetter(letter))} />)}
        <StocksList title='Market' 
                    status='Fetching stocks...' 
                    listType='symbolsList' 
                    data={prop.marketSearchResultsList.length === 0 ? prop.stocksList : prop.marketSearchResultsList} 
                    dispatch={prop.dispatch} 
                    onSearch={value => prop.dispatch(actions.searchForIndex(value))} />
        <StocksList title='Watchlist' 
                    status='Empty' 
                    listType='watchList' 
                    dispatch={prop.dispatch} 
                    data={prop.watchListSearchResultsList.length === 0 ? prop.watchList : prop.watchListSearchResultsList} 
                    onSearch={value => prop.dispatch(actions.searchWatchlist(value))} />
      </Column>

      <Column classes={`col-10 vh-100 main-area ${prop.help.visible ? 'faded' : null}`}>
        <Row classes={'px-4 border-bottom status-bar'}>
          <Text content={'Smart Trader'} 
                classes={'h5 font-weight-light mt-2'} />
          <Text content={'v1.0'} 
                classes={'ml-2 h6 position-relative small'} 
                style={{'top': '3px'}} />
                <Selector title='Exchanges:'
                  options={prop.exchanges} 
                  selected={prop.selectedExchange.name}
                  handleSelect={value => prop.dispatch(actions.selectExchange(value))} 
                  classes='ml-4' />
          <Text content={'Balance:'} 
                classes={'mr-2 ml-auto text-muted small'} 
                style={{top: '2px'}} />
          <Text content={`${(new Intl.NumberFormat('en-US', 
                {style: 'currency', currency: 'USD'})).format(prop.balance)}`} 
                style={{fontSize: '120%'}} 
                classes={`mr-4 ${prop.balance < 0 ? 'text-danger' : ''}`} />

          <Input type="number" 
                 value={prop.buyQty} 
                 handleChange={(value) => prop.dispatch(actions.setBuyQty(Number(value)))} 
                 classes="text-white pl-2 buy rounded-left" 
                 style={{width: '50px'}} 
                 handleReturnKeyPress={() => prop.dispatch(actions.buy())} />
          <ButtonGroup options={prop.buyButtons} 
                       classes={'my-3 buy-buttons'} 
                       btnClasses={'single'} />

          <Input type="number" 
                 value={prop.sellQty} 
                 handleChange={(value) => prop.dispatch(actions.setSellQty(Number(value)))} 
                 classes="ml-3 text-white pl-2 sell rounded-left" 
                 style={{width: '50px'}} handleReturnKeyPress={() => prop.dispatch(actions.sell())} />
          <ButtonGroup options={prop.sellButtons} 
                       classes={'my-3 sell-buttons'} 
                       btnClasses={'single'} />

          <ButtonGroup options={prop.reportButtons} classes={'ml-4 my-3'} />
          <ButtonGroup options={prop.generalButtons} classes={'ml-2 my-3'} />
        </Row>
        <Row classes={'chart overflow-auto'} style={{'height': '52vh'}}>
          {prop.charts.map(chart => <Chart key={chart.id} 
                                           id={chart.id} 
                                           type={chart.type} 
                                           width={prop.charts.length === 1 ? 12 : 6} 
                                           options={prop.chartOptions} 
                                           data={chart.data} 
                                           activeIndex={chart.activeIndex} 
                                           dataSources={prop.dataSources} 
                                           year={chart.source} 
                                           dispatch={prop.dispatch} resolutionOptions={prop.resolutionOptions} 
                                           chartResolution={chart.resolution} 
                                           chartTypes={prop.chartTypes} 
                                           chartType={prop.chartType} 
                                           selected={prop.selectedChart === chart.id ? true : false} />)}
        </Row>
        <Reports boxes={prop.boxes} 
                 selectedBox={prop.selectedBox} 
                 data={prop.reportData} 
                 dispatch={prop.dispatch} />
      </Column>
    </>
  );
}

function mapStateToProps(state: State) {
  return { 
    selectedIndex: state.selectedIndex,
    stocksList: state.stocksList,
    stockStartLetter: state.stockStartLetter,
    marketSearchResultsList: state.marketSearchResultsList,
    watchListSearchResultsList: state.watchListSearchResultsList,
    watchList: state.watchList,
    exchanges: state.exchanges,
    selectedExchange: state.selectedExchange,

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

    buyButtons: state.buyButtons,
    sellButtons: state.sellButtons,
    reportButtons: state.reportButtons,
    generalButtons: state.generalButtons,
    reportData: state.reportData,
    boxes: state.boxes,
    selectedBox: state.selectedBox,
    balance: state.balance,
    buyQty: state.buyQty,
    sellQty: state.sellQty,

    help: state.help
  };
}

export default connect(mapStateToProps)(App);
