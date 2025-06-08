fetch('events.json')
  .then(res => res.json())
  .then(events => {
    const container = document.getElementById('events-container');
    container.innerHTML = ''; // Clear "Loading..." text

    if (events.length === 0) {
      container.innerHTML = '<p>No events announced yet!</p>';
      return;
    }

    const list = document.createElement('ul');
    list.style.listStyle = 'square';

    events.forEach(event => {
      const item = document.createElement('li');
      item.innerHTML = `<strong>${event.title}</strong> - ${event.date} @ ${event.location}<br><em>${event.description}</em>`;
      list.appendChild(item);
    });

    container.appendChild(list);
  })
  .catch(err => {
    document.getElementById('events-container').innerHTML = `<p>Couldn't load events. Try again later.</p>`;
    console.error('Error loading events:', err);
  });
