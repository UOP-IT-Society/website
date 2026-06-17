import { css } from "lit";
import { baseStyles } from "./baseStyles";

export const defaultButtonStyle = [baseStyles, css`button {
  background-color: #c0c0c0;
  border: 3px outset #fff;
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 15px;

  font-family: "win-95-font";
}`]