import { FC } from "react";
import styles from "./Light.module.scss";

interface ILightsProps {
  color: "red" | "yellow" | "green";
  status?: number;
}

export const Light: FC<ILightsProps> = ({ color, status }) => {
  return (
    <div
      className={`
        ${styles.light} 
        ${styles[`light-${color}`]} 
        ${
          status === 1
            ? styles["light-active"]
            : status === 2
            ? styles.blinking
            : styles.light
        }`}
    ></div>
  );
};
