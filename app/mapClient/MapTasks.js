/**
 * 
 * @author Алексей
 * @constructor
 * @public
 */ 
function MapTasks(mapObjects, mapControl) {
    var self = this, model = P.loadModel(this.constructor.name);
    var tasks = [];
    var selectedTask;
    
    function Task(aTaskData) {
        var task = this;
        var taskSvg;
        task.data = aTaskData;
        task.selected = false;
        task.getDescription = function() {
            return "Тип: " + (task.data.type.description ? task.data.type.description : "Не задан") + "\n" +
                   "Проишествие: " + (task.data.incident.description ? task.data.incident.description : "Нет данных") + "\n" +
                   "Статус: " + (task.data.exec.description ? task.data.exec.description : "Нет данных") + "\n" +
                   "Время создания: " + (task.data.startAt ? task.data.startAt : "Не задано");                       
        };

        task.getLatLon = function() {
            return task.data.lat && task.data.lon ? [task.data.lat, task.data.lon] : false;
        };

        task.getIcon = function() {
//            return L.icon({iconUrl: 'app/icons/warning.png'});
        };

        task.show = function() {
            if (!getSvgIcon) {
                if (!svgShow)
                    svgShow = [];
                svgShow.push(task.show);
            }
                
            if (task.latlon && getSvgIcon)
                getSvgIcon('task' + task.data.id, 'icons/star8.svg'
                            , {
                                fillColor: task.data.exec.color,
                                rimColor: task.data.incident.color
                            }, function (taskSvg) {
                    task.marker = new mapObjects.Marker(task, taskSvg.icon);
                });
        };

        task.getPopup = function() {
            return new TaskMapSticker(task.data);
        };

        task.onclick = function() {
            selectedTask = task;
            mAPI.selectTask([task.data]);
        };
        
        task.getTaskData = function() {
            return task.data;
        };
        
        task.getTaskId = function() {
            return task.data.id;
        };
        
        task.updateData = function(aNewTaskData) {
            task.data = aNewTaskData;
        };
        
        task.select = function(doShowTooltip) {
            task.marker.center();
            selectedTask = task;
        };
        
        Object.defineProperty(task, "latlon", {
            get: function() {
                return task.getLatLon();
            }.bind(this),
            set: function(aLatLon) {}
        });

        this.show();
    };
    
    function createOrUpdateTask(aTaskData) {
        if (!tasks[aTaskData.id])
            tasks[aTaskData.id] = new Task(aTaskData);
        else
            tasks[aTaskData.id].updateData = aTaskData;
    };
    
    self.updateTasks = function() {
        oc.getFilteredPoliceTasks(
            function (tasks) {
                tasks.forEach(createOrUpdateTask);
            },
            function (e) {
                P.Logger.severe(e);
            });
    };
    
    self.setSelected = function(aTasks) {
            //tasks[typeof aTasks === 'object' ? aTasks[0].id : aTasks].select();
            aTasks.forEach(function(taskId) {
                tasks[taskId].select();
            });
    };
    
    self.getSelected = function() {
        return [selectedTask.getTaskData()];
    };
    
    self.updateTasks();
}
