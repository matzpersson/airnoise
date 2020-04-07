import React, { Component, useState } from 'react';
import { connect } from "react-redux";
import { 
  Nav,
  NavItem,
  NavLink,
  TabContent
} from 'reactstrap';
import classnames from 'classnames';

import SearchResults from './SearchResults'
import SearchQuery from './SearchQuery'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  fetchMovements
} from "../actions/"

export class Search extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeTab: '1'
    };

    this.toggle = this.toggle.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(fetchMovements());
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
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
      <div className="p-3 form">

        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => { this.toggle('1'); }}
            >
              Dataset
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}
            >
              Search
            </NavLink>
          </NavItem>

        </Nav>
        <TabContent activeTab={this.state.activeTab} className="border-bottom border-primary">
          <SearchResults tabId="1" tableHeadTh={tableHeadTh} tableBodyTr={tableBodyTr} />
          <SearchQuery tabId="2" />
        </TabContent>
      </div>
    )
  }
}

const mapStoreToProps = (store) => {
  return {
    aircraft: store.aircraft
  }
}

export default connect(mapStoreToProps)(Search);
