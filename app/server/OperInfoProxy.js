P.require(["server/libs/http.js", "server/libs/dateUtils.js"]);
/**
 * 
 * @author Алексей
 * @constructor
 */ 
function OperInfoProxy_1() {
    var self = this, model = P.loadModel(this.constructor.name);
    
    function InvocationContext() {
        this.clientIPAddress = '192.169.1.49';
        this.initiator = 'oper-info-front-end';
        this.userName = 'admin';
        this.password = '9v3/5IyQjesPTDvTbAMucg==';
    }

    // Тест
    var inforUrl = 'http://infor.trans-monitor.ru:9393/vms-ws/rest/';
    var iv = new InvocationContext();

    function HTTPrequest(aService, aMethod, aParams, onSuccess, onFailure, aCustomInvocationContext) {
        var URL = inforUrl + aService + '/' + aMethod;
        var params = aCustomInvocationContext ? [aCustomInvocationContext].concat(aParams) : [iv].concat(aParams);
        P.Logger.info(aService + '/' + aMethod + ' request: ' + JSON.stringify(params));
        Http.post(URL, JSON.stringify(params),
                    function (aResponse) {
                        P.Logger.info(aService + '/' + aMethod + ' answer: ' + aResponse);
                        var loaded = JSON.parse(aResponse);
                        if (aMethod === 'getList') 
                            loaded = loaded && loaded.objList ? loaded.objList : [];
                        onSuccess(loaded);
                    },
                    function (e) {
                        if (onFailure)
                            onFailure(e);
                        else
                            P.Logger.severe(e);
                    });
    };

    self.SecurityWS = new function() {
        var iContext = new InvocationContext();
        var serviceName = 'SecurityWS';

        this.getUser = function (onSuccess, onFailure) {
            HTTPrequest(serviceName, 'getUser', [], onSuccess, onFailure);
        };
    }();

    self.SystemParameterListWS = function() {
        var iContext = new InvocationContext();
        var serviceName = 'SystemParameterListWS';

        this.getWorkPlaceRuntimeParameters = function (workplaceId, onSuccess, onFailure) {
            HTTPrequest(serviceName, 'getWorkPlaceRuntimeParameters', [workplaceId], onSuccess, onFailure);
        };
    }();

    self.TransportStatusWS = function() {
        var iContext = new InvocationContext();
        var serviceName = 'TransportStatusWS';

        this.getList = function (onSuccess, onFailure) {
            var criteria = {
                beginIndex: 0,
                count: 2147483647,
                listSort: [{direction: "ASC", name: "description"}],
                loadDeletedItems: 0
            };
            HTTPrequest(serviceName, 'getList', [criteria], onSuccess, onFailure);
        };
    }();

    self.PoliceTaskExecWS = function() {
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
    }();

    self.DispositionPlanWS = function() {
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
    }();

    self.PolicePostWS = function() {
        var iContext = new InvocationContext();
        var serviceName = 'PolicePostWS';

        this.getList = function (dispositionPlanId, onSuccess, onFailure) {
            var criteria = {
                beginIndex: 0,
                count: 2147483647,
                loadDeletedItems: 0,
                planIdList: [dispositionPlanId]
            };
            HTTPrequest(serviceName, 'getList', [criteria], onSuccess, onFailure);
        };

        this.getCurrentObject = function (postId, onSuccess, onFailure) {
            HTTPrequest(serviceName, 'getCurrentObject', [postId], onSuccess, onFailure);
        };
    }();

    self.PoliceTaskWS = function() {
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
    }();

    self.PoliceWarrantUIWS = function() {
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
    }();

    self.PoliceWarrantWS = function() {
        var iContext = new InvocationContext();
        var serviceName = 'PoliceWarrantWS';

        this.updateWarrantTaskById = function (warrantId, taskId, dt, onSuccess, onFailure) {
            HTTPrequest(serviceName, 'updateWarrantTaskById', [warrantId, taskId, du.dateToString(dt)], onSuccess, onFailure);
        };
    }();


    self.PoliceSubdivisionWS = function() {
        var iContext = new InvocationContext();
        var serviceName = 'PoliceSubdivisionWS';

        this.getList = function (onSuccess, onFailure) {
            var criteria = {
                beginIndex: 0,
                count: 2147483647,
                loadDeletedItems: 0
            };
            HTTPrequest(serviceName, 'getList', [criteria], onSuccess, onFailure);
        };
    }();

    self.TransportWS = function() {
        var iContext = new InvocationContext();
        var serviceName = 'TransportWS';

        this.updateTransportStatusById = function (transportId, transportStatusId, onSuccess, onFailure) {
            HTTPrequest(serviceName, 'updateWarrantTaskById', [transportId, transportStatusId], onSuccess, onFailure);
        };
    }();

    self.PoliceWarrant2TaskLinkWS = function() {
        var iContext = new InvocationContext();
        var serviceName = 'PoliceWarrant2TaskLinkWS';

        this.closeWarrant2Task = function (warrantId, taskId, dt, onSuccess, onFailure) {
            HTTPrequest(serviceName, 'closeWarrant2Task', [ warrantId, taskId, du.dateToString(dt)], onSuccess, onFailure);
        };   
    }();
}
