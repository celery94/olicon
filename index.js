import Feature from 'ol/Feature.js';
import Map from 'ol/Map.js';
import Overlay from 'ol/Overlay.js';
import View from 'ol/View.js';
import Point from 'ol/geom/Point.js';
import {
    Tile as TileLayer,
    Vector as VectorLayer
} from 'ol/layer.js';
import TileJSON from 'ol/source/TileJSON.js';
import VectorSource from 'ol/source/Vector.js';
import {
    Icon,
    Style
} from 'ol/style.js';
import OSM from 'ol/source/OSM';

var iconFeature = new Feature({
    geometry: new Point([0, 0]),
    name: 'Null Island',
});

var iconFeature1 = new Feature({
    geometry: new Point([1000000, 1000000]),
    name: 'Null Island',
});

var iconStyle = new Style({
    image: new Icon(({
        anchor: [0.5, 0.5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: 'data/icon.jpg'
    }))
});

iconFeature.setStyle(iconStyle);
iconFeature1.setStyle(iconStyle);

var vectorSource = new VectorSource({
    features: [iconFeature, iconFeature1]
});

var vectorLayer = new VectorLayer({
    source: vectorSource
});

var rasterLayer = new TileLayer({
    source: new OSM()
});

var map = new Map({
    layers: [rasterLayer, vectorLayer],
    target: document.getElementById('map'),
    view: new View({
        center: [0, 0],
        zoom: 3
    })
});

var element = document.getElementById('popup');

var popup = new Overlay({
    element: element,
    positioning: 'bottom-center',
    stopEvent: false,
    offset: [0, -50]
});
map.addOverlay(popup);

// display popup on click
map.on('click', function (evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel,
        function (feature) {
            return feature;
        });
    if (feature) {
        var coordinates = feature.getGeometry().getCoordinates();
        popup.setPosition(coordinates);
        $(element).popover({
            placement: 'top',
            html: true,
            content: feature.get('name')
        });
        $(element).popover('show');
    } else {
        $(element).popover('destroy');
    }
});

// change mouse cursor when over marker
map.on('pointermove', function (e) {
    if (e.dragging) {
        $(element).popover('destroy');
        return;
    }
    var pixel = map.getEventPixel(e.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);
    map.getTarget().style.cursor = hit ? 'pointer' : '';
});