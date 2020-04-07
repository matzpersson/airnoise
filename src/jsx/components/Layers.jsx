import React from 'react';
import SlidingPanel from 'react-sliding-side-panel';
import { Button, Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import SimpleSlider from '../components/SimpleSlider';

const Layers = (props) => {
  const {
    showLayers
  } = props;

  return (
    <React.Fragment>
      <SlidingPanel
        type={'right'}
        isOpen={showLayers}
        size={30}
        className="mt-3"
      >
        <div class="bg-dark h-100 p-2">
          <FormGroup className="p-2">
            <div className="border-bottom border-primary text-secondary">Maps</div>
            <FormGroup check>
              <Label check className="text-light p-2 pl-2">
                <Input type="radio" name="map1" />{' '}
                Open Street
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check className="text-light pl-2">
                <Input type="radio" name="map2" />{' '}
                Bing Satellite 
              </Label>
            </FormGroup>
          </FormGroup>

          <FormGroup className="p-2 text-light">
            <div className="border-bottom border-primary mt-0 text-secondary">Show Attributes</div>
            <FormGroup check>
              <Label check className="p-2 pl-2">
                <Input type="checkbox" />{' '}
                Flight paths
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check className="pl-2">
                <Input type="checkbox" />{' '}
                Noise Monitors
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check className="p-2 pl-2">
                <Input type="checkbox" />{' '}
                Heatmap
              </Label>
            </FormGroup>
            <Row className="ml-4">
              <Col xs="1" className="p-2">Blur</Col>
              <Col><SimpleSlider /></Col>
            </Row>
            <Row className="ml-4">
              <Col xs="1" className="p-2">Radius</Col>
              <Col><SimpleSlider /></Col>
            </Row>
          </FormGroup>

        </div>
      </SlidingPanel>
    </React.Fragment>
  )
}

export default Layers;