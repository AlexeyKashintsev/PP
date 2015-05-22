/**
 * 
 */
function OperInfoMapView() {
    var self = this
            , model = P.loadModel(this.constructor.name)
            , form = P.loadForm(this.constructor.name, model);

//    var oc = new P.ServerModule("OperInfoProxy");
//    mapOperInfo = {};
    var mapObjects = new MapObjects();
    self.API = mapObjects.getAPI();
    self.setAPI = mapObjects.setAPI;
    
    function show(panel) {
        P.require('mapClient/libs/leaflet.js', function () {
            // geom.js depends on leaflet.js
            P.require('mapClient/libs/geom.js', function () {
                initMap();
                if (panel)
                    panel.add(form.view, new P.Anchors(2, null, 2, 2, null, 2));
            });
        });
    }
    
    self.show = function () {
        show();
    };

    // TODO : place your code here

    model.requery(function () {
        // TODO : place your code here
    });

    this.showOnPanel = function (panel) {
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
            self.mapOperInfo = mapOperInfo;
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
        if (mapOperInfo) {
            mapOperInfo.invalidateSize();
        }
    };
    form.button.onActionPerformed = function(event) {
        var servReq = new ServReq();
        servReq.show();
    };
}
