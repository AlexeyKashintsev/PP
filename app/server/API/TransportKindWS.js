P.require(['server/libs/infor.js']);
/**
 * @stateless
 * @public
 * @author Алексей
 * @constructor
 */ 
function TransportKindWS() {
    var iContext = new InvocationContext();
    var serviceName = 'TransportKindWS';
    
    this.getList = function (onSuccess, onFailure) {
        var criteria = {
            beginIndex: 0,
            count: 2147483647,
            loadDeletedItems: 0
        };
        HTTPrequest(serviceName, 'getList', [criteria], onSuccess, onFailure, false, true);
    };
    
    this.getListWithURL = function (onSuccess, onFailure) {
        var criteria = {
            beginIndex: 0,
            count: 2147483647,
            loadDeletedItems: 0
        };
        HTTPrequest(serviceName, 'getListWithUrl', [criteria], onSuccess, onFailure, false, true);
    };
    
    this.getIcon = function (aTransportKind, onSuccess, onFailure) {
        this.getListWithURL(function(aList) {
            aList.forEach(function(LI) {
                if (LI.id == aTransportKind) {
                    P.Logger.info('Loading image ' + LI.name);
                    P.Resource.load(LI.name, function(aRes) {
                        P.Logger.info('Loaded: ' + aRes);
                        onSuccess(JSON.stringify(aRes));
                    }, function(aRes) {
                        P.Logger.info('Error: ' + aRes);
                        onFailure(aRes);
                    });
                }
            });
//            P.Resource.load(aList[aTransportKind].name, onSuccess, onFailure);
        }, onFailure);
    };
}
