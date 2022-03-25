import { FC, useEffect, useState } from "react";
import { ModuleData, App } from "@formant/data-sdk";
import { Light } from "./Light";
import styles from "./Stack.module.scss";
import { Device } from "@formant/data-sdk";
interface IStackLightProps {
  device: undefined | Device;
}

export const StackLight: FC<IStackLightProps> = ({ device }) => {
  const [lights, setLights] = useState({
    red: 0,
    yellow: 0,
    green: 0,
  });

  useEffect(() => {
    App.addModuleDataListener(setData);
  }, [device]);

  const setData = (newValue: ModuleData) => {
    const streams = newValue.streams;
    if (Object.keys(streams).length === 0) {
      throw new Error("No streams.");
    }
    const currentState = lights;
    Object.keys(streams).forEach((stream, idx) => {
      const latestState = getLatestData(streams, stream);
      if (typeof latestState !== "string" && latestState !== undefined) {
        if (streams[stream].data[0].name === "green.light")
          currentState.green = latestState;
        if (streams[stream].data[0].name === "yellow.light")
          currentState.yellow = latestState;
        if (streams[stream].data[0].name === "red.light")
          currentState.red = latestState;
      }
    });
    if (JSON.stringify(lights) !== JSON.stringify(currentState)) {
      setLights(currentState);
    }
  };

  return (
    <div className={styles.stack}>
      <span className={styles["stack-text"]}>Stack Light Status</span>
      <div className={styles["stack-lights"]}>
        <Light status={lights.red} color="red" />
        <Light status={lights.yellow} color="yellow" />
        <Light status={lights.green} color="green" />
      </div>
    </div>
  );
};
const getLatestData = (
  moduleData: {
    [stream_name: string]: Stream;
  },
  stream: string
): number | undefined | string => {
  if (moduleData[stream] === undefined) {
    return "No stream.";
  }
  if (moduleData[stream].loading) {
    return undefined;
  }
  if (moduleData[stream].tooMuchData) {
    return "Too much data.";
  }

  if (moduleData[stream].data.length === 0) {
    return "No data.";
  }
  const latestPoint = moduleData[stream].data[0].points.at(-1);
  if (!latestPoint) {
    return "No datapoints.";
  }
  return latestPoint[1];
};
