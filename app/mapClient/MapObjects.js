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
                    var params = {
                        icon: aObj.getIcon(),
                        title: aObj.getDescription()
                    };
                    marker = L.marker(aObj.getLatLon(), params);
                }
                if (aObj.onclick) {
                    marker.on('click', aObj.onclick);
                }
                
                if (aObj.getPopup)
                    marker.bindPopup(aObj.getPopup());
                
                marker.addTo(map);
            }
        };
        
        var marker;
        markers.push(this);
        this.addToMap();        
    };
    
    function Route() {};
    function Polygon() {};
    
    function centerMap(cObj) {
        if (typeof cObj == 'array') {
            
        } else {
            map.setView(cObj.getLatLon(), 9);
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

    var operObjects = new (function() {
        var warrants = [], tasks = [], subdivisions = [];
        
        function Warrant(aWarrantData) {

        };

        function Task(aTaskData) {
            this.getDescription = function() {
                return "Тип: " + (aTaskData.type.description ? aTaskData.type.description : "Не задан") + "\n" +
                       "Проишествие: " + (aTaskData.incident.description ? aTaskData.incident.description : "Нет данных") + "\n" +
                       "Статус: " + (aTaskData.exec.description ? aTaskData.exec.description : "Нет данных") + "\n" +
                       "Время создания: " + (aTaskData.startAt ? aTaskData.startAt : "Не задано");                       
            };
            
            this.getLatLon = function() {
                return aTaskData.lat && aTaskData.lon ? [aTaskData.lat, aTaskData.lon] : false;
            };
            
            this.getIcon = function() {
                return L.icon({iconUrl: 'app/icons/warning.png'});
            };
            
            this.show = function() {
                if (this.getLatLon())
                    this.marker = new Marker(this);
            }.bind(this);
            
            this.getPopup = function() {
                var div = document.createElement("div");
                var taskPopup = new TaskMapSticker(aTaskData);
                taskPopup.showOn(div);
                return div;
            };
            
            this.onclick = function() {
                if (API) {
                    API.selectTask(aTaskData);
                }
            };
            
            this.select = function(doShowTooltip) {
                
            }.bind(this);;
            
            this.show();
        };

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
                    this.marker = new Marker(this);
            };
            
            this.show();
        };
        
        this.newTask = function(aTaskData) {
            tasks[aTaskData.id] = new Task(aTaskData);
        };
        
        this.newSubdivision = function(aSubdivisionData) {
            subdivisions[aSubdivisionData.id] = new Subdivision(aSubdivisionData);
        };
        
        this.select = new function() {
            this.task = function(aTask) {
                if (typeof aTask === 'object') {
                    
                } else {
                    tasks[aTask].select();
                }
            };
        };
    })();
    
    self.getAPI = function() {
        return operObjects;
    };
    
    try {
        inApp.test();
    } catch (e) {
        new AppConnector();
    }
    inApp.mapObjAPI = operObjects;
}
