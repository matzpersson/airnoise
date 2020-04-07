import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';
import { HalfCircleSpinner } from 'react-epic-spinners';
import './Loader.scss';

const Loader = ({ loading, children }) => (
  <React.Fragment>
    <div className={ClassNames('spinner-holder', { 'd-none': !loading })}>
      <HalfCircleSpinner color="#ea4335" />
    </div>
  </React.Fragment>
);

Loader.propTypes = {
  loading: PropTypes.bool.isRequired,
};

export default Loader;
