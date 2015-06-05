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
        HTTPrequest(serviceName, 'getListWithUrl', [criteria], onSuccess, onFailure, false, true);
    };
}
