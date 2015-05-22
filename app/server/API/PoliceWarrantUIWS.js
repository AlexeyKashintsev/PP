P.require(['server/libs/infor.js']);
/**
 * @stateless
 * @author Алексей
 * @constructor
 * @public
 */ 
function PoliceWarrantUIWS() {
    var iContext = new InvocationContext();
    var serviceName = 'PoliceWarrantUIWS';
    
    this.getList = function (onSuccess, onFailure) {
        var criteria = {
            beginIndex: 0,
            count: 2147483647,
            loadDeletedItems: 0,
            activeOnDate: du.dateToString(new Date(Date.now()))
        };
        HTTPrequest(serviceName, 'getList', [criteria], onSuccess, onFailure);
    };
}
