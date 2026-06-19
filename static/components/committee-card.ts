import { html, css, LitElement } from "lit";
import { property, customElement } from "lit/decorators.js";
import { linkListStyle } from "../styles/anchors";

@customElement("committee-card")
export class CommitteeCardElement extends LitElement {

    static styles = [css`
  
  .committee-item {
    background-color: #c0c0c0;
    border: 2px outset #fff;
    padding: 8px;
    margin: 4px 0;
    cursor: pointer;
  }
  `, linkListStyle]

    @property()
    accessor name = "Darth Vader";
    @property()
    accessor role = "Sith Lord";
    @property()
    accessor course = "The Force";
    @property()
    accessor pronouns = "he/him";
    @property()
    accessor bio = "Head of the Empire";

    constructor() {
        super()
    }

    render() {
        return html`
<li class="committee-item">
  <strong>${this.name}</strong> - ${this.role}<br>
  ${this.course}<br>
  ${this.pronouns}<br>
  ${this.bio}<br>
  <div class="link-list">
    <slot></slot>
  </div>
</li>`
    }
}