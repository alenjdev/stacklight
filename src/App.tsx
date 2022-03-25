import "./App.scss";
import { StackLight } from "./components/StackLight";
import { Device, Authentication, Fleet } from "@formant/data-sdk";
import { useEffect, useState } from "react";

export const App = () => {
  const [device, setDevice] = useState<Device | undefined>();

  useEffect(() => {
    getCurrentDevice();
  }, []);

  const getCurrentDevice = async () => {
    if (await Authentication.waitTilAuthenticated()) {
      const currentDevice = await Fleet.getCurrentDevice();
      setDevice(currentDevice);
    }
  };

  return (
    <div className="App">
      <StackLight device={device} />
    </div>
  );
};

export default App;
