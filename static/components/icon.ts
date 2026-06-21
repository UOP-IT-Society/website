import { html, LitElement, css } from "lit";
import { property, customElement } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

// @ts-ignore
import { scannedRegistry } from "virtual:scanned-icons";

@customElement("x-icon")
export class IconElement extends LitElement {
  @property() accessor iconName: string = "it-fireworks";
  @property({ type: Number }) accessor size: number = 24;

  static styles = css`
    :host {
      display: inline-block;
      vertical-align: middle;
      line-height: 0;
    }
    .svg-container svg {
      width: 100%;
      height: 100%;
      display: block;
    }
  `;

  render() {
    const icon = scannedRegistry[this.iconName];

    if (!icon) {
      return html``;
    }

    if (icon.type === "png") {
      return html`
        <img 
          src="${icon.source}" 
          width="${this.size}" 
          height="${this.size}" 
          style="image-rendering: pixelated; display: block;" 
        />`;
    }

    return html`
      <div class="svg-container" style="width: ${this.size}px; height: ${this.size}px;">
        ${unsafeHTML(icon.source)}
      </div>
    `;
  }
}