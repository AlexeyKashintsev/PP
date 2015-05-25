P.require(['server/libs/infor.js']);
/**
 * @stateless
 * @author Алексей
 * @constructor
 * @public
 */ 
function PoliceTaskWS() {
    var iContext = new InvocationContext();
    var serviceName = 'PoliceTaskWS';
    
    this.getList = function (onSuccess, onFailure) {
        var criteria = {
            beginIndex: 0,
            count: 2147483647,
            loadDeletedItems: 0,
            activeOnDate: du.dateToString(new Date(Date.now()))
        };
        HTTPrequest(serviceName, 'getList', [criteria]
            , function (tasks) {
                    var filtered = [];
                    var dt = du.incDay(new Date(Date.now()), -1);
                    tasks.forEach(function (task) {
                        if (!(task.exec && task.exec.code === "С" && du.stringToDate(task.createdDateTime) < dt)) {
                            task.createdDateTime = du.stringToDate(task.createdDateTime);
                            filtered.push(task);
                        }
                    });
                    onSuccess(filtered);
                }, onFailure);
    };
    //TODO Check
    this.save = function (policeTasks, onSuccess, onFailure) {
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

        policeTasks.forEach(function (policeTask, status) {
            policeTask.createdDateTime = du.dateToString(policeTask.createdDateTime);
            policeTask.exec = status;
            HTTPrequest(serviceName, 'save', [policeTask], tryComplete, function (e) {
                        tryComplete(e);
                        P.Logger.severe(e);
                    });
        });
        if (expectedCalls === 0)
            onSuccess();
    };
}
