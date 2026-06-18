import { html, LitElement, css } from "lit";
import { property, customElement, query, state } from "lit/decorators.js";
import { classMap } from 'lit/directives/class-map.js';
import { WindowDialog } from "./window-dialog";
import { defaultButtonStyle } from "../styles/buttons";

const minNumCalendarCells = 35;
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

enum EventType {
    Normal = <any>"normal",
    Social = <any>"social",
    Special = <any>"special", /* E.g. hack pompey */
    Holiday = <any>"holiday", /* Consolidation week etc. */
    Exams = <any>"exams"
}

const EventPrecedence: Record<EventType, number> = {
    [EventType.Normal]: 5,
    [EventType.Social]: 4,
    [EventType.Special]: 3,
    [EventType.Holiday]: 2,
    [EventType.Exams]: 1,
};

interface CalendarEvent {
    title: string,
    type: EventType,
    location: string,
    description: string,
    date: Date,
    endDate: Date,
}

interface CalendarDayData {
    date: Date,
    wraparound: boolean,
    passed: boolean, /* This day has already happened, but not a wraparound */
    events: CalendarEvent[]
}

@customElement("event-calendar-day")
export class CalendarDayElement extends LitElement {

    static styles = css`
        p, strong {
            margin: 4px;
        }

        :host([wraparound]) {
            background-color: #c0c0c0;
            cursor: not-allowed;
        }

        :host([passed]) {
            background-color: #e7e7e7;
        }

        div {
            width: 100%;
            height: 100%;
        }

        :host {
            height: 4rem;
            font-size: 14px;
        }

        .current-date {
            background-color: #ff8b8b;
        }

        .normal-event {
            border-top: solid #02a2fa 3px;
            strong { cursor: pointer; }
        }

        .social-event {
            border-top: solid #ff3300 3px;
            strong { cursor: pointer; }
        }

        .special-event {
            border-top: solid #65cc33 3px;
            strong { cursor: pointer; }
        }

        .holiday-event {
            border-top: solid #fecb00 3px;
            strong { cursor: pointer; }
        }

        .exams-event {
            border-top: solid #aa007f 3px;
            strong { cursor: pointer; }
        }


    `

    @property({ attribute: false, type: Object })
    accessor date: Date = new Date();

    @property({ type: Boolean })
    accessor wraparound: boolean = false;

    @property({ type: Boolean })
    accessor passed: boolean = false;

    @property({ attribute: false, type: Array })
    accessor eventData: CalendarEvent[] = [];

    private _handleEventClick(e: MouseEvent, eventItem: CalendarEvent[]) {
        e.stopPropagation();

        this.dispatchEvent(new CustomEvent("calendar-event-clicked", {
            detail: eventItem,
            bubbles: true,
            composed: true
        }));
    }

    render() {

        let today = new Date()
        today.setHours(0, 0, 0, 0);

        const numEvents = this.eventData.length;

        this.eventData.sort((a, b) => EventPrecedence[b.type] - EventPrecedence[a.type])

        const classes = {
            "current-date": today.getTime() === this.date.getTime(),
            "normal-event": numEvents == 0 ? false : this.eventData[0].type == EventType.Normal,
            "social-event": numEvents == 0 ? false : this.eventData[0].type == EventType.Social,
            "special-event": numEvents == 0 ? false : this.eventData[0].type == EventType.Special,
            "holiday-event": numEvents == 0 ? false : this.eventData[0].type == EventType.Holiday,
            "exams-event": numEvents == 0 ? false : this.eventData[0].type == EventType.Exams,
        }

        return html`
            <div class="${classMap(classes)}">
            <p id="day">${this.date.getDate()}</p>

            ${this.eventData.length > 0 ? html`<strong @click=${(ev: MouseEvent) => this._handleEventClick(ev, this.eventData)}>${this.eventData[0].title}</strong> ${this.eventData.length > 1 ? html`+ ${this.eventData.length - 1}` : "" }` : ""}

            </div>`
    }
}

@customElement("event-calendar")
export class CalendarElement extends LitElement {

    static styles = [css`
        #calendar-container {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
        }

        .header-row-day {
            background-color: #c0c0c0;
            text-align: center;
        }

        #calendar-topbar {
            display: flex;
            justify-content: space-between;
            align-items: center;

            margin-bottom: 10px;
        }
    `, defaultButtonStyle]

    private _numCalendarCells = minNumCalendarCells;
    
    private _currentDate = new Date();
    
    @state()
    private accessor _offsetDate: Date = new Date(this._currentDate);

    private _firstDay = new Date(this._currentDate.getFullYear(), this._currentDate.getMonth(), 1);
    private _lastDay = new Date(this._currentDate.getFullYear(), this._currentDate.getMonth() + 1, 0);
    private _allDays: CalendarDayData[] = []

    @state()
    private accessor _selectedEvents: CalendarEvent[] = [];

    @property()
    accessor src = "events.json";

    @query("window-dialog")
    private accessor _dialogElement!: WindowDialog;

