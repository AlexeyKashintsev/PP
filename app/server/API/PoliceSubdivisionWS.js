P.require(['server/libs/infor.js']);
/**
 * @stateless
 * @author Алексей
 * @constructor
 * @public
 */ 
function PoliceSubdivisionWS() {
    var iContext = new InvocationContext();
    var serviceName = 'PoliceSubdivisionWS';
    
    this.getList = function (onSuccess, onFailure) {
        var criteria = {
            beginIndex: 0,
            count: 2147483647,
            loadDeletedItems: 0
        };
        HTTPrequest(serviceName, 'getList', [criteria], onSuccess, onFailure);
    };
}
