/**
 * 
 * @author Алексей
 * @constructor
 */ 
function OperControl() {
    var self = this, model = P.loadModel(this.constructor.name);
    
    oc = self;
    
    this.getUser = function (onSuccess, onFailure) {
        var securityWS = new P.ServerModule('SecurityWS');
        securityWS.getUser(onSuccess, onFailure);
    };

    this.getDownTownCoordinates = function (onSuccess, onFailure) {
        var workplaceId = 47233086; // OperationalInformation workplace identifier
        var systemParameterListWS = new P.ServerModule('SystemParameterListWS');
        systemParameterListWS.getWorkPlaceRuntimeParameters(workplaceId,
                function (response) {
                    var params = response.split(';');
                    var center = null;
                    for (var i = 0, length = params.length; i < length && !center; i++) {
                        var paramKeyValuePair = params[i].split('=');
                        if (paramKeyValuePair.length > 1 && paramKeyValuePair[0] === 'CoordinatesDownTown') {
                            var coords = paramKeyValuePair[1].split(",");
                            if (coords.length > 1) {
                                center = [coords[0], coords[1]];
                            }
                        }
                    }
                    onSuccess(center);
                }
        , onFailure);
    };

    this.getTransportStatuses = function (onSuccess, onFailure) {
        var transportStatusWS = new P.ServerModule('TransportStatusWS');
        transportStatusWS.getList(onSuccess, onFailure);
    };

    this.getPoliceTaskExec = function (onSuccess, onFailure) {
        var policeTaskExecWS = new P.ServerModule('PoliceTaskExecWS');
        policeTaskExecWS.getList(onSuccess, onFailure);
    };

    this.getDispositionPlans = function (onSuccess, onFailure) {
        var dispositionPlanWS = new P.ServerModule('DispositionPlanWS');
        dispositionPlanWS.getList(onSuccess, onFailure);
    };

    this.getPolicePosts = function (dispositionPlanId, onSuccess, onFailure) {
        var policePostWS = new P.ServerModule('PolicePostWS');
        policePostWS.getList(dispositionPlanId, onSuccess, onFailure);
    };

    this.getPolicePost = function (policePostId, onSuccess, onFailure) {
        var policePostWS = new P.ServerModule('PolicePostWS');
        policePostWS.getCurrentObject(policePostId, onSuccess, onFailure);
    };

    this.getPoliceTasks = function (onSuccess, onFailure) {
        var policeTaskWS = new P.ServerModule('PoliceTaskWS');
        policeTaskWS.getList(onSuccess, onFailure);
    };

    this.getFilteredPoliceTasks = function (onSuccess, onFailure) {
        var policeTaskWS = new P.ServerModule('PoliceTaskWS');
        policeTaskWS.getList(
                function (tasks) {
                    var filtered = [];
                    var dt = du.incDay(new Date(Date.now()), -1);
                    tasks.forEach(function (task) {
                        if (!(task.exec && task.exec.code === "С" && du.stringToDate(task.createdDateTime) < dt)){
                            task.createdDateTime = du.stringToDate(task.createdDateTime);
                            filtered.push(task);
                        }                            
                    });
                    onSuccess(filtered);
                },
                onFailure);
    };
//    TODO Что-то здесь хрень
    this.getPoliceWarrants = function (onSuccess, onFailure) {
        var policeWarrantUIWS = new P.ServerModule('PoliceWarrantUIWS');
        policeWarrantUIWS.getList(
                function (warrants) {
                    onSuccess(warrants.map(function(warrant){
                        warrant.warrantDate = du.stringToDate(warrant.warrantDate);
                        return warrant;
                    }));
                },
                onFailure);
    };

    this.getPoliceSubdivisions = function (onSuccess, onFailure) {
        var policeSubdivisionWS = new P.ServerModule('PoliceSubdivisionWS');
        policeSubdivisionWS.getList(onSuccess, onFailure);
    };

    this.changePoliceTasksStatus = function (policeTasks, status, onSuccess, onFailure) {
        var expectedCalls = 0;
        var results = {errors: [], count: 0};
        function tryComplete(aError) {
            if (aError)
                results.errors[results.errors.length] = aError;
            results.count++;
            if (results.count === expectedCalls) {
                if (results.errors.length === 0)
                    onSuccess();
                else
                    onFailure(results.errors.join('\n'));
            }
        }

        var policeTaskWS = new P.ServerModule('PoliceTaskWS');
        policeTasks.forEach(function (policeTask) {
            policeTask.createdDateTime = du.dateToString(policeTask.createdDateTime);
            policeTask.exec = status;
            PoliceTaskWS.save(
                    policeTask,
                    function () {
                        tryComplete();
                    },
                    function (e) {
                        tryComplete(e);
                        P.Logger.severe(e);
                    });
        });
        if (expectedCalls === 0)
            onSuccess();
    };

    this.changePoliceWarrantsStatus = function (policeWarrants, status, onSuccess, onFailure) {
        var expectedCalls = 0;
        var results = {errors: [], count: 0};
        function tryComplete(aError) {
            if (aError)
                results.errors[results.errors.length] = aError;
            results.count++;
            if (results.count === expectedCalls) {
                if (results.errors.length === 0)
                    onSuccess();
                else
                    onFailure(results.errors.join('\n'));
            }
        }

        var transportWS = new P.ServerModule('TransportWS');
        policeWarrants.forEach(function (policeWarrant) {
            TransportWS.updateTransportStatusById(
                    policeWarrant.transportId,
                    status.id,
                    function () {
                        tryComplete();
                    },
                    function (e) {
                        tryComplete(e);
                        P.Logger.severe(e);
                    });
        });
        if (expectedCalls === 0)
            onSuccess();
    };

    this.setWarrant = function (warrantId, taskId, dt, onSuccess, onFailure) {
        var policeWarrantWS = new P.ServerModule('PoliceWarrantWS');
        policeWarrantWS.updateWarrantTaskById(
                warrantId,
                taskId,
                dt,
                onSuccess,
                onFailure);
    };
    
    this.removeWarrant = function (warrantId, taskId, dt, onSuccess, onFailure) {
        var policeWarrant2TaskLinkWS = new P.ServerModule('PoliceWarrant2TaskLinkWS');
        policeWarrant2TaskLinkWS.closeWarrant2Task(
                warrantId,
                taskId,
                dt,
                onSuccess,
                onFailure);
    }; 
}
