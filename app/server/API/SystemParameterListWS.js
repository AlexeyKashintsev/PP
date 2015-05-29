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
        HTTPrequest(serviceName, 'getWorkPlaceRuntimeParameters', [workplaceId], function(response) {
            var params = response.split(';');
                    var center = null;
                    for (var i = 0, length = params.length; i < length && !center; i++) {
                        var paramKeyValuePair = params[i].split('=');
                        if (paramKeyValuePair.length > 1 && paramKeyValuePair[0] === 'CoordinatesDownTown') {
                            var coords = paramKeyValuePair[1].split(",");
                            if (coords.length > 1) {
                                center = [coords[0], coords[1]];
                            }
                        }
                    }
            onSuccess(center);
        }, onFailure);
    };
}
