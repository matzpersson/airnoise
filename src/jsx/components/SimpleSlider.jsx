import React, { Component } from "react";
import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider";
import { SliderRail, Handle, Track, Tick } from "./core/tools/components/TimeSlider";
import { scaleTime } from "d3-scale";

const sliderStyle = {
  position: "relative",
  width: "100%"
};

function formatTick(ms) {
  return format(new Date(ms), "HH:mm:ss");
}

// time step is once a second
const timeStep = 1000;

class SimpleSlider extends Component {
  constructor() {
    super();

    this.state = {
      selected: 3,
      updated: 2,
      min: 1,
      max: 10
    };
  }

  componentDidMount() {
    this.setState({
      min: 1,
      max: 10,
      selected: 4,
      updated: 4,
    })
  }

  onChange = ([value]) => {
    this.setState({
      selected: value
    });
  };

  onUpdate = ([ms]) => {
    // this.setState({
    //   updated: new Date(ms)
    // });
    // this.props.updateTimeSlider(ms);
  };

  render() {
    const { selected, updated } = this.state;

    const min = 1;
    const max = 10;

    const dateTicks = scaleTime()
      .domain([min, max])
      .ticks(8)
      .map(d => +d);

    return (
      <div className="m-2 p-3">
          <Slider
            mode={1}
            step={timeStep}
            domain={[+min, +max]}
            rootStyle={sliderStyle}
            onUpdate={this.onUpdate}
            onChange={this.onChange}
            values={[+selected]}
          >
            <Rail>
              {({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}
            </Rail>
            <Handles>
              {({ handles, getHandleProps }) => (
                <div>
                  {handles.map(handle => (
                    <Handle
                      key={handle.id}
                      handle={handle}
                      domain={[+min, +max]}
                      getHandleProps={getHandleProps}
                    />
                  ))}
                </div>
              )}
            </Handles>
            <Tracks right={false}>
              {({ tracks, getTrackProps }) => (
                <div>
                  {tracks.map(({ id, source, target }) => (
                    <Track
                      key={id}
                      source={source}
                      target={target}
                      getTrackProps={getTrackProps}
                    />
                  ))}
                </div>
              )}
            </Tracks>
            <Ticks values={dateTicks}>
              {({ ticks }) => (
                <div>
                  {ticks.map(tick => (
                    <Tick
                      key={tick.id}
                      tick={tick}
                      count={ticks.length}
                      format={formatTick}
                    />
                  ))}
                </div>
              )}
            </Ticks>
          </Slider>
      </div>
    );
  }
}

export default SimpleSlider;
