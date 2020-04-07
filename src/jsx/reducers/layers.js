export default function reducer( state={
    fetching: false,
    fetched: false,
    showLayers: false,
    displayIcon: false,
    error: null,
  }, action) {

  switch (action.type) {
    case "SET_ICON_FULLFILLED": {
      return {
        ...state,
        fetching: true,
        fetched: false,
        displayIcon: action.payload
      }
    }
    case "SHOW_LAYERS_FULLFILLED": {
      return {
        ...state,
        fetching: true,
        fetched: false,
        showLayers: action.payload
      }
    }
    default: break;
  };
  return state;
}
