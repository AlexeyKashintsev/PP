/**
 * 
 */
function OperInfoMapView() {
    var self = this
            , model = P.loadModel(this.constructor.name)
            , form = P.loadForm(this.constructor.name, model);

    var operInfoProxy = new P.ServerModule("OperInfoProxy");
    var mapOperInfo;

    self.show = function () {
        P.require('client/libs/leaflet.js', function () {
            // geom.js depends on leaflet.js
            P.require('client/libs/geom.js', function () {
                initMap();
            });
        });
    };

    // TODO : place your code here

    model.requery(function () {
        // TODO : place your code here
    });

    this.showOnPanel = function (panel) {
        if (panel) {
            P.require('client/libs/leaflet.js', function () {
                // geom.js depends on leaflet.js
                P.require('client/libs/geom.js', function () {
                    initMap();
                    panel.add(form.view, new P.Anchors(2, null, 2, 2, null, 2));
                });
            });
        }
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
            self.mapOperInfo = mapOperInfo;
        }

        operInfoProxy.getDownTownCoordinates(
                function (center) {
                    init(center);
                },
                function (e) {
                    P.Logger.severe(e);
                    init();
                });
    }

    form.pnlMap.onComponentResized = function (event) {
        if (mapOperInfo) {
            mapOperInfo.invalidateSize();
        }
    };
}
