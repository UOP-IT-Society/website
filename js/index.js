'use strict';

function populateEvents(events) {
    const eventsContainer = document.querySelector('#events .evnt-sec .row');
    events.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.classList.add('col-md-4', 'col-sm-6', 'col-lg-4');
        eventElement.innerHTML = `
          <div class="evnt-bx2">
            <div class="evnt-thmb">
            </div>
            <div class="evnt-inf">
              <h5 itemprop="headline">${event.title}</h5>
              <p itemprop="description">${event.description}</p>
              <div class="pst-mta-wrp">
                <span class="evnt-dat">
                  <a href="#" title="" itemprop="url">${new Date(event.date).getDate()}<i>${new Date(event.date).toLocaleString('default', {month: 'short'})}</i></a>
                </span>
                <ul class="pst-mta">
                  <li><i class="fas fa-map-marker-alt theme-clr"></i> ${event.location.name}</li>
                  <li><i class="far fa-clock theme-clr"></i> ${event.time}</li>
                </ul>
              </div>
            </div>
          </div>
        `;
        eventsContainer.appendChild(eventElement);
    });
}

function getEvents() {
    return fetch('events.json')
        .then(response => response.json())
        .then(events => {
            return events
        })
        .catch(error => console.error('Error fetching events:', error));
}

async function main() {
    const events = await getEvents();
    populateEvents(events);
}

main()