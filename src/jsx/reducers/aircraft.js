export default function reducer( state={
    fetching: false,
    fetched: false,
    movements: [],
    error: null,
  }, action) {

  switch (action.type) {
    case "FETCH_MOVEMENTS_FULFILLED": {
      return {
        ...state,
        fetching: true,
        fetched: false,
        movements: action.payload
      }
    }
    default: break;
  };
  return state;
}
