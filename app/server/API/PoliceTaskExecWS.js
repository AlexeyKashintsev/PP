P.require(['server/libs/infor.js']);
/**
 * @stateless
 * @author Алексей
 * @constructor
 * @public
 */ 
function PoliceTaskExecWS() {
    var self = this;
    var iContext = new InvocationContext();
    var serviceName = 'PoliceTaskExecWS';
    
    this.getList = function (onSuccess, onFailure) {
        var criteria = {
            beginIndex: 0,
            count: 2147483647,
            listSort: [{direction: "ASC", name: "description"}],
            loadDeletedItems: 0
        };
        HTTPrequest(serviceName, 'getList', [criteria], onSuccess, onFailure);
    };
}
