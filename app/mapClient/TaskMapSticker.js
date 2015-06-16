/**
 * 
 * @author Алексей
 */
function TaskMapSticker(aTaskData, aContainer) {
    var self = this
            , model = P.loadModel(this.constructor.name)
            , form = P.loadForm(this.constructor.name, model);
    
    self.show = function () {
        form.show();
    };
    
    self.showOn = function(aContainer) {
        form.view.showOn(aContainer);
    };
    
    self.bind = function (aMarker) {
        var div = document.createElement('div');
        div.style.position = 'relative';
        div.style.width = form.view.width + 'px'; 
        div.style.height = form.view.height + 'px'; 
        var popup = L.popup({maxWidth: 500});
        popup.setContent(div);        
        popup.view = form.view;
        aMarker.bindPopup(popup);
    };
    
    var taskExecStatuses = [];
    function initTaskStatusCombo() {
        oc.getPoliceTaskExec(
                function (statuses) {
                    taskExecStatuses = [];
                    statuses.forEach(function (status) {
                        taskExecStatuses.push(status);
                    });

                    form.cmbTaskStatus.displayList = taskExecStatuses;
                    form.cmbTaskStatus.displayField = "description";
                    
                    if (taskData !== {}) 
                        form.cmbTaskStatus.value = findSatusById(taskData.exec.id);
                },
                function (e) {
                    P.Logger.severe(e);
                });
    }
    
    function findSatusById(aSatusId) {
        var res = null;
        taskExecStatuses.forEach(function(status) {
            if (status.id === aSatusId)
                res = status;
        });
        return res;
    }
    
    var taskData = {};
    self.setTask = function(aTaskData) {
        taskData = aTaskData;
        form.mfType.data = taskData.type;
        form.mfincident.data = taskData.incident;
        form.mfincident.field = form.mfType.field = "description";
        form.mdCreationTime.data = taskData;
        form.mdCreationTime.field = "startAt";
        form.cmbTaskStatus.value = findSatusById(taskData.exec.id);
        //form.cmbTaskStatus.field = "selectedStatus";
        initTaskStatusCombo();
    };
    
    if (aTaskData)
        self.setTask(aTaskData);
    if (aContainer)
        self.showOn(aContainer);
    
    form.btnApplyStatus.onActionPerformed = function(event) {
        oc.changePoliceTasksStatus([aTaskData], form.cmbTaskStatus.value, function() {
            console.log('ok!');
        }, function() {
            console.log('failure!');
        });
    };
}
