P.require(['server/libs/infor.js']);
/**
 * @stateless
 * @author Алексей
 * @constructor
 * @public
 */ 
function SecurityWS() {
    var iContext = new InvocationContext();
    var serviceName = 'SecurityWS';
    
    this.getUser = function (onSuccess, onFailure) {
        HTTPrequest(serviceName, 'getUser', [], onSuccess, onFailure);
    };
}
