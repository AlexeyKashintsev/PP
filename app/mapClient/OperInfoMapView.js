/**
 * 
 */
function OperInfoMapView() {
    var self = this
            , model = P.loadModel(this.constructor.name)
            , form = P.loadForm(this.constructor.name, model);
    
    var mapOperInfo;
    var mapObjects = new MapObjects();
    var mapSubdivisions = new MapSubdivisions(mapObjects, self);
    var mapTasks = new MapTasks(mapObjects, self);
    var mapWarrants = new MapWarrants(mapObjects, self);
    mAPI = new ClientAPI({
        tasks: mapTasks,
        subdivisions: mapSubdivisions,
        warrants: mapWarrants
    }, 'ClientMapAPI');
    
    function show(panel) {
        P.require('mapClient/libs/leaflet.js', function () {
            P.require('mapClient/libs/marker-rotate.js');
            P.require('mapClient/libs/geom.js', function () {
                initMap();
                var containerElement = document.getElementById("OperInfoMapView");
                if (containerElement)
                    form.view.showOn(containerElement);
                if (panel)
                    panel.add(form.view, new P.Anchors(2, null, 2, 2, null, 2));
            });
        });
    }
    
    self.show = function (panel) {
        show(panel);
    };

    self.showOnPanel = function (panel) {
        show(panel);
    };

    function initMap() {
        function init(center) {
            var defaultCenter = [55.7522, 37.6155]; // Moscow      
            var tilesLayer = new L.TileLayer(
                    "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                    {
                        subdomains: "abc",
                    }
            );
    
            var zoomControl = L.control.zoom({
                position: 'bottomleft',
                zoomInTitle: "Увеличить",
                zoomOutTitle: "Уменьшить",
            });
            
            var scaleControl = L.control.scale({
                position: 'topleft',
                metric: true,
                imperial : false
            });

            mapOperInfo = new L.Map(form.pnlMap.element,
                    {
                        layers: [
                            tilesLayer
                        ],
                        attributionControl: false,
                        zoomControl: false,
                        boxZoom: true,
                        center: center || defaultCenter,
                        zoom: 13
                    });
            mapOperInfo.addControl(zoomControl);
            mapOperInfo.addControl(scaleControl);
            mapOperInfo.on('popupopen', function (evt) {
                if (evt.popup.view)
                    evt.popup.view.showOn(evt.popup.getContent());
            });
            mapObjects.setMap(mapOperInfo);
        }

        oc.getDownTownCoordinates(
                function (center) {
                    init(center);
                },
                function (e) {
                    P.Logger.severe(e);
                    init();
                });
    }

    form.pnlMap.onComponentResized = function (event) {
        try {
            if (mapOperInfo) {
                mapOperInfo.invalidateSize();
            }
        } catch (e) {
            console.log('Map isn\'t initialized yet');
        }
    };
    form.button.onActionPerformed = function(event) {
        var servReq = new ServReq();
        servReq.show();
    };
}