    private async _loadEventsSrc() {

        try {

            const response = await fetch(this.src);
            if (!response.ok) {
                throw new Error("Unable to fetch events.")
            }

            const rawEvents: any[] = await response.json()

            const parsedEvents: CalendarEvent[] = rawEvents.map((e) => ({
                title: e.title,
                type: e.type,
                location: e.location,
                description: e.description,
                date: new Date(e.date),
                endDate: e.endDate ? new Date(e.endDate) : new Date(e.date)
            }))

            // Apply the parsed dates to allDays

            this._allDays.forEach(day => {

                parsedEvents.forEach(event => {

                    const eventStartTime = new Date(event.date);
                    eventStartTime.setHours(0, 0, 0, 0);
                    const eventEndTime = new Date(event.endDate);
                    eventEndTime.setHours(0, 0, 0, 0);

                    if (day.date <= eventEndTime && day.date >= eventStartTime) {
                        day.events = [...day.events, event]
                    }

                });

            });

            this.requestUpdate();
        } catch (error) {
            console.error("Event init failed", error)
        }

    }

    private _handleCalendarEventClicked(e: CustomEvent<CalendarEvent[]>) {
        this._selectedEvents = e.detail;
        this._dialogElement.open();
    }

    private _closeCalendarEventDialog() {
        this._selectedEvents = [];
    }

    private _handleClickPreviousMonth() {
        let newDate = new Date(this._offsetDate)
        newDate.setMonth(this._offsetDate.getMonth() - 1);
        this._offsetDate = newDate;
    }

    private _handleClickNextMonth() {
        let newDate = new Date(this._offsetDate)
        newDate.setMonth(this._offsetDate.getMonth() + 1);
        this._offsetDate = newDate;
    }

    private _recalculateCalendar() {

        this._numCalendarCells = minNumCalendarCells;
        this._firstDay = new Date(this._offsetDate.getFullYear(), this._offsetDate.getMonth(), 1);
        this._lastDay = new Date(this._offsetDate.getFullYear(), this._offsetDate.getMonth() + 1, 0);
        this._allDays = [];
        
        const firstDayOfWeek = this._firstDay.getDay();
        const todayNormalised = new Date(this._currentDate);
        todayNormalised.setHours(0, 0, 0, 0);

        let precedingDays: number;
        if (firstDayOfWeek == 0) {
            precedingDays = 0
        } else {
            precedingDays = firstDayOfWeek
        }

        for (let i = precedingDays - 1; i >= 0; i--) {
            this._allDays.push({
                date: new Date(
                    this._firstDay.getFullYear(),
                    this._firstDay.getMonth(),
                    -i
                ), wraparound: true,
                passed: false,
                events: []
            })
        }

        // Do the days actually in the month.
        let loopCurrentDate = this._firstDay;
        while (loopCurrentDate <= this._lastDay) {

            this._allDays.push({ date: loopCurrentDate, wraparound: false, passed: loopCurrentDate < todayNormalised, events: [] })
            loopCurrentDate = new Date(loopCurrentDate)
            loopCurrentDate.setDate(loopCurrentDate.getDate() + 1)

        }

        // Remaining days, if any
        if (this._allDays.length != this._numCalendarCells) {

            if (this._allDays.length > this._numCalendarCells) {
                this._numCalendarCells = 42
            }

            let extraDays = this._numCalendarCells - this._allDays.length;
            loopCurrentDate = this._allDays[this._allDays.length - 1].date

            for (let i = 0; i < extraDays; i++) {

                loopCurrentDate = new Date(loopCurrentDate)
                loopCurrentDate.setDate(loopCurrentDate.getDate() + 1)
                this._allDays.push({ date: loopCurrentDate, wraparound: true, passed: false, events: [] })

            }

        }

        this._loadEventsSrc();
    }

    constructor() {
        super()
        this._recalculateCalendar()
    }   
    
    protected willUpdate(_changedProperties: any): void {
        console.log(":)")

        if (_changedProperties.has("_offsetDate")) {
            this._recalculateCalendar();
            console.log(":)")
            this.requestUpdate();
        }
    }

    render() {

        console.log(this._allDays)

        return html`
        <div id="calendar-topbar">
            <button title="Previous month" @click=${this._handleClickPreviousMonth}>&lt; Prev</button>

            <h3>${monthNames[this._offsetDate.getMonth()]} ${this._offsetDate.getFullYear()}</h3>

            <button title="Next month" @click=${this._handleClickNextMonth}>Next &gt;</button>
        </div>

        <div id="calendar-container" @calendar-event-clicked=${this._handleCalendarEventClicked}>
            ${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => html`<strong class="header-row-day">${d}</strong>`)}
            <!-- This line sometimes has an error, about the type of eventData, ignore it, it doesn't mean anything, there is no fix -->
            ${this._allDays.map((d) => html`<event-calendar-day .date=${d.date} ?wraparound=${d.wraparound} ?passed=${d.passed} .eventData=${d.events as CalendarEvent[]}></event-calendar-day>`)}
        </div>

        <window-dialog windowTitle=${this._selectedEvents.length > 1 ? "Events" : "Event"} @window-dialog-closed=${this._closeCalendarEventDialog}>
            ${this._selectedEvents.length > 0 ? this._selectedEvents.map((e) =>  html`
            <h2>${e.title}</h2>
            <p>${e.date.toLocaleDateString("en-GB")} ${e.date.getTime() != e.endDate.getTime() ? html`- ${e.endDate.toLocaleDateString("en-GB")}` : ""}</p>
            <p><strong>Location: </strong> ${e.location}</p>
            <p><strong>Description: </strong> ${e.description}</p>
            `) : ""}
        </window-dialog>
        `
    }

}