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
    vertical-align: text-bottom;
    width: var(--size, 1em);
    height: var(--size, 1em);
    line-height: 0;
  }
  svg {
    width: 100%;
    height: 100%;
    display: block;
  }
  `;

  render() {
    this.style.setProperty("--size", `${this.size}px`);

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
        ${unsafeHTML(icon.source)}
    `;
  }
}