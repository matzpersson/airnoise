import React from 'react';
import { connect } from "react-redux";
import { Navbar } from 'reactstrap';
import './Header.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { showLayers } from "../actions/"

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.showLayers = this.showLayers.bind(this);
    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  showLayers() {
    this.props.dispatch(showLayers(true))
  }
  render() {
    return (
      <React.Fragment>
        <Navbar expand="lg" dark className="bg-primary d-flex justify-content-between text-white p-3">
          <Link to="/" >
            <FontAwesomeIcon size="2x" icon={['fal', 'microphone-alt']} className="text-white mr-3" />
            <div className="navbar-brand pt-0 pb-0">AirSense.io</div>
          </Link>
          <div>
            <Link to="/intro" >
              <FontAwesomeIcon size="2x" icon={['fal', 'home']} className="text-white mr-4" />
            </Link>
            <Link to="/search" >
              <FontAwesomeIcon size="2x" icon={['fal', 'search']} className="text-white mr-4" />
            </Link>
            <Link to="/" >
              <FontAwesomeIcon size="2x" icon={['fal', 'plane-departure']} className="text-white mr-4" />
            </Link>
          </div>
      </Navbar>
      </React.Fragment>
    )
  }
};

const mapStoreToProps = (store) => {
  return {
    layers: store.layers,
    // loading: store.ajaxRequests.calls > 0,
  }
}

export default connect(mapStoreToProps)(Header);
