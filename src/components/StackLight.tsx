import { FC, useEffect, useState } from "react";
import { ModuleData, App } from "@formant/data-sdk";
import { Light } from "./Light";
import styles from "./Stack.module.scss";
import { Device } from "@formant/data-sdk";
interface IStackLightProps {
  device: undefined | Device;
}

export const StackLight: FC<IStackLightProps> = ({ device }) => {
  const [redLight, setRedLight] = useState(0);
  const [yellowLight, setYellowLight] = useState(0);
  const [greenLight, setGreenLight] = useState(0);

  const [lights, setLights] = useState({
    red: 0,
    yellow: 0,
    green: 0,
  });

  useEffect(() => {
    App.addModuleDataListener(setData);
  }, [device]);

  const shouldClearData = (
    lastUpdate: number,
    scruttingTime: number,
    seconds: number
  ) => {
    return lastUpdate + seconds * 1000 < scruttingTime;
  };

  const setData = (newValue: ModuleData) => {
    const streams = newValue.streams;
    if (Object.keys(streams).length === 0) {
      throw new Error("No streams.");
    }

    Object.keys(streams).forEach((stream) => {
      const latestState = getLatestData(streams, stream);
      if (typeof latestState !== "string" && latestState !== undefined) {
        if (streams[stream].data[0].name === "green.light") {
          if (shouldClearData(latestState[0], newValue.time, 10)) {
            setGreenLight(0);
            return;
          }
          setGreenLight(latestState[1]);
        }
        if (streams[stream].data[0].name === "yellow.light") {
          if (shouldClearData(latestState[0], newValue.time, 10)) {
            setYellowLight(0);
            return;
          }
          setYellowLight(latestState[1]);
        }
        if (streams[stream].data[0].name === "red.light") {
          if (shouldClearData(latestState[0], newValue.time, 10)) {
            setRedLight(0);
            return;
          }
          setRedLight(latestState[1]);
        }
      }
    });
  };

  return (
    <div className={styles.stack}>
      <span className={styles["stack-text"]}>Stack Light Status</span>
      <div className={styles["stack-lights"]}>
        <Light status={redLight} color="red" />
        <Light status={yellowLight} color="yellow" />
        <Light status={greenLight} color="green" />
      </div>
    </div>
  );
};
const getLatestData = (
  moduleData: any,
  stream: string
): any | undefined | string => {
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
  return latestPoint;
};
