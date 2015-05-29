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
        this.selected = false;
        this.getDescription = function() {
            return "Тип: " + (aTaskData.type.description ? aTaskData.type.description : "Не задан") + "\n" +
                   "Проишествие: " + (aTaskData.incident.description ? aTaskData.incident.description : "Нет данных") + "\n" +
                   "Статус: " + (aTaskData.exec.description ? aTaskData.exec.description : "Нет данных") + "\n" +
                   "Время создания: " + (aTaskData.startAt ? aTaskData.startAt : "Не задано");                       
        };

        this.getLatLon = function() {
            return aTaskData.lat && aTaskData.lon ? [aTaskData.lat, aTaskData.lon] : false;
        };

        this.getIcon = function() {
            return L.icon({iconUrl: 'app/icons/warning.png'});
        };

        this.show = function() {
            if (this.getLatLon())
                this.marker = new mapObjects.Marker(this);
        }.bind(this);

        this.getPopup = function() {
            return new TaskMapSticker(aTaskData);
        };

        this.onclick = function() {
            selectedTask = this;
            mAPI.selectTask([aTaskData]);
        }.bind(this);
        
        this.getTaskData = function() {
            return aTaskData;
        };
        
        this.getTaskId = function() {
            return aTaskData.id;
        };
        
        this.updateData = function(aNewTaskData) {
            aTaskData = aNewTaskData;
        };
        
        this.select = function(doShowTooltip) {
            this.marker.center();
            selectedTask = this;
        }.bind(this);
        
        Object.defineProperty(this, "latlon", {
            get: function() {
                return this.getLatLon();
            }.bind(this),
            set: function(aLatLon) {}.bind(this)
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
