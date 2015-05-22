P.require(['server/libs/infor.js']);
/**
 * @stateless
 * @author Алексей
 * @constructor
 * @public
 */ 
function SystemParameterListWS() {
    var iContext = new InvocationContext();
    var serviceName = 'SystemParameterListWS';
    
    this.getWorkPlaceRuntimeParameters = function (workplaceId, onSuccess, onFailure) {
        HTTPrequest(serviceName, 'getWorkPlaceRuntimeParameters', [workplaceId], onSuccess, onFailure);
    };
}
