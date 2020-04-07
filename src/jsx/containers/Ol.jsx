import React from 'react';
import { connect } from "react-redux";
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';

import XYZ from 'ol/source/XYZ';
import {fromLonLat, transform} from 'ol/proj.js';
import OSM, {ATTRIBUTION} from 'ol/source/OSM';
import {
  Icon,
  Style,
  Fill,
  Stroke,
  Circle as CircleStyle,
  RegularShape,
  Text }
from 'ol/style';

import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Circle from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import Polygon from 'ol/geom/Polygon';
import {circular} from 'ol/geom/Polygon';
import {Vector as VectorSource, Cluster} from 'ol/source';
import WKT from 'ol/format/WKT';
import {Vector as VectorLayer, Heatmap} from 'ol/layer';
import {getVectorContext} from 'ol/render';
import {unByKey} from 'ol/Observable';
import {easeOut} from 'ol/easing';

import flightIcon from '../../images/aircraft_topview_black_40.png';
import monitors from '../../assets/data/monitors_185.json';
import flightPath from '../../assets/data/flightpath2_185.json';
import monitorData from '../../assets/data/monitor_data_185.json';

// TODO - Needs breaking up into components

class MapContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPosition: {
        lat: 0,
        lng: 0
      },
      iconFeature: {},
      movementLayer: null,
      map:{}
    };
    this.renderFlight = this.renderFlight.bind(this);
    this.renderMonitorMarkers = this.renderMonitorMarkers.bind(this);
    this.getRandomColor = this.getRandomColor.bind(this);
    this.clearLayers = this.clearLayers.bind(this);
  }

  componentDidMount() {
    this.renderMap(); 
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  renderCluster() {
    const features = monitorData.map((monitor, index) => {
      var feature =  new Feature({
        geometry: new Point(fromLonLat([monitor.f_longitude, monitor.f_latitude])),
        weight: monitor.F_VALUE
      })
      return feature;
    });

    var vectorSource = new VectorSource({
      features: features
    });

    var clusterSource = new Cluster({
      distance: 2,
      source: vectorSource
    });

    var earthquakeFill = new Fill({
      color: 'rgba(255, 153, 0, 0.8)'
    });
    var earthquakeStroke = new Stroke({
      color: 'rgba(255, 204, 0, 0.2)',
      width: 1
    });

    var vectorLayer = new VectorLayer({
      source: clusterSource,
      style: function(feature) {
        console.log(feature)
        return new Style({
          geometry: feature.getGeometry(),
          image: new RegularShape({
            radius1: feature.weight * 20,
            radius2: 3,
            points: 5,
            angle: Math.PI,
            fill: earthquakeFill,
            stroke: earthquakeStroke
          })
        });
      }
    });

    return vectorLayer;
  }

  renderHeatMap() {
    const features = monitorData.map((monitor, index) => {
      var feature =  new Feature({
        geometry: new Point(fromLonLat([monitor.f_longitude, monitor.f_latitude])),
        weight: monitor.F_VALUE / 100
      })
      return feature;
    });

    var vectorSource = new VectorSource({
      features: features
    });

    var heatMapLayer = new Heatmap({
      source: vectorSource,
      radius: 10,
      blur: 40
    });

    return heatMapLayer;
  }

  renderFlightPath() {
    const coords = flightPath.map((flight, index) => {
      return [flight.longitude, flight.latitude];
    })

    var polyline = new LineString(coords);
    polyline.transform('EPSG:4326', 'EPSG:3857');

    var feature = new Feature(polyline);
    feature.setStyle(new Style({
      stroke: new Stroke({
        color: 'gray',
        width: 3,
        lineDash: [.1, 5]
      }),
      fill: new Fill({
        color: 'rgba(0, 0, 255, 0.1)'
      })
    }));

    var vectorSource = new VectorSource({
      features: [feature]
    });
    
    var vectorLayer = new VectorLayer({
      source: vectorSource
    });

    return vectorLayer;
  }

  renderFlight(currentPosition) {
    let iconFeature = this.state.iconFeature;
    let newGeometry = new Point(fromLonLat([currentPosition.lng, currentPosition.lat])).flatCoordinates;
    let oldGeometry = iconFeature.getGeometry().flatCoordinates;

    if (newGeometry[0] !== oldGeometry[0] || newGeometry[1] !== oldGeometry[1]) {
      iconFeature.setGeometry(new Point(fromLonLat([currentPosition.lng, currentPosition.lat])));
      this.setState({
        iconFeature
      });
    }
  }

  clearLayers() {
    const {
      movementLayer,
      sensorLayer
    } = this.state;

    let source = sensorLayer.getSource();
    source.clear();

    source = movementLayer.getSource();
    source.clear();
  }

  flash(map, tileLayer, feature, sensorFill, sensorLabel) {
    var start = new Date().getTime();
    var listenerKey = tileLayer.on('postrender', animate);
    var duration = 3000;

    function hexToRgbA(hex, opacity) {
      var c;
      if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length === 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+', ' + opacity +')';
      }
      throw new Error('Bad Hex');
    }

    function animate(event) {
      var vectorContext = getVectorContext(event);
      var frameState = event.frameState;
      var flashGeom = feature.getGeometry().clone();
      var elapsed = frameState.time - start;
      var elapsedRatio = elapsed / duration;
      // radius will be 5 at start and 30 at end.
      var radius = easeOut(elapsedRatio) * 25 + 5;
      var opacity = easeOut(1 - elapsedRatio);
      var rgbaColour = hexToRgbA(sensorFill, opacity);

      var style = new Style({
        image: new CircleStyle({
          radius: radius,
          stroke: new Stroke({
            // color: 'rgba(255, 0, 0, ' + opacity + ')',
            color: rgbaColour,
            width: 0.5 + opacity
          })
        }),
        text: new Text({
          font: '14px Calibri,sans-serif',
          fill: new Fill({ color: '#000' }),
          stroke: new Stroke({
            color: '#fff', width: 2
          }),
          text: sensorLabel,
          fontWeight: "bold"
        })
      });

      vectorContext.setStyle(style);
      vectorContext.drawGeometry(flashGeom);
      if (elapsed > duration) {
        unByKey(listenerKey);
        return;
      }
      // tell OpenLayers to continue postrender animation
      map.render();
    }
  }

  renderSensor(sensor) {
    let {
      sensorLayer,
      map
    } = this.state;

    if (sensor && sensor.f_latitude && sensor.f_longitude) {
      let source = sensorLayer.getSource();
      let features = source.getFeatures();

      var sensorFeature = source.getFeatureById(sensor.IA_MONITOR_ID);
      if (sensorFeature) {
        sensorFeature.getGeometry().setCoordinates(fromLonLat([ parseFloat(sensor.f_longitude), parseFloat(sensor.f_latitude)] ));
      } else {
        sensorFeature = new Feature({
          geometry: new Point(fromLonLat([ parseFloat(sensor.f_longitude), parseFloat(sensor.f_latitude)] )),
          name: sensor.I_AIRCRAFT_MOVEMENT_ID,
        });
        sensorFeature.setId(sensor.I_AIRCRAFT_MOVEMENT_ID);
      }

      const sensorValue = parseInt(sensor.value);
      const sensorLabel = sensorValue + 'dB';
      let sensorFill = '#00F900';
      let sensorRadius = '4'

      switch (true) {
        case (sensorValue < 60):
          sensorFill = '#00F900';
          sensorRadius = '4'
          break;
        case (sensorValue > 60 && sensorValue < 70):
          sensorFill = '#F962FE';
          sensorRadius = '10'
          break;
        case (sensorValue > 70 && sensorValue < 80):
            sensorFill = '#0433FF';
            sensorRadius = '10'
            break;
        case (sensorValue > 80 && sensorValue < 100):
          sensorFill = '#FE8C24';
          sensorRadius = '15'
          break;
        case (sensorValue > 100):
          sensorFill = '#FF2600';
          sensorRadius = '20'
          break;
        default: 

        break;
      } 

      this.flash(map, sensorLayer, sensorFeature, sensorFill, sensorLabel)

      features.push(sensorFeature);
      this.state.sensorLayer.setSource(
        new VectorSource({
          features: features
        })
      );
    } else {
      console.log("missed one")
    }
  }

  renderTrail(aircraft, aircraftFeature) {
    let trailFeature = new Feature({
      geometry: new Point(fromLonLat([ parseFloat(aircraft.F_LONGITUDE), parseFloat(aircraft.F_LATITUDE)] )),
      name: aircraft.I_AIRCRAFT_MOVEMENT_ID
    });

    var iconStyle = new Style({
      image: new CircleStyle({
        radius: 2,
        fill: new Fill({color: aircraftFeature.get('trailColour')}),
        opacity: 0.5,
        stroke: new Stroke({
          color: 'gray', width: 1
        })
      })
    });

    trailFeature.setStyle(iconStyle);
    return trailFeature;
  }

  toRadians(degrees) {
    return degrees * Math.PI / 180;
  };

  // Converts from radians to degrees.
  toDegrees(radians) {
    return radians * 180 / Math.PI;
  }

  bearing(startLat, startLng, destLat, destLng){
    startLat = this.toRadians(startLat);
    startLng = this.toRadians(startLng);
    destLat = this.toRadians(destLat);
    destLng = this.toRadians(destLng);
  
    var y = Math.sin(destLng - startLng) * Math.cos(destLat);
    var x = Math.cos(startLat) * Math.sin(destLat) -

    Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
    var brng = Math.atan2(y, x);
    return brng;
  }

  renderAircraftMovement(aircraft) {
    let {
      currentPosition,
      movementLayer
    } = this.state;

    if (aircraft && aircraft.F_LONGITUDE && aircraft.F_LATITUDE) {
      let source = movementLayer.getSource();
      let features = source.getFeatures();

      var aircraftFeature = source.getFeatureById(aircraft.I_AIRCRAFT_MOVEMENT_ID);
      if (aircraftFeature) {
        aircraftFeature.set('lastCoord', aircraftFeature.getGeometry().getCoordinates());
        aircraftFeature.getGeometry().setCoordinates(fromLonLat([ parseFloat(aircraft.F_LONGITUDE), parseFloat(aircraft.F_LATITUDE)] ));
      } else {
        aircraftFeature = new Feature({
          geometry: new Point(fromLonLat([ parseFloat(aircraft.F_LONGITUDE), parseFloat(aircraft.F_LATITUDE)] )),
          name: aircraft.I_AIRCRAFT_MOVEMENT_ID,
          
        });
        aircraftFeature.setId(aircraft.I_AIRCRAFT_MOVEMENT_ID);
        aircraftFeature.set('trailColour', this.getRandomColor());
        aircraftFeature.set('trailPoints', []);
        aircraftFeature.set('lastCoord', {lat:0, lng:0});
      }
      let trailPoints = aircraftFeature.get('trailPoints');
      trailPoints.push(fromLonLat([ parseFloat(aircraft.F_LONGITUDE), parseFloat(aircraft.F_LATITUDE)] ))

      const coordNow = transform(aircraftFeature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
      const coordPrev = transform(aircraftFeature.get('lastCoord'), 'EPSG:3857', 'EPSG:4326');
      const radians = this.bearing(coordPrev[1], coordPrev[0], coordNow[1], coordNow[0]);
      const operationsType = (aircraft.C_OPERATION_TYPE === 'D' ? 'Departure' : "Arrival");
      const operationsColour = (aircraft.C_OPERATION_TYPE === 'D' ? 'black' : "red");

      if (radians !== 0) {
        var imageStyle = new Style({
          image: new Icon({
            anchor: [0.5, 15],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: flightIcon,
            rotation: radians
          }),
          text: new Text({
            font: '12px Arial',
            fill: new Fill({ color: operationsColour }),
            stroke: new Stroke({
              color: '#fff', 
              width: 1
            }),
            text: `${aircraft.C_AIRCRAFT_TYPE_ID}\n${operationsType}\n${aircraft.F_AIRSPEED}kts\n${aircraft.F_ALTITUDE_FT}ft`,
            fontWeight: "bold",
            offsetX: 25,
            offsetY: -15,
            // outline: '#fff',
            // outlineWidth: 5,
            placement: 'wrap',
            textAlign: 'left'
          })
        });
        
        aircraftFeature.setStyle(imageStyle);
      }

      let trailFeature = this.renderTrail(aircraft, aircraftFeature)

      features.push(trailFeature);
      features.push(aircraftFeature);
      this.state.movementLayer.setSource(
        new VectorSource({
          features: features
        })
      );

      if (currentPosition.lat !== aircraft.F_LATITUDE && currentPosition.lng !== aircraft.F_LONGITUDE) {
        currentPosition.lat = aircraft.F_LATITUDE;
        currentPosition.lng = aircraft.F_LONGITUDE;
        this.setState({
          movementLayer,
          currentPosition
        });

      }
    }
  }

  renderAircraft() {
    var iconFeature = new Feature({
      geometry: new Point(fromLonLat([150.76334399999999, -33.859583999999998])),
      name: 'Null Island',
      id: '1',
      population: 4000,
      rainfall: 500
    });
    iconFeature.setId('666');
    var iconStyle = new Style({
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({color: 'blue'}),
        opacity: 0.5,
        stroke: new Stroke({
          color: 'white', width: 2
        })
      })
    });

    iconFeature.setStyle(iconStyle);

    var vectorSource = new VectorSource({
      features: [iconFeature]
    });
    
    var vectorLayer = new VectorLayer({
      source: vectorSource
    });

    return vectorLayer;
  }

  createLayer() {
    var vectorSource = new VectorSource({
      features: []
    });
    var vectorLayer = new VectorLayer({
      source: vectorSource
    });
    return vectorLayer;
  }

  renderRangeRings(center) {
    const ring = circular([150.76334399999999, -33.859583999999998], 100);
    const polygon = new Polygon([fromLonLat([150.76334399999999, -33.859583999999998]),fromLonLat([151.76334399999999, -33.859583999999998]),fromLonLat([151.76334399999999, -32.859583999999998]),fromLonLat([150.76334399999999, -33.859583999999998])],2);
    const polygon2 = new Polygon([[150.76334399999999, -33.859583999999998],[151.76334399999999, -33.859583999999998],[151.76334399999999, -32.859583999999998],[150.76334399999999, -33.859583999999998]], 'XY');
    const line = new LineString([fromLonLat([150.76334399999999, -33.859583999999998]),fromLonLat([151.76334399999999, -33.859583999999998])]);
    var ringFeature = new Feature({
      geometry: line,
      style: new Style({
        stroke: new Stroke({
          color: 'black', 
          width: 2
        })
      })
    })
    console.log(line,ring, polygon)
    var iconStyle = new Style({
      image: new CircleStyle({
        radius: 5,
        fill: new Fill({color: 'red'}),
        opacity: 0.9,
        stroke: new Stroke({
          color: 'black', width: 2
        })
      })
    });

    var vectorSource = new VectorSource({
      features: [ringFeature]
    });
    
    var vectorLayer = new VectorLayer({
      source: vectorSource
    });

    return vectorLayer;
  }

  renderMonitorMarkers() {
    const monitorFeatures = monitors.map((monitor, index) => {
      var iconFeature =  new Feature({
        geometry: new Point(fromLonLat([monitor.longitude, monitor.latitude])),
      })

      var iconStyle = new Style({
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({color: 'lightgray'}),
          opacity: 0.3,
          stroke: new Stroke({
            color: 'gray', width: 2
          })
        })
      });

      iconFeature.setStyle(iconStyle);
      return iconFeature;
    });

    var vectorSource = new VectorSource({
      features: monitorFeatures
    });
    
    var vectorLayer = new VectorLayer({
      source: vectorSource
    });

    return vectorLayer;
  }

  renderMap() {
    var coord = fromLonLat([150.76334399999999, -33.859583999999998]);

    var monitorLayer = this.renderMonitorMarkers();
    var flightPathLayer = this.renderFlightPath();
    var heatmapLayer = this.renderHeatMap();
    var vectorLayer = this.renderAircraft();
    var movementLayer = this.createLayer();
    var sensorLayer = this.createLayer();
    var rangeRingsLayer = this.renderRangeRings([150.76334399999999, -33.859583999999998]);

    // var clusterLayer = this.renderCluster();

    var map = new Map({
      target: this.refs.mapContainer,
      layers: [
        new TileLayer({
          source: new XYZ({
             url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          })
        }),
        // heatmapLayer,
        // clusterLayer,
        monitorLayer,
        sensorLayer,
        movementLayer,
        rangeRingsLayer
        // monitorLayer,
        // flightPathLayer,
        // vectorLayer
      ],
      controls: [],
      view: new View({
        center: coord,
        zoom: 11
      })
    });

    map.on('click', this.handleMapClick.bind(this));
    // var extent = monitorLayer.getSource().getExtent();
    // map.getView().fit(extent, map.getSize());

    this.setState({ 
      map,
      sensorLayer,
      movementLayer,
    });

  }

  handleMapClick(event) {
    // create WKT writer
    var wktWriter = new WKT();

    // derive map coordinate (references map from Wrapper Component state)
    var clickedCoordinate = this.state.map.getCoordinateFromPixel(event.pixel);

    // create Point geometry from clicked coordinate
    var clickedPointGeom = new Point( clickedCoordinate );

    // write Point geometry to WKT with wktWriter
    var clickedPointWkt = wktWriter.writeGeometry( clickedPointGeom );
  }

  // pass new features from props into the OpenLayers layer object
  componentDidUpdate(prevProps, prevState) {
    const {
      startTime,
      currentTime
    } = this.props.timeslider;

    let sensors = prevProps.sensor;
    for (let i = 0; i < sensors.length; i++) {
      if (i === 5) break;
      this.renderSensor(sensors[i]);
    }

    let aircraftPosition = prevProps.aircraftPosition
    this.renderAircraftMovement(aircraftPosition);
  }

  render() {
    return (
      <div className="p-0 m-0 h-100 w-100" ref="mapContainer"></div>
    );
  }
};

const mapStoreToProps = (store) => {
  return {
    timeslider: store.timeslider,
    layers: store.layers,
    aircraft: store.aircraft
  }
}

export default connect(mapStoreToProps)(MapContainer);
