/**
 * 
 * @author Алексей
 */
function TasksView() {
    var self = this
            , model = P.loadModel(this.constructor.name)
            , form = P.loadForm(this.constructor.name, model);
    
    self.show = function () {
        form.show();
    };
    
    var taskExecStatuses = [];
    function initTaskStatusCombo() {
        operInfoProxy.getPoliceTaskExec(
                function (statuses) {
                    taskExecStatuses = [];
                    statuses.forEach(function (status) {
                        taskExecStatuses.push(status);
                    });

                    form.cmbTaskStatus.displayList = taskExecStatuses;
                    form.cmbTaskStatus.displayField = "description";
                },
                function (e) {
                    P.Logger.severe(e);
                });
    }
    
    var listT = [], viewT = [], incidents = [], listenIdTask = [];
    function initTaskGrid() {
        listT = [];
        viewT = [];
        incidents = [];
        listenIdTask = [];
        operInfoProxy.getFilteredPoliceTasks(
                function (tasks) {
                    tasks.forEach(function (task) {
                        operInfoMapView.API.newTask(task);
                        listT.push(task);
                        listenIdTask.push(task.id);
                        if (!incidents[task.incident.id])
                            incidents[task.incident.id] = task.incident;
                    });
                    form.grdTasks.data = listT;
                    form.grdTasks.colCreateDate.field = "createdDateTime";
                    form.grdTasks.colTaskType.field = "type.description";
                    form.grdTasks.colIncident.field = "incident.description";
                    form.grdTasks.colStatus.field = "exec.description";
                },
                function (e) {
                    P.Logger.severe(e);
                });
    }
    
    self.getSelected = function() {
        return form.grdTasks.selected;
    };
}
