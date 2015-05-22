P.require(['server/libs/infor.js']);
/**
 * @stateless
 * @author Алексей
 * @constructor
 * @public
 */ 
function PoliceTaskWS() {
    var iContext = new InvocationContext();
    var serviceName = 'PoliceTaskWS';
    
    this.getList = function (onSuccess, onFailure) {
        var criteria = {
            beginIndex: 0,
            count: 2147483647,
            loadDeletedItems: 0,
            activeOnDate: du.dateToString(new Date(Date.now()))
        };
        HTTPrequest(serviceName, 'getList', [criteria], onSuccess, onFailure);
    };

    this.save = function (policeTask, onSuccess, onFailure) {
        HTTPrequest(serviceName, 'save', [policeTask], onSuccess, onFailure);
    };
}
