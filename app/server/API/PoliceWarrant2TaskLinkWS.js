P.require(['server/libs/infor.js']);
/**
 * @stateless
 * @author Алексей
 * @constructor
 * @public
 */ 
function PoliceWarrant2TaskLinkWS() {
    var iContext = new InvocationContext();
    var serviceName = 'PoliceWarrant2TaskLinkWS';
    
    this.closeWarrant2Task = function (warrantId, taskId, dt, onSuccess, onFailure) {
        HTTPrequest(serviceName, 'closeWarrant2Task', [ warrantId, taskId, du.dateToString(dt)], onSuccess, onFailure);
    };   
}