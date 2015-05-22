P.require(["server/libs/http.js", "server/libs/dateUtils.js"]);

function InvocationContext() {
    this.clientIPAddress = '192.169.1.49';
    this.initiator = 'oper-info-front-end';
    this.userName = 'admin';
    this.password = '9v3/5IyQjesPTDvTbAMucg==';
}

// Тест
var inforUrl = 'http://infor.trans-monitor.ru:9393/vms-ws/rest/';

function SecurityWS() {
    var iContext = new InvocationContext();

    this.getUser = function (onSuccess, onFailure) {
        Http.post(inforUrl + 'SecurityWS/getUser', JSON.stringify([iContext]), function (aResponse) {
            var loaded = JSON.parse(aResponse);
            onSuccess(loaded);
        }, function (e) {
            if (onFailure)
                onFailure(e);
            else
                P.Logger.severe(e);
        });
    };
}

function SystemParameterListWS() {
    var iContext = new InvocationContext();

    this.getWorkPlaceRuntimeParameters = function (workplaceId, onSuccess, onFailure) {
        Http.post(inforUrl + 'SystemParameterListWS/getWorkPlaceRuntimeParameters', JSON.stringify([iContext, workplaceId]),
                function (aResponse) {
                    var loaded = JSON.parse(aResponse);
                    //onSuccess(loaded && loaded.objList ? loaded.objList : []);
                    onSuccess(loaded);
                    //onSuccess(aResponse);
                },
                function (e) {
                    if (onFailure)
                        onFailure(e);
                    else
                        P.Logger.severe(e);
                });
    };
}

function TransportStatusWS() {
    var iContext = new InvocationContext();

    this.getList = function (onSuccess, onFailure) {
        var criteria = {
            beginIndex: 0,
            count: 2147483647,
            listSort: [{direction: "ASC", name: "description"}],
            loadDeletedItems: 0
        };
        Http.post(inforUrl + 'TransportStatusWS/getList', JSON.stringify([iContext, criteria]), function (aResponse) {
            var loaded = JSON.parse(aResponse);
            onSuccess(loaded && loaded.objList ? loaded.objList : []);
        }, function (e) {
            if (onFailure)
                onFailure(e);
            else
                P.Logger.severe(e);
        });
    };
}

function PoliceTaskExecWS() {
    var iContext = new InvocationContext();

    this.getList = function (onSuccess, onFailure) {
        var criteria = {
            beginIndex: 0,
            count: 2147483647,
            listSort: [{direction: "ASC", name: "description"}],
            loadDeletedItems: 0
        };
        Http.post(inforUrl + 'PoliceTaskExecWS/getList', JSON.stringify([iContext, criteria]), function (aResponse) {
            var loaded = JSON.parse(aResponse);
            onSuccess(loaded && loaded.objList ? loaded.objList : []);
        }, function (e) {
            if (onFailure)
                onFailure(e);
            else
                P.Logger.severe(e);
        });
    };
}

function DispositionPlanWS() {
    var self = this;
    var iContext = new InvocationContext();
    self.pageSize = 20;

    this.getList = function (onSuccess, onFailure) {
        var criteria = {
            beginIndex: 0,
            count: self.pageSize,
            loadDeletedItems: 0,
            activeOnDate: du.dateToString(new Date(Date.now()))
        };
        Http.post(inforUrl + 'DispositionPlanWS/getList', JSON.stringify([iContext, criteria]), function (aResponse) {
            var loaded = JSON.parse(aResponse);
            onSuccess(loaded && loaded.objList ? loaded.objList : []);
        }, function (e) {
            if (onFailure)
                onFailure(e);
            else
                P.Logger.severe(e);
        });
    };
}

function PolicePostWS() {
    var iContext = new InvocationContext();

    this.getList = function (dispositionPlanId, onSuccess, onFailure) {
        var criteria = {
            beginIndex: 0,
            count: 2147483647,
            loadDeletedItems: 0,
            planIdList: [dispositionPlanId]
        };
        Http.post(inforUrl + 'PolicePostWS/getList', JSON.stringify([iContext, criteria]), function (aResponse) {
            var loaded = JSON.parse(aResponse);
            onSuccess(loaded && loaded.objList ? loaded.objList : []);
        }, function (e) {
            if (onFailure)
                onFailure(e);
            else
                P.Logger.severe(e);
        });
    };

    this.getCurrentObject = function (postId, onSuccess, onFailure) {
        Http.post(inforUrl + 'PolicePostWS/getCurrentObject', JSON.stringify([iContext, postId]), function (aResponse) {
            var loaded = JSON.parse(aResponse);
            onSuccess(loaded);
        }, function (e) {
            if (onFailure)
                onFailure(e);
            else
                P.Logger.severe(e);
        });
    };
}

