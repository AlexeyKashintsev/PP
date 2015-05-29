P.require(['client/libs/DecToHex.js']);
/**
 * 
 * @author Алексей
 * @constructor
 */ 
function MapObjects() {
    var self = this;
    var map;
    var markers = [];
    try {
        oc.test;
    } catch(e) {
        new OperControl();
    }
    
    self.Marker = function (aObj) {
        var marker;
        this.addToMap = function() {
            if (map) {
                if (!marker) {
                    var params = {
                        icon: aObj.getIcon(),
                        title: aObj.getDescription()
                    };
                    marker = L.marker(aObj.latlon, params);
                }
                if (aObj.onclick) {
                    marker.on('click', aObj.onclick);
                }
                
                
                if (aObj.getPopup)
                    aObj.getPopup().bind(marker);
                
                marker.addTo(map);
            }
        };
        
        Object.defineProperty(this, "latlon", {
            get: function() {
                return marker ? marker.getLatLng() : null;
            },
            set: function(aLatLon) {
                if (marker)
                    marker.setLatLng(aLatLon);
            }
        });
        
        this.center = function() {
            centerMap(aObj);
        };
        
        markers.push(this);
        this.addToMap();        
    };
    
    function Route() {};
    function Polygon() {};
    
    function centerMap(mapObj) {
        if (typeof mapObj == 'array') {
            
        } else {
            map.setView(mapObj.getLatLon());
        }
    }
    
    self.setMap = function(aMap) {
        if (!map) {
            map = aMap;
        } else {
            //TODO Очистить и пересоздать все и вся
        };
        markers.forEach(function(marker) {
            marker.addToMap();
        });
    };
}
