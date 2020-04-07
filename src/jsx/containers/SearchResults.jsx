import React from 'react';
import { 
  TabPane,
  Table,
  Alert
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SearchResults = (props) => {
  const {
    tabId,
    tableHeadTh,
    tableBodyTr
  } = props;

  return (
    <React.Fragment>
      <TabPane tabId={tabId} className="mb-2 p-3">
        <div className="mt-3 p-0">
          <Alert color="warning">
            <FontAwesomeIcon icon={['fal', 'info']} className="mr-3 text-danger"/>
            On row Click, this could open the movement path with sensor data in map. Table should be sortable. You should also be able to select multiple paths and push to the map.
          </Alert>
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
    </React.Fragment>
  )
}

export default SearchResults;
