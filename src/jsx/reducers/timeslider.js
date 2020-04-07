export default function reducer( state={
    fetching: false,
    fetched: false,
    startTime: 0,
    endTime: 0,
    currentTime: null,
    error: null,
  }, action) {

  switch (action.type) {
    case "SET_STARTTIME_FULFILLED": {
      return {
        ...state,
        fetching: true,
        fetched: false,
        startTime: action.payload
      }
    }
    case "SET_ENDTIME_FULFILLED": {
      return {
        ...state,
        fetching: true,
        fetched: false,
        endTime: action.payload
      }
    }
    case "SET_CURRENTTIME_PENDING": {
      return {
        ...state,
        fetching: true,
        fetched: false,
      }
    }
    case "SET_CURRENTTIME_FULFILLED": {
      return {
        ...state,
        fetching: false,
        fetched: true,
        currentTime: action.payload
      }
    }
    case "SET_CURRENTTIME_REJECTED": {
      return {
        ...state,
        fetching: false,
        fetched: true,
      }
    }
    default: break;
  };

  return state;
}
