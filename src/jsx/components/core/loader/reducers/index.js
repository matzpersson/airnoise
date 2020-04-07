import CLEAR_ERRORS from '../constants';

const initialState = {
  calls: 0,
  error: '',
};

const actionTypeEndsInPending = type => type.substring(type.length - 8) === '_PENDING';
const actionTypeEndsInFulfilled = type => type.substring(type.length - 10) === '_FULFILLED';
const actionTypeEndsInRejected = type => type.substring(type.length - 9) === '_REJECTED';

const handleRejectedResponse = (payload) => {
  if (typeof payload.response !== 'undefined') {
    return payload.response.data.message;
  }

  return payload.message || 'Network Error';
};

const ajaxRequests = (state = initialState, action) => {
  if (action.type === CLEAR_ERRORS) {
    return {
      ...state,
      error: '',
    };
  }

  if (actionTypeEndsInPending(action.type)) {
    return {
      ...state,
      calls: state.calls + 1,
    };
  }

  if (actionTypeEndsInFulfilled(action.type)) {
    return {
      ...state,
      calls: state.calls > 0 ? state.calls - 1 : 0,
    };
  }

  if (actionTypeEndsInRejected(action.type)) {
    return {
      ...state,
      calls: state.calls > 0 ? state.calls - 1 : 0,
      error: handleRejectedResponse(action.payload) || '',
    };
  }

  return state;
};

export default ajaxRequests;
