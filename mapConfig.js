var bounds = new L.LatLngBounds(new L.LatLng(-85, -200), new L.LatLng(85, 250));
var map = L.map('map', {
    attributionControl: false,
    maxBounds: bounds,
    maxBoundsViscosity: 0.4,
}).setView([49.2827, -123.1207], 13);
// disable double click to zoom
map.doubleClickZoom.disable();
map.options.minZoom = 3;
// NOTE: do not use stamen without API key for production
L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg', { // replace path with link to tile server...
}).addTo(map);
