P.require(['server/libs/infor.js']);
/**
 * @stateless
 * @author Алексей
 * @constructor
 * @public
 */ 
function PolicePostWS() {
    var iContext = new InvocationContext();
    var serviceName = 'PolicePostWS';
    
    this.getList = function (onSuccess, onFailure) {
        var criteria = {
            beginIndex: 0,
            count: 2147483647,
            loadDeletedItems: 0
        };
        HTTPrequest(serviceName, 'getList', [criteria], onSuccess, onFailure);
    };

    this.getCurrentObject = function (postId, onSuccess, onFailure) {
        HTTPrequest(serviceName, 'getCurrentObject', [postId], onSuccess, onFailure);
    };
}
