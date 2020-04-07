import React from 'react';
import {
  Row
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {FlexibleXYPlot, HorizontalBarSeries, VerticalGridLines, HorizontalGridLines, VerticalBarSeries, YAxis, XAxis, MarkSeries, HeatmapSeries} from 'react-vis';

const MovementSidePanel = (props) => {
  const {
    stationChart,
    sensor
  } = props;

  let stationChartData = [];
  if (stationChart) {
    stationChart.forEach(function(element) {
      let value = element.y;

      if (element.x === sensor.IA_MONITOR_ID) {
        value = sensor.value;
      }
      
      stationChartData.push({x: element.x, y: value});
    })
  }

  return (
    <React.Fragment>
      <div className="border-bottom border-primary text-light ml-1 mt-3 p-1 w-100"><small>SENSOR ACTIVITY</small></div>
      <Row className="text-white border-bottom border-secondary m-0 p-2">
        <FlexibleXYPlot height={250} >
          <HorizontalBarSeries data={stationChart} style={{stroke: "blue", line: {strokeWidth: 2, padding: 2}}}  />
          <YAxis orientation="left"/>
          <YAxis title="dB" orientation="right" />
          <XAxis />
        </FlexibleXYPlot>
      </Row>
    </React.Fragment>
  )
}

export default MovementSidePanel;
