/**
 * 
 * @author Алексей
 * @constructor
 */ 
function MapObjects() {
    var self = this;
    var map;
    var markers = [];
    
    function Marker(aObj) {
        this.addToMap = function() {
            if (map) {
                if (!marker) {
                    marker = L.marker(aObj.getLatLon());
                 }
                marker.addTo(map);
            }
        };
        
        var marker;
        markers.push(this);
        this.addToMap();        
    };
    
    function Route() {};
    function Polygon() {};
    
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
    

    var operObjects = new (function() {
        var warrants = [], tasks = [], subdivisions = [];
        
        function Warrant(aWarrantData) {

        };

        function Task(aTaskData) {
            this.getDescription = function() {
                return aTaskData.type.description + "\n"
                        + aTaskData.exec.description + "\n"
                        + aTaskData.exec.incident;
            };
            
            this.getLatLon = function() {
                return aTaskData.lat && aTaskData.lon ? [aTaskData.lat, aTaskData.lon] : false;
            };
            
            this.show = function() {
                if (this.getLatLon())
                    this.marker = new Marker(this);
            };
            
            this.show();
        };

        function Subdivision(aSubdivisionData) {

        };
        
        this.newTask = function(aTaskData) {
            console.log('new Task ' + aTaskData);
            tasks[aTaskData.id] = new Task(aTaskData);
        };
    })();
    
    self.getAPI = function() {
        return operObjects;
    };
}
