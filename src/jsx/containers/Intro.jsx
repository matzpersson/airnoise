import React, { Component } from 'react';
import { 
  Link
} from "react-router-dom";
import {
  Button
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Intro extends Component {
  render() {
    return (
      <div className="h-100 text-center mt-5">
        <FontAwesomeIcon size="3x" icon={['fal', 'microphone-alt']} className="text-primary m-3" />
        <h1>Status</h1>
        <p>Primarily just experimented with the data and thrown in a couple of visualisation and data query options. Utilised flightpath and sensor data from Noiseworks data set.</p>
        <p>FrontEnd only, no api connection yet. AWS cloud hosted for site and mssql</p>
        <p>Map page shows heatmap for a couple of days extracted from Noiseworks dataset. Also visualise a single flight path with typical flight details. 
          Map shows sensor locations and flight will move with slider. Nav icon's top-right</p>
        <p>Layer panel is placeholder attributes only</p>
        <p>Search page shows a couple of days worth of flight paths</p>
        <Link to="/"><Button color="danger">Get Started</Button></Link>
      </div>
    )
  }
}

export default Intro;
