/**
 * 
 * @author Алексей
 * @constructor
 */ 
function MapWarrants(mapObjects, mapControl) {
    var self = this, model = P.loadModel(this.constructor.name);
    var signedDevices = {};
    var warrants = {};
    var kinds;
    var selectedWarrant;
    
    var transportWs;
    
    function Warrant(aWarrantData) {
        var warrant = this;
        warrant.selected = false;
        warrant.data = aWarrantData;
        warrant.marker;
        var warrantSvg;
        var posData, latlon, unitSvg;
        
        
        if (warrant.data.deviceId)
            signedDevices[warrant.data.deviceId] = warrant;
        
        warrant.getDescription = function() {
            return    'Вид наряда: ' + warrant.data.postWarrantKind.description
                    + '\nТС: ' + warrant.data.transportRegnum
                    + '\nСтатус: ' + warrant.data.statusTSname
                    + '\nТип наряда: ' + warrant.data.postWarrantKind.description
                    + '\nПодразделение: ' + warrant.data.subdivision.description;
        };
        
        warrant.show = function() {
            if (latlon && kinds)//warrant.data.statusTSColor,
                getSvgIcon('warrant' + warrant.data.id, 'icons/' + kinds[warrant.data.transportKindId].name
                            , {
                                fillColor: warrant.data.postWarrantKind.colorFill,
                                rimColor: warrant.data.postWarrantKind.colorRim,
                                angle: posData.direction
                            }, function (warrantSvg) {
                                         warrant.marker = new mapObjects.Marker(warrant, warrantSvg.icon);
                                    });
        };
        
//        this.getPopup = function() {};
        warrant.updateData = function(aNewWarrantData) {
            warrant.data = aNewWarrantData;
            warrantSvg.updateParams({
                fillColor: warrant.data.postWarrantKind.colorFill,
                rimColor: warrant.data.postWarrantKind.colorRim,
                angle: posData.direction
            });
        };
        
        warrant.updatePosition = function(aPositionData) {
            posData = aPositionData;
            warrant.latlon = [posData.lat, posData.lon];
            if (unitSvg)
                unitSvg.setAngle(posData.direction);
        };
        warrant.onclick = function() {
            selectedWarrant = warrant;
            API.selectTask([warrant.data]);
        };
        
        Object.defineProperty(warrant, "latlon", {
            get: function() {
                return latlon;
            },
            set: function(aLatLon) {
                latlon = aLatLon;
                if (warrant.marker) {
                    warrant.marker.latlon = latlon;
                } else 
                    warrant.show();
            }
        });
    };
    
    self.getSelected = function() {
        
    };
    
    self.setSelected = function(aWarrant) {
        
    };
    
    function createOrUpdateWarrants(warrant) {
        if (!warrants[warrant.id])
            warrants[warrant.id] = new Warrant(warrant);
        else
            warrants[warrant.id].updateData(warrant);
    }
    
    function getDevList() {
        var devList = [];
        for (var j in signedDevices)
            devList.push(j);
        return devList;
    }
    
    function processWSData(aMsg) {
        if (aMsg === 'OK')
            console.log('Подписка прошла успешно!');
        if (aMsg === 'ERROR')
            console.log('Ошибка сокета!');
        if (aMsg.messageType === "ru.infor.websocket.transport.DataPack") {
            aMsg.dataJson.forEach(function(geoData) {
                signedDevices[geoData.deviceId].updatePosition(geoData);
            });
        }
    }
    
    self.updateWarrants = function() {
        oc.getPoliceWarrants(function(warrantsData) {
            warrantsData.forEach(createOrUpdateWarrants);
            
            if (transportWs) {
                transportWs.close();
                transportWs = null;
            }
            
            try {
                P.require(['client/libs/ClientWebSocket.js'], function () {
                    transportWs = getWebSocket('TransportsNotification', getDevList(), processWSData);
                });
            } catch(e) {
                console.log('Error initializing websocket');
            };
        },
        function (e) {
            P.Logger.severe(e);
        });
    };
    
    function getIcons() {
        oc.getTransportKinds(function(aKinds) {
            kinds = {};
            aKinds.forEach(function(kind) {
                kinds[kind.id] = kind;
            });
        }, function() {
            console.log('Ошибка получения списка типов ТС!');
        });
    };
    getIcons();
    
//    var testMsg = '{"msgId":0,"className":"ru.infor.ws.objects.vms.entities.NDData","dataJson":[{"type":{"id":1,"code":"01","description":"по времени","isDeleted":0},"tripIndex":0,"powerValue":0,"de0":0,"de1":0,"de2":0,"de3":0,"de4":0,"de5":0,"de6":0,"de7":0,"direction":17,"alarmDevice":0,"deviceId":48166151,"createdDateTime":"Jun 4, 2015 12:01:39 PM","lat":57.66958999633789,"lon":39.79322814941406,"speed":61,"gpsSatCount":0,"alarm":0}],"sid":"0014dbe30ae5e","serviceName":"NDDataWS","methodName":"sendList","messageType":"ru.infor.websocket.transport.DataPack"}';
    
    self.updateWarrants();
}
