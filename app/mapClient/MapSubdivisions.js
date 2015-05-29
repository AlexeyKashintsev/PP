/**
 * 
 * @author Алексей
 * @constructor
 */ 
function MapSubdivisions(mapObjects, mapControl) {
    var self = this, model = P.loadModel(this.constructor.name);
    
    function Subdivision(aSubdivisionData) {
        this.getDescription = function() {
            return "Подразделение: " + aSubdivisionData.description +
                   "\nАдрес: " + (aSubdivisionData.adress ? aSubdivisionData.adress.adress : '');
        };

        this.getLatLon = function() {
            return aSubdivisionData.adress ? (aSubdivisionData.adress.lat && aSubdivisionData.adress.lon ? 
                [aSubdivisionData.adress.lat, aSubdivisionData.adress.lon] : false) : false;
        };

        this.getIcon = function() {
            return L.icon({iconUrl: 'app/icons/asterisk-yellow.png'});
        };

        this.show = function() {
            if (this.getLatLon())
                this.marker = new mapObjects.Marker(this);
        };

        this.show();
    };
}