function PoliceTaskWS() {
    var iContext = new InvocationContext();

    this.getList = function (onSuccess, onFailure) {
        var criteria = {
            beginIndex: 0,
            count: 2147483647,
            loadDeletedItems: 0,
            activeOnDate: du.dateToString(new Date(Date.now()))
        };
        Http.post(inforUrl + 'PoliceTaskWS/getList', JSON.stringify([iContext, criteria]), function (aResponse) {
            var loaded = JSON.parse(aResponse);
            onSuccess(loaded && loaded.objList ? loaded.objList : []);
        }, function (e) {
            if (onFailure)
                onFailure(e);
            else
                P.Logger.severe(e);
        });
    };

    this.save = function (policeTask, onSuccess, onFailure) {
        //P.Logger.info('PoliceTaskWS/save request: ' + JSON.stringify([iContext, policeTask]));
        Http.post(inforUrl + 'PoliceTaskWS/save', JSON.stringify([iContext, policeTask]), function (aResponse) {
            //P.Logger.info('PoliceTaskWS/save response: ' + aResponse);
            var saved = JSON.parse(aResponse);
            onSuccess(saved);
        }, function (e) {
            if (onFailure)
                onFailure(e);
            else
                P.Logger.severe(e);
        });
    };
}

function PoliceWarrantUIWS() {
    var iContext = new InvocationContext();

    this.getList = function (onSuccess, onFailure) {
        var criteria = {
            beginIndex: 0,
            count: 2147483647,
            loadDeletedItems: 0,
            activeOnDate: du.dateToString(new Date(Date.now()))
        };
        Http.post(inforUrl + 'PoliceWarrantUIWS/getList', JSON.stringify([iContext, criteria]), function (aResponse) {
            var loaded = JSON.parse(aResponse);
            onSuccess(loaded && loaded.objList ? loaded.objList : []);
        }, function (e) {
            if (onFailure)
                onFailure(e);
            else
                P.Logger.severe(e);
        });
    };
}

function PoliceWarrantWS() {
    var iContext = new InvocationContext();

    this.updateWarrantTaskById = function (warrantId, taskId, dt, onSuccess, onFailure) {
        Http.post(inforUrl + 'PoliceWarrantWS/updateWarrantTaskById',
                JSON.stringify([iContext, warrantId, taskId, du.dateToString(dt)]), function (aResponse) {
            var loaded = JSON.parse(aResponse);
            onSuccess(loaded);
        }, function (e) {
            if (onFailure)
                onFailure(e);
            else
                P.Logger.severe(e);
        });
    };
}


function PoliceSubdivisionWS() {
    var iContext = new InvocationContext();

    this.getList = function (onSuccess, onFailure) {
        var criteria = {
            beginIndex: 0,
            count: 2147483647,
            loadDeletedItems: 0
        };
        Http.post(inforUrl + 'PoliceSubdivisionWS/getList', JSON.stringify([iContext, criteria]), function (aResponse) {
            var loaded = JSON.parse(aResponse);
            onSuccess(loaded && loaded.objList ? loaded.objList : []);
        }, function (e) {
            if (onFailure)
                onFailure(e);
            else
                P.Logger.severe(e);
        });
    };
}

function TransportWS() {
    var iContext = new InvocationContext();

    this.updateTransportStatusById = function (transportId, transportStatusId, onSuccess, onFailure) {
        Http.post(inforUrl + 'TransportWS/updateTransportStatusById',
                JSON.stringify([iContext, transportId, transportStatusId]),
                function (aResponse) {
                    var loaded = JSON.parse(aResponse);
                    onSuccess(loaded && loaded.objList ? loaded.objList : []);
                },
                function (e) {
                    if (onFailure)
                        onFailure(e);
                    else
                        P.Logger.severe(e);
                });
    };
}

function PoliceWarrant2TaskLinkWS() {
    var iContext = new InvocationContext();
    
    this.closeWarrant2Task = function (warrantId, taskId, dt, onSuccess, onFailure) {
        Http.post(inforUrl + 'PoliceWarrant2TaskLinkWS/closeWarrant2Task',
                JSON.stringify([iContext, warrantId, taskId, du.dateToString(dt)]), function (aResponse) {
            var loaded = JSON.parse(aResponse);
            onSuccess(loaded);
        }, function (e) {
            if (onFailure)
                onFailure(e);
            else
                P.Logger.severe(e);
        });
    };   
}
