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
    
    this.getList = function(aTasksList, aWarrantsList, onSuccess, onFailure) {
        var criteria = {
            beginIndex: 0,
            count: 2147483647,
            loadDeletedItems: 0,
            activeOnDate: du.dateToString(new Date(Date.now())),
            taskIdList: aTasksList,
            warrantIdList: aWarrantsList
        };
        HTTPrequest(serviceName, 'getList', [criteria], onSuccess, onFailure);
    };
    
    this.closeWarrant2Task = function (warrantId, taskId, dt, onSuccess, onFailure) {
        HTTPrequest(serviceName, 'closeWarrant2Task', [ warrantId, taskId, du.dateToString(dt)], onSuccess, onFailure);
    };   
}