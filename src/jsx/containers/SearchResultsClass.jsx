import React, { Component } from 'react';
import { connect } from "react-redux";
import { 
  Table,
  TabPane
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  fetchMovements
} from "../actions/"

export class SearchResults extends Component {
  componentWillMount() {
    this.props.dispatch(fetchMovements());
  }

  renderRows(headers, movement) {
    let iconName = "plane-departure";
    let iconColour = "text-success mr-3"
    if (movement.C_OPERATION_TYPE === 'A') {
      iconName = "plane-arrival";
      iconColour = "text-warning mr-3"
    }
    
    const tableTd = headers.map((header, index) =>
      <td key={index}>{(index === 0 ? <FontAwesomeIcon icon={['fal', iconName]} className={iconColour} /> : null)}{movement[header.field]}</td>
    );

    return tableTd;
  }

  render() {
    const {
      tabId
    } = this.props;

    console.log("tabidresult", tabId)
    const {
      movements
    } = this.props.aircraft;

    const headers = [
      {caption: 'Movement Start', field: 'DT_MOVEMENT_START'},
      {caption: 'Make', field: 'Make'},
      {caption: 'Model', field: 'Model'},
      {caption: 'Runway', field: 'C_RUNWAY'},
      {caption: 'INM Noise ID', field: 'INMNoiseID'},
      {caption: 'Max dB', field: 'maxDb'}
    ]

    const tableHeadTh = headers.map((header, index) =>
      <th key={index}>{header.caption}</th>
    );

    const tableBodyTr = movements.map((movement, index) =>
      <tr key={index} onClick={() => {}}>
        {this.renderRows(headers, movement)}
      </tr>
    );

    return (
        <TabPane tabId={tabId} className="mb-2 p-3">
          <div className="mt-3 p-0">
            <Table size="sm" striped>
              <thead>
                <tr>
                  {tableHeadTh}
                </tr>
              </thead>
              <tbody>
                {tableBodyTr}
              </tbody>
            </Table>
          </div>
        </TabPane>
    )
  }
}

const mapStoreToProps = (store) => {
  return {
    aircraft: store.aircraft
  }
}

export default connect(mapStoreToProps)(SearchResults);
