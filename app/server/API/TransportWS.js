P.require(['server/libs/infor.js']);
/**
 * @stateless
 * @author Алексей
 * @constructor
 * @public
 */ 
function TransportWS() {
    var self = this;
    var iContext = new InvocationContext();
    var serviceName = 'TransportWS';

    this.getList = function(onSuccess, onFailure) {
        var criteria = {
            beginIndex: 0,
            count: 200,
            loadDeletedItems: 0,
            activeOnDate: du.dateToString(new Date(Date.now()))
        };
        HTTPrequest(serviceName, 'getList', [criteria], onSuccess, onFailure);
    };
    
    this.updateTransportStatusById = function (transportId, transportStatusId, onSuccess, onFailure) {
        HTTPrequest(serviceName, 'updateWarrantTaskById', [transportId, transportStatusId], onSuccess, onFailure);
    };
}
