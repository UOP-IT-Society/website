# IT Society Website <!-- omit in toc -->

*This readme mostly serves as notes to future maintainers.*

- [Project notes](#project-notes)
  - [Development](#development)
- [Project structure](#project-structure)
- [Event format](#event-format)


## Project notes

The site is built using Vite.

Some components of the site, e.g. the event calendar and the slideshow on the homepage are built using Typescript and LitJS. Minimal TS features are used. 

In order to add a new page, first create a new folder, then a file titled `index.html` within that folder. See the existing pages mentioned in `vite.config.js` as to how to get Vite to recognise the new page. 

### Development

Make sure you have Node installed.

1. Clone the repository if you haven't already.
2. Install the required packages with `npm install`.
3. Run the site after making changes with `npx vite dev` for development, or `npm run build` followed by `npm run preview` for a production preview. The built site will be available in `/dist` after running `npm run build`.

## Project structure

- `/cfncs/index.html` - Root page for the Coding for Non Coders course.
- `/public/` - Any static files which you want to be accessible under `/`. E.g. `/public/test.jpg` will resolve to `itsociety.co.uk/test.jpg`. Subfolders are also included.
- `static` - Should really be `src` but isn't. Code for styles, scripts, etc. Also contains some pictures.
- `index.html` - the main page served at `itsociety.co.uk`.

## Event format

You can probably infer from the existing events in `eventsTest.json` and `events.json` but just in case, the full schema is below:

```json

[
    {
        "title" : "A Title",
        "date" : "1970-01-01", //yyyy-mm-dd
        "type" : "special",
        "endDate" : "1970-01-02", // Not required
        "location" : "Somewhere over the rainbow",
        "description" : "Turn up and find out"
    }
]

```

- `endDate` is optional, if not included it will be filled in as the given start date, which is required. While it is possible to add times to the dates, this is not recommended as the calendar logic assumes that all events start at midnight.
- `type` can be one of the following: `normal`, `social`, `special`, `holiday`, `exams`. These will be displayed as different colours on the calendar. It is recommended you use `special` for one off events like Hack Pompey, or collabs etc.