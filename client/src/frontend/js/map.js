import { getAtmPositions } from './getData.js';

const mapLoader = document.getElementById('map-loader');

export default async function createMap(data) {
  mapLoader.style.display = 'block';

  const response = await getAtmPositions(data.slug);

  mapLoader.style.display = 'none';

  ymaps.ready(function () {
    var myMap = new ymaps.Map('map', {
      center: [59.938, 30.3],
      zoom: 9,
      controls: ['smallMapDefaultSet'],
    });

    for (let position of response.payload) {
      myMap.geoObjects.add(new ymaps.Placemark([position.lat, position.lon]));
    }
  });
}
