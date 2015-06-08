/**
 * 
 * @author Алексей
 * @constructor
 * @public
 */
function OperControl() {
    var self = this, model = P.loadModel(this.constructor.name);

    oc = self;

    var securityWS = new P.ServerModule('SecurityWS');
    var systemParameterListWS = new P.ServerModule('SystemParameterListWS');
    var policeTaskExecWS = new P.ServerModule('PoliceTaskExecWS');
    var dispositionPlanWS = new P.ServerModule('DispositionPlanWS');
    var policePostWS = new P.ServerModule('PolicePostWS');
    var policeTaskWS = new P.ServerModule('PoliceTaskWS');
    var policeWarrantUIWS = new P.ServerModule('PoliceWarrantUIWS');
    var policeSubdivisionWS = new P.ServerModule('PoliceSubdivisionWS');
    var policeWarrantWS = new P.ServerModule('PoliceWarrantWS');
    var transportWS = new P.ServerModule('TransportWS');
    var policeWarrant2TaskLinkWS = new P.ServerModule('PoliceWarrant2TaskLinkWS');
    var transportKindWS = new P.ServerModule('TransportKindWS');
    var transportStatusWS = new P.ServerModule('TransportStatusWS');
    
    this.test = true;
    
    this.getUser = function (onSuccess, onFailure) {
        securityWS.getUser(onSuccess, onFailure);
    };

    this.getDownTownCoordinates = function (onSuccess, onFailure) {
        var workplaceId = 47233086; // OperationalInformation workplace identifier
        systemParameterListWS.getWorkPlaceRuntimeParameters(workplaceId, onSuccess, onFailure);
    };
    
    var transportKinds;
    this.getTransportKinds = function (onSuccess, onFailure) {
        if (!transportKinds)
            transportKindWS.getList(function(aResult) {
                transportKinds = aResult;
                onSuccess(aResult);
            }, onFailure);
        else
            onSuccess(transportKinds);            
    };
    
    var kindIcons = [];
    this.getKindIcon = function (aKindId, onSuccess, onFailure) {
        if (!kindIcons[aKindId])
            transportKindWS.getIcon(aKindId, function(aResult) {
                kindIcons[aKindId] = aResult;
                onSuccess(aResult);
            }, onFailure);
        else
            onSuccess(kindIcons[aKindId]);            
    };
    
    var transportStatuses;
    this.getTransportStatuses = function (onSuccess, onFailure) {
        if (!transportStatuses)
            transportStatusWS.getList(function(aResult) {
                transportStatuses = aResult;
                onSuccess(aResult);
            }, onFailure);
        else
            onSuccess(transportStatuses);
    };
    
    var policeTaskExec;
    this.getPoliceTaskExec = function (onSuccess, onFailure) {
        if (!policeTaskExec)
            policeTaskExecWS.getList(function(aResult) {
                policeTaskExec = aResult;
                onSuccess(aResult);
            }, onFailure);
        else
            onSuccess(policeTaskExec);
    };
    
    var dispositionPlan;
    this.getDispositionPlans = function (onSuccess, onFailure) {
        if (dispositionPlan)
            onSuccess([dispositionPlan]);
        else
            dispositionPlanWS.getList(function(res) {
                dispositionPlan = res[0];
                onSuccess(res);
            }, onFailure);
    };

    this.getPolicePosts = function (dispositionPlanId, onSuccess, onFailure) {
        if (dispositionPlanId)
            policePostWS.getList(dispositionPlanId, onSuccess, onFailure);
        else {
            this.getDispositionPlans(function(aDispPlans) {
                this.getPolicePosts(aDispPlans.id,  onSuccess, onFailure);
            }, onFailure);
        }
    };

    this.getPolicePost = function (policePostId, onSuccess, onFailure) {
        policePostWS.getCurrentObject(policePostId, onSuccess, onFailure);
    };

    this.getPoliceTasks = function (onSuccess, onFailure) {
        policeTaskWS.getList(onSuccess, onFailure);
    };

    this.getFilteredPoliceTasks = function (onSuccess, onFailure) {
        policeTaskWS.getList(onSuccess, onFailure);
    };
    
    function mergeWarrantsAndSubdivisions() {
        warrants.forEach(function(warrant) {
            if (warrant.policeSubdivisionId)
                subdivisions.forEach(function(subdivision) {
                    if (!subdivision.warrants)
                        subdivision.warrants = [];
                    if (warrant.policeSubdivisionId === subdivision.id) {
                        warrant.subdivision = subdivision;
                        subdivision.warrants.push(warrant);
                    }
                });
        });
    }
    
    var warrants;
    this.getPoliceWarrants = function (onSuccess, onFailure) {
        policeWarrantUIWS.getList(function(aWarrants) {
            warrants = aWarrants;
            if (subdivisions)
                mergeWarrantsAndSubdivisions();
            onSuccess(warrants);
        }, onFailure);
    };
    
    var subdivisions;
    this.getPoliceSubdivisions = function (onSuccess, onFailure) {
        policeSubdivisionWS.getList(function(aSubdivisions) {
            subdivisions = aSubdivisions;
            if (warrants)
                mergeWarrantsAndSubdivisions();
            onSuccess(subdivisions);
        }, onFailure);
    };

    this.changePoliceTasksStatus = function (policeTasks, status, onSuccess, onFailure) {
        policeTaskWS.save(policeTasks, status, onSuccess, onFailure);
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
    
    this.getPoliceWarrant2TaskLinksList = function(aTasksList, aWarrantsList, onSuccess, onFailure) {
        if (!onSuccess && !onFailure && typeof aTasksList === "function") {
                onSuccess = aTasksList;
                aTasksList = [];
                if (aWarrantsList && typeof aWarrantsList === "function")
                    onFailure = aWarrantsList;
                aWarrantsList = [];
            }
        policeWarrant2TaskLinkWS.getList(aTasksList, aWarrantsList, onSuccess, onFailure);
    };
    
    this.setWarrant = function (warrantId, taskId, dt, onSuccess, onFailure) {
        policeWarrantWS.updateWarrantTaskById(
                warrantId,
                taskId,
                dt,
                onSuccess,
                onFailure);
    };

    this.removeWarrant = function (warrantId, taskId, dt, onSuccess, onFailure) {
        policeWarrant2TaskLinkWS.closeWarrant2Task(
                warrantId,
                taskId,
                dt,
                onSuccess,
                onFailure);
    };
    
    this.getTransportList = function (onSuccess, onFailure) {
        transportWS.getList(onSuccess, onFailure);
    }
}
