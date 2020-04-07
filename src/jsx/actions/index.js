import movementData from '../../assets/data/aircraft_movements.json';

export function setCurrentTime(currentTime) {
  return function(dispatch) {
    dispatch({type: "SET_CURRENTTIME_FULFILLED", payload: currentTime});
  }
}

export function setStartTime(time) {
  return function(dispatch) {
    dispatch({type: "SET_STARTTIME_FULFILLED", payload: time});
  }
}

export function setEndTime(time) {
  return function(dispatch) {
    dispatch({type: "SET_ENDTIME_FULFILLED", payload: time});
  }
}

export function fetchMovements() {
  return function(dispatch) {
    dispatch({type: "FETCH_MOVEMENTS_FULFILLED", payload: movementData});
  }
}

export function showLayers(state) {
  return function(dispatch) {
    dispatch({type: "SHOW_LAYERS_FULLFILLED", payload: state});
  }
}

export function setSensor(sensor) {
  return function(dispatch) {
    dispatch({type: "SET_SENSOR_FULLFILLED", payload: sensor});
  }
}

export function setStationChart(stationChart) {
  return function(dispatch) {
    dispatch({type: "SET_STATIONCHART_FULLFILLED", payload: stationChart});
  }
}
