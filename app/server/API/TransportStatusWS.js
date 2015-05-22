P.require(['server/libs/infor.js']);
/**
 * @stateless
 * @author Алексей
 * @constructor
 * @public
 */ 
function TransportStatusWS() {
    var iContext = new InvocationContext();
    var serviceName = 'TransportStatusWS';
    
    this.getList = function (onSuccess, onFailure) {
        var criteria = {
            beginIndex: 0,
            count: 2147483647,
            listSort: [{direction: "ASC", name: "description"}],
            loadDeletedItems: 0
        };
        HTTPrequest(serviceName, 'getList', [criteria], onSuccess, onFailure);
    };
}
