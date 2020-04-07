export default function reducer( state={
    fetching: false,
    fetched: false,
    movement: false,
    sensor: false,
    stationChart: [],
    error: null,
  }, action) {

  switch (action.type) {
    case "SET_MOVEMENT_FULLFILLED": {
      return {
        ...state,
        fetching: true,
        fetched: false,
        movement: action.payload
      }
    }
    case "SET_SENSOR_FULLFILLED": {
      return {
        ...state,
        fetching: true,
        fetched: false,
        sensor: action.payload
      }
    }
    case "SET_STATIONCHART_FULLFILLED": {
      return {
        ...state,
        fetching: true,
        fetched: false,
        stationChart: action.payload
      }
    }
    default: break;
  };
  return state;
}
