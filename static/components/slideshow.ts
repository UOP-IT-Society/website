import { html, css, LitElement } from "lit";
import { property, customElement, state, queryAssignedElements } from "lit/decorators.js";
import { defaultButtonStyle } from "../styles/buttons";
import { defaultImageStyle } from "../styles/image";
import { baseStyles } from "../styles/baseStyles";

interface Slide {
    src: string
    caption: string
}

@customElement("slide-show")
export class SlideshowElement extends LitElement {

    static styles = [css`
    slot {
        display: none;
    }


    #slideshow-container {
    max-width: 500px; 
    margin: 15px auto; 
    }

    #slideshow-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    }
    `, defaultButtonStyle, defaultImageStyle, baseStyles]

    @state()
    private accessor _slides: Slide[] = [{ src: "", caption: "" }];

    @state()
    private accessor _currentSlide = 0;

    @queryAssignedElements()
    private accessor _slottedImages!: Array<HTMLImageElement>;

    firstUpdated() {
        this._onSlotChange();
    }

    private _onSlotChange() {
        console.log(this._slottedImages)

        if (!this._slottedImages) {
            return
        }

        this._slides = this._slottedImages.map((imageElement) => {
            const imageSrc = imageElement.getAttribute("src") ?? "";
            const imageAlt = imageElement.getAttribute("alt") ?? ""
            return {
                src: imageSrc,
                caption: imageAlt
            };
        })
    }

    private _changeSlide(amount: number) {
        console.log(amount)

        if (this._slides.length == 0) {
            return
        }

        if ((this._currentSlide + amount) >= this._slides.length) {
            this._currentSlide = 0
        } else if ((this._currentSlide + amount) < 0) {
            this._currentSlide = this._slides.length - 1;
        } else {
            this._currentSlide += amount
        }
    }

    render() {
        return html`

        <div id="slideshow-container">
            <div class="image-container">
            <img id="slideshow-image" src=${this._slides[this._currentSlide].src} alt="${this._slides[this._currentSlide].caption}">
            </div>
            <div id="slideshow-controls">
            <button @click=${() => { this._changeSlide(-1) }} class="button">&lt; Prev</button>
            <span id="image-counter">Image ${this._currentSlide + 1} / ${this._slides.length}</span>
            <button @click=${() => { this._changeSlide(+1) }} class="button">Next &gt;</button>
            </div>
        </div>
        
        <slot @slotchange=${() => this._onSlotChange()}></slot>
        `
    }


}