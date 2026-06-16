import { css } from "lit"

export const linkListStyle = css`
::slotted(a) {
  color: black;
  text-decoration: underline;
  margin-right: 6px;
}

::slotted(a:hover) {
  background-color: navy;
  color: white;
  text-decoration: underline;
}
`