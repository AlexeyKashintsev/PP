P.require(['server/libs/infor.js']);
/**
 * @stateless
 * @author Алексей
 * @constructor
 * @public
 */ 
function TransportWS() {
    var iContext = new InvocationContext();
    var serviceName = 'TransportWS';

    this.updateTransportStatusById = function (transportId, transportStatusId, onSuccess, onFailure) {
        HTTPrequest(serviceName, 'updateWarrantTaskById', [transportId, transportStatusId], onSuccess, onFailure);
    };
}
