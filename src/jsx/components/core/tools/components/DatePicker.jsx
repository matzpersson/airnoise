import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker } from 'react-dates';
import './DatePicker.scss';

const DatePicker = (props) => {
  const {
    startDate: start,
    endDate: end,
    focusedInput,
    onDatesChange,
    onFocusChange,
  } = props;

  const datePickerOrientation = window.innerWidth > 768 ? 'horizontal' : 'vertical';

  return (
    <DateRangePicker
      startDate={start}
      endDate={end}
      startDateId="start_date_input"
      endDateId="end_date_input"
      onDatesChange={({ startDate, endDate }) => onDatesChange(startDate, endDate)}
      focusedInput={focusedInput}
      onFocusChange={focused => onFocusChange(focused)}
      displayFormat="YYYY-MM-DD"
      isOutsideRange={() => false}
      orientation={datePickerOrientation}
      hideKeyboardShortcutsPanel
    />
  );
};

DatePicker.propTypes = {
  startDate: PropTypes.instanceOf(Moment).isRequired,
  endDate: PropTypes.instanceOf(Moment).isRequired,
  focusedInput: PropTypes.string,
  onDatesChange: PropTypes.func.isRequired,
  onFocusChange: PropTypes.func.isRequired,
};

DatePicker.defaultProps = {
  focusedInput: '',
};

export default DatePicker;
