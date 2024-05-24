mapboxgl.accessToken = "pk.eyJ1IjoibmlyYWo1NzAiLCJhIjoiY2xzMDJlaDdkMXFicTJrbzZxZW9oeWF5dyJ9.jwnf6Zcnmuf_kqHf5uJ72Q";
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: coordinates, // starting position [lng, lat]
    zoom: 10, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());
new mapboxgl.Marker()
  .setLngLat(coordinates)
  .setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(
        `<h3>${title}</h3><p>${address}</p>`
    )
  )
  .addTo(map)