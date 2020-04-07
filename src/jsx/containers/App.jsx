import React, { Component } from 'react';
import { 
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";

import { rootRoutes } from '../constants/routes';
import Loader from '../components/core/loader/components/Loader';

import '../../styles/App.css';
import Header from './Header.jsx';
import '../../styles/App.css';

class App extends Component {
  render() {
    const {
      loading,
    } = this.props;

    return (
      <Router>
        <div className="container-fluid p-0 h-100 d-flex flex-column">
          <Header />
          {/* <Loader loading={loading}> */}
            <Switch>
              {
                rootRoutes.map((route, index) => (
                  <Route
                    exact={route.exact}
                    key={index}
                    path={route.path}
                    route={route}
                    component={route.component}
                  />
                ))
              }
            </Switch>
          {/* </Loader> */}
        </div>
      </Router>
    );
  }
}

export default App;
