import { combineReducers } from 'redux';
import ajaxRequests from '../components/core/loader/reducers';
import timeslider from './timeslider.js';
import aircraft from './aircraft.js';
import layers from './layers.js';
import movements from './movements.js';

export default combineReducers({
  ajaxRequests,
  aircraft,
  timeslider,
  layers,
  movements
});
