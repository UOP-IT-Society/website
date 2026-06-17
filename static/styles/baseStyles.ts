import { css } from "lit";

export const baseStyles = css`
@font-face {
  font-family: 'win-95-font';
  src: url('./W95FA.otf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

:root {
    font-family: 'win-95-font', 'Segoe UI', Tahoma, sans-serif;
    font-size: 16px;
}
`