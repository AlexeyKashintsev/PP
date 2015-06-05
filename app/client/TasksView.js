P.require(['client/libs/DecToHex.js']);
/**
 * 
 * @author Алексей
 */
function TasksView() {
    var self = this
            , model = P.loadModel(this.constructor.name)
            , form = P.loadForm(this.constructor.name, model);
    
    self.show = function (panel) {
        panel ? panel.add(form.view, new P.Anchors(2, null, 2, 2, null, 2)) : form.show();
        initTaskGrid();
    };
    
    var listT = [], viewT = [], incidents = [], listenIdTask = {};
    function initTaskGrid() {
        listT = [];
        viewT = [];
        incidents = [];
        listenIdTask = {};
        oc.getFilteredPoliceTasks(
                function (tasks) {
                    tasks.forEach(function (task) {
                        listT.push(task);
                        listenIdTask[task.id] = listT.length - 1;
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
    
    form.grdTasks.onRender = function(event) {
        try {
            if (!event.source.field)//' === incident.description')
                event.cell.background = new P.Color(getHexColor(event.object.incident.color));
            else
                event.cell.background = new P.Color(getHexColor(event.object.exec.color));
        } catch (e) {
            console.log('Ошибка применения цвета ' + e);
        }
    };
    
    form.grdTasks.onMouseClicked = function(event) {
        cAPI.selectTask();
    };

    
    self.getSelected = function() {
        return form.grdTasks.selected;
    };
    
    self.setSelected = function(aTasks) {
        form.grdTasks.clearSelection();
        aTasks.forEach(function(taskId) {
            var taskData = listT[listenIdTask[taskId]];
            if (taskData)
                form.grdTasks.makeVisible(taskData, true);
        });
    };
    
    self.updateTasks = function() {
        initTaskGrid();
    };
}
