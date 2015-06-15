/**
 * 
 * @author Алексей
 * @constructor
 */
function MapSubdivisions(mapObjects, mapControl) {
    var self = this, model = P.loadModel(this.constructor.name);
    var subdivisions = [];
    var selectedSubdivison;

    function Subdivision(aSubdivisionData) {
        var subdiv = this;
        subdiv.data = aSubdivisionData;
        subdiv.getDescription = function () {
            return "Подразделение: " + aSubdivisionData.description +
                    "\nАдрес: " + (aSubdivisionData.adress ? aSubdivisionData.adress.adress : '');
        };

        subdiv.getLatLon = function () {
            return aSubdivisionData.adress ? (aSubdivisionData.adress.lat && aSubdivisionData.adress.lon ?
                    [aSubdivisionData.adress.lat, aSubdivisionData.adress.lon] : false) : false;
        };

        subdiv.getIcon = function() {
            return L.icon({iconUrl: 'app/icons/flag.svg'});
        };

        subdiv.show = function () {
            if (subdiv.getLatLon())
                subdiv.marker = new mapObjects.Marker(subdiv);
        };

        subdiv.update = function (aNewSubdivData) {
            subdiv.data = aNewSubdivData;
        };
        
        subdiv.onclick = function () {
            selectedSubdivison = subdiv;
            API.selectSubdivision([subdiv.data]);
        }
        
        subdiv.latlon = subdiv.getLatLon();
        subdiv.show();
    }

    self.updateSubdivisions = function () {
        oc.getPoliceSubdivisions(function (aSubdivisionData) {
            aSubdivisionData.forEach(function (subdivision) {
                var subd = subdivisions.find(function (sd) {
                    return sd.data.id === subdivision.id;
                });
                if (subd) {
                    subd.update(subdivision);
                } else {
                    subdivisions.push(new Subdivision(subdivision));
                }
            });
        }, function (err) {
            console.log('Ошибка получения списка подразделений: ' + err);
        });
    };

    self.updateSubdivisions();
}
