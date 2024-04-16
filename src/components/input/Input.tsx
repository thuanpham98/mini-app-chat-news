import { FC } from "react";
import "./input.css";

export const Input: FC<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
> = (props) => {
  return <input {...props} className={props.className ?? "input"} />;
};
