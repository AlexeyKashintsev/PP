/**
 * 
 * @author Алексей
 * @constructor
 */ 
function MapWarrants(mapObjects, mapControl) {
    var self = this, model = P.loadModel(this.constructor.name);
    var signedDevices = {};
    var warrants = {};
    
    
    function Warrant(aWarrantData) {
        this.selected = false;
        var needToShow = false;
        var latlon;
        
        this.getDescription = function() {};
        this.getLatLon = function() {};
        this.getIcon = function() {};
        this.show = function() {
            if (latlon)
                this.marker = new mapObjects.Marker(this);
            else
                needToShow = true;
        };
        this.getPopup = function() {};
        this.updateData = function(aNewWarrantData) {};
        this.onclick = function() {};
        
        Object.defineProperty(this, "latlon", {
            get: function() {
                return latlon;
            }.bind(this),
            set: function(aLatLon) {
                latlon = aLatLon;
                if (this.marker) {
                    this.marker.latlon = latlon;
                } else 
                    if (needToShow)
                        this.show();
            }.bind(this)
        });
    };
    
    self.getSelected = function() {
        
    };
    
    self.setSelected = function(aWarrant) {
        
    };
    
    function createOrUpdateWarrants(warrant) {
        if (!warrants[warrant.id])
            warrants[warrant.id] = new Warrant(warrant)
        else
            warrants[warrant.id].updateData(warrant);
    }
    
    self.updateWarrants = function() {
        oc.getPoliceWarrants(function(warrantsData) {
            warrantsData.forEach(createOrUpdateWarrants);
        },
        function (e) {
            P.Logger.severe(e);
        });
    };
    
//    self.updateWarrants();
}
