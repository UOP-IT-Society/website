import { LitElement, html, css } from "lit";
import { property, customElement, query } from "lit/decorators.js";

@customElement("window-dialog")
export class WindowDialog extends LitElement {

    static styles = css`
        dialog {
            border: 3px solid #000000;
            box-shadow: inset -3px -3px #ffffff, inset 3px 3px #808080;
            padding: 0px;
            width: 40vw;
            min-width: 300px;   
        }

        .inner-content {
            margin: 10px;
        }

        .window-titlebar {
            background-color: navy;
            color: white;
            padding: 6px 8px;
            font-size: 18px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
            line-height: 20px;

            * {
                margin: 4px;
            }
        }

        .window-titlebar-button {
            background-color: #c0c0c0;
            border: 2px outset #fff;
            width: 20px;
            height: 20px;
            text-align: center;
            line-height: 16px;
            font-size: 14px;
            cursor: not-allowed;

            color: white;
            display: inline-block;

            user-select: none;
        }

        .window-titlebar-button.clickable {
            cursor: pointer;
        }
    `

    @query("dialog")
    private accessor _dialogElement!: HTMLDialogElement;

    @property()
    accessor windowTitle: string = ""

    private _handleClose() {
        this._dialogElement.close();
        this.dispatchEvent(new CustomEvent("window-dialog-closed", {bubbles: true, composed: true}))
    }

    open() {
        this._dialogElement.showModal();
    }

    close() {
        this._dialogElement.close();
    }

    render() {
        return html`
            <dialog>
                <div class="window-titlebar">
                    <h2>${this.windowTitle}</h2>

                    <div>
                        <div class="window-titlebar-button" role="button">-</div>
                        <div class="window-titlebar-button" role="button">☐</div>
                        <div @click=${this._handleClose} class="window-titlebar-button clickable" role="button">X</div>
                    </div>
                </div>
                
                <div class="inner-content">
                    <div class="dialog-content">
                        <slot></slot>
                    </div>
                </div>
            </dialog>
        `
    }

}