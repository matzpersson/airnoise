import React from 'react';
import { connect } from "react-redux";
import {
  Col,
  Row,
  Button
} from 'reactstrap';
import Map from './Ol.jsx';

import { 
  setCurrentTime,
  setStartTime,
  setEndTime,
  setStationChart
} from "../actions/";

import TimeSlider from "../components/TimeSlider";
import Sidepanel from "../components/MovementSidePanel";
import sensorData from '../../assets/data/monitor_data_185.json';
import movementData from '../../assets/data/aircraft_movements_withtype_60m.json';
import stations from '../../assets/data/monitors_20191027.json';

class Movements extends React.Component {
  constructor(props) {
    super(props);

    this.updateTimeSlider = this.updateTimeSlider.bind(this);
    this.playToggle = this.playToggle.bind(this);
    this.state = {
      playTimer: null,
      playCaption: "Play",
      aircraftPosition: {},
      sensor: [],
      timePath: {},
      currentPosition: { lat: -33.859583999999998, lng: 150.76334399999999 },
      startTime: 0,
      endTime: 0,
      currentTime: 0,
      current:{}
    };
  }

  componentDidMount() {
    let timePath = {};
    let sensorTimePath = {};
    let stationChart = [];

    movementData.forEach(function(element) {
      timePath[Date.parse(element.DT_MOVEMENT_POINT_TIME)] = element;
    })

    sensorData.forEach(function(element) {
      let elements = (sensorTimePath[Date.parse(element.dt_date_sample_time)] ? sensorTimePath[Date.parse(element.dt_date_sample_time)] :[]);
      elements.push(element);
      sensorTimePath[Date.parse(element.dt_date_sample_time)] = elements;
    })

    stations.forEach(function(element) {
      stationChart.push({y: element.IA_MONITOR_ID, x: 130})
    })

    const keys = Object.keys(timePath);
    const startTime = Date.parse(timePath[keys[0]].DT_MOVEMENT_POINT_TIME);
    const endTime = Date.parse(timePath[keys[keys.length - 1]].DT_MOVEMENT_POINT_TIME);

    this.props.dispatch(setStationChart(stationChart));
    this.props.dispatch(setStartTime(startTime));
    this.props.dispatch(setEndTime(endTime));

    this.setState({
      timePath,
      sensorTimePath,
      stationChart,
      startTime,
      endTime,
      currentPosition: { lat: timePath[keys[0]].latitude, lng: timePath[keys[0]].longitude },
      current: timePath[keys[0]]
    }, () => this.playToggle());
  }

  playToggle() {
    var {
      playTimer,
      playCaption,
      startTime,
      currentTime,
      timePath,
      sensorTimePath,
      aircraftPosition,
      sensor
    } = this.state;

    let self = this;

    if (playCaption === "Play") {
      playCaption = "Stop";
      currentTime = startTime;
      this.props.dispatch(setCurrentTime(currentTime));
      playTimer = setInterval(function() {
        currentTime += 1000
        if (timePath[currentTime]) {
          aircraftPosition = timePath[currentTime];
          self.setState({
            aircraftPosition,
            currentTime
          })
          // self.props.dispatch(setCurrentTime(currentTime));
        }

        if (sensorTimePath[currentTime]) {
          sensor = sensorTimePath[currentTime];
          self.setState({
            sensor
          })
          // self.props.dispatch(setSensor(sensor));
        }

        // self.props.dispatch(setCurrentTime(currentTime));
      }, 200);
    } else {
      playCaption = "Play";
      clearInterval(playTimer);
    }

    this.setState({
      playCaption,
      playTimer,
      currentTime,
    })
  }

  updateTimeSlider(time) {
    this.props.dispatch(setCurrentTime(time))

    const current = this.state.timePath[time];
    if (current) {
      this.setState({
        currentPosition: { lat: current.latitude, lng: current.longitude },
        current
      })
    }
  }

  render() {
    const {
      playCaption,
      currentPosition,
      aircraftPosition,
      startTime,
      endTime,
      currentTime,
      sensor,
      stationChart
    } = this.state;

    let buttonColour = (playCaption === 'Stop' ? 'danger' : 'primary');

    return (
      <div className="d-flex flex-column flex-grow-1" >
        <Row className="d-flex flex-grow-1 bg-warning p-0 m-0" >
          <Col className="d-flex flex-column bg-light p-0">
            <Map currentPosition={currentPosition} aircraftPosition={aircraftPosition} sensor={sensor} />
          </Col>
        </Row>
        <Row className="d-flex flex-grow-0 bg-secondary p-2 m-0">
          <Col xs="1">
            <Button className="mt-4" color={buttonColour} onClick={this.playToggle}>{playCaption}</Button>
          </Col>
          <Col>
            <div className="text-white text-center">{`Time (x2): ${new Date(currentTime)}`}</div>
            <TimeSlider startTime={startTime} endTime={endTime} updateTimeSlider={this.updateTimeSlider} currentTime={currentTime} />
          </Col>
        </Row>
      </div>
    );
  }
};

const mapStoreToProps = (store) => {
  return {
    timeslider: store.timeslider,
    layers: store.layers,
    movements: store.movements,
  }
}

export default connect(mapStoreToProps)(Movements);
