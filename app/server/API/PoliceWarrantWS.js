P.require(['server/libs/infor.js']);
/**
 * @stateless
 * @author Алексей
 * @constructor
 * @public
 */ 
function PoliceWarrantWS() {
    var iContext = new InvocationContext();
    var serviceName = 'PoliceWarrantWS';
    
    this.updateWarrantTaskById = function (warrantId, taskId, dt, onSuccess, onFailure) {
        HTTPrequest(serviceName, 'updateWarrantTaskById', [warrantId, taskId, du.dateToString(dt)], onSuccess, onFailure);
    };
}
