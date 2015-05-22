P.require(['server/libs/infor.js']);
/**
 * @stateless
 * @author Алексей
 * @constructor
 * @public
 */ 
function DispositionPlanWS() {
    var self = this;
    var iContext = new InvocationContext();
    var serviceName = 'DispositionPlanWS';
    self.pageSize = 20;

    this.getList = function (onSuccess, onFailure) {
        var criteria = {
            beginIndex: 0,
            count: self.pageSize,
            loadDeletedItems: 0,
            activeOnDate: du.dateToString(new Date(Date.now()))
        };
        HTTPrequest(serviceName, 'getList', [criteria], onSuccess, onFailure);
    };
}
