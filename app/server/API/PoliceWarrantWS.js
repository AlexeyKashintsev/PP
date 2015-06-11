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
    
    this.getList = function (aWarrantList, onSuccess, onFailure) {
        var criteria = {
            beginIndex: 0,
            count: 2147483647,
            loadDeletedItems: 0,
            activeOnDate: du.dateToString(new Date(Date.now())),
            idList: aWarrantList
        };
        HTTPrequest(serviceName, 'getList', [criteria]
            , function (warrants) {
                onSuccess(warrants.map(function (warrant) {
                    warrant.warrantDate = du.stringToDate(warrant.warrantDate);
                    return warrant;
                }));
            }, onFailure);
    };
    
    this.updateWarrantTaskById = function (warrantId, taskId, dt, onSuccess, onFailure) {
        HTTPrequest(serviceName, 'updateWarrantTaskById', [warrantId, taskId, du.dateToString(dt)], onSuccess, onFailure);
    };
}
