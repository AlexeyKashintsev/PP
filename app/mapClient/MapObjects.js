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
    
    self.Marker = function (aObj, anIcon) {
        var marker;
        var m = this;
        this.addToMap = function() {
            if (map) {
                if (!marker) {
                    var icon = anIcon ? anIcon : (aObj.getIcon ? aObj.getIcon() : new L.icon({iconUrl: 'app/icons/magnifier.png'}));
                    var params = {
                        icon: icon,
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
                m.setIconAngle = marker.setIconAngle;
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
        
        this.destroy = function() {
            map.removeLayer(marker);
            delete m;
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
