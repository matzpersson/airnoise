import React from 'react';
import { 
  TabPane,
  Row,
  Col,
  Button,
  Alert
} from 'reactstrap';
import DatePicker from '../components/core/tools/components/DatePicker';

const SearchQuery = (props) => {
  const {
    tabId
  } = props;

  return (
    <React.Fragment>
      <TabPane tabId={tabId} className="mb-2 p-3">
        <Row>
          <Col className="border-right border-primary">
            <Alert color="info">
              Flight Criteria
            </Alert>
            <ul>
              <li>Date Range</li>
              <li>Time Range</li>
              <li>Air Craft Type</li>
              <li>Noise Identifier</li>
              <li>Runway</li>
            </ul>
          </Col>
          <Col>
            <Alert color="info">
              Sensor Criteria
            </Alert>
              <ul>
                <li>dB Range</li>
              </ul>
          </Col>
        </Row>
        <div className="d-flex justify-content-center"><Button size="large" color="primary">Search</Button></div>
        
      </TabPane>
    </React.Fragment>
  )
}

export default SearchQuery;
