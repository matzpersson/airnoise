import React, { Component } from "react";
import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider";
import { SliderRail, Handle, Track, Tick } from "./core/tools/components/TimeSlider"; // example render components - source below
import { subDays, startOfToday, format } from "date-fns";
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

class TimeSlider extends Component {
  constructor() {
    super();

    const today = startOfToday();
    const fourDaysAgo = subDays(today, 4);
    const oneWeekAgo = subDays(today, 7);

    this.state = {
      selected: fourDaysAgo,
      updated: fourDaysAgo,
      min: oneWeekAgo,
      max: today
    };
  }

  componentDidMount() {
    this.setState({
      min: this.props.startTime,
      max: this.props.endTime,
      selected: this.props.startTime,
      updated: this.props.startTime,
    })
  }

  onChange = ([ms]) => {
    // this.setState({
    //   selected: new Date(ms)
    // });
  };

  onUpdate = ([ms]) => {
    // this.setState({
    //   updated: new Date(ms)
    // });
    // this.props.updateTimeSlider(ms);
  };

  renderDateTime(date, header) {
    return (
      <div
        style={{
          width: "100%",
          textAlign: "center",
          fontFamily: "Arial",
          margin: 5
        }}
      >
        <b>{header}:</b>
        <div style={{ fontSize: 12 }}>{format(date, "dd MMM yyyy - HH:mm ss")}</div>
      </div>
    );
  }

  render() {
    const { selected, updated } = this.state;
    const { startTime, endTime, currentTime} = this.props;

    const min = startTime;
    const max = endTime;
    let value = new Date(currentTime);

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
            values={[+value]}
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

export default TimeSlider;
