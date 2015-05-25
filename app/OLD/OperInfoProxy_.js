P.require(['server/libs/infor_.js', 'server/libs/geo.js']);

/**
 * @stateless
 * @public 
 * @constructor
 */
function OperInfoProxy_____OLD() {
    var self = this, model = P.loadModel(this.constructor.name);

    this.getUser = function (onSuccess, onFailure) {
        var securityWS = new SecurityWS();
        securityWS.getUser(onSuccess, onFailure);
    };

    this.getDownTownCoordinates = function (onSuccess, onFailure) {
        var workplaceId = 47233086; // OperationalInformation workplace identifier
        var systemParameterListWS = new SystemParameterListWS();
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
        var transportStatusWS = new TransportStatusWS();
        transportStatusWS.getList(onSuccess, onFailure);
    };

    this.getPoliceTaskExec = function (onSuccess, onFailure) {
        var policeTaskExecWS = new PoliceTaskExecWS();
        policeTaskExecWS.getList(onSuccess, onFailure);
    };

    this.getDispositionPlans = function (onSuccess, onFailure) {
        var dispositionPlanWS = new DispositionPlanWS();
        dispositionPlanWS.getList(onSuccess, onFailure);
    };

    this.getPolicePosts = function (dispositionPlanId, onSuccess, onFailure) {
        var policePostWS = new PolicePostWS();
        policePostWS.getList(dispositionPlanId, onSuccess, onFailure);
    };

    this.getPolicePost = function (policePostId, onSuccess, onFailure) {
        var policePostWS = new PolicePostWS();
        policePostWS.getCurrentObject(policePostId, onSuccess, onFailure);
    };

    this.getPoliceTasks = function (onSuccess, onFailure) {
        var policeTaskWS = new PoliceTaskWS();
        policeTaskWS.getList(onSuccess, onFailure);
    };

    this.getFilteredPoliceTasks = function (onSuccess, onFailure) {
        var policeTaskWS = new PoliceTaskWS();
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
        var policeWarrantUIWS = new PoliceWarrantUIWS();
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
        var policeSubdivisionWS = new PoliceSubdivisionWS();
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

        var policeTaskWS = new PoliceTaskWS();
        policeTasks.forEach(function (policeTask) {
            policeTask.createdDateTime = du.dateToString(policeTask.createdDateTime);
            policeTask.exec = status;
            policeTaskWS.save(
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

        var transportWS = new TransportWS();
        policeWarrants.forEach(function (policeWarrant) {
            transportWS.updateTransportStatusById(
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
        var policeWarrantWS = new PoliceWarrantWS();
        policeWarrantWS.updateWarrantTaskById(
                warrantId,
                taskId,
                dt,
                onSuccess,
                onFailure);
    };
    
    this.removeWarrant = function (warrantId, taskId, dt, onSuccess, onFailure) {
        var policeWarrant2TaskLinkWS = new PoliceWarrant2TaskLinkWS();
        policeWarrant2TaskLinkWS.closeWarrant2Task(
                warrantId,
                taskId,
                dt,
                onSuccess,
                onFailure);
    };   
}
