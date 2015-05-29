/**
 * 
 * @param {type} anApiModules
 * @param {type} anApiType {'ClientAPI', 'ClientMapAPI'}
 * @returns {undefined}
 * @public
 * @author Алексей
 * @constructor
 */ 
function ClientAPI(anApiModules, anApiType) {
    var API = this;
    var self = this, model = P.loadModel(this.constructor.name);
    var API_TYPES = {
        ClientAPI: {
            dest: 'map'
        },
        ClientMapAPI: {
            dest: 'client'
        }
    };
    
    function setTasksControl(aTasksControl) {
        Object.defineProperty(self, 'selectedTasks', {
            get : function() {
                return aTasksControl.getSelected();
            },
            set : function(aTasks) {
                aTasksControl.setSelected(aTasks);
            }
        });
    };
    
    function setWarrantsControl(aWarrantsControl) {
        Object.defineProperty(self, 'selectedWarrants', {
            get : function() {
                return aWarrantsControl.getSelected();
            },
            set : function(aTasks) {
                aWarrantsControl.setSelected(aTasks);
            }
        });
    };
    
    function setSubdivisionsControl(aSubdivisionsControl) {
        Object.defineProperty(self, 'selectedSubdivisions', {
            get : function() {
                return aSubdivisionsControl.getSelected();
            },
            set : function(aTasks) {
                aSubdivisionsControl.setSelected(aTasks);
            }
        });
    };
    
    if (anApiModules) {
        if (anApiModules.tasks)
            setTasksControl(anApiModules.tasks);
        if (anApiModules.subdivisions)
            setSubdivisionsControl(anApiModules.subdivisions);
        if (anApiModules.warrants)
            setWarrantsControl(anApiModules.warrants);
    }
    
    function sendApiMsg(aCommand, aData) {
        var apiMsg = {
            dest: API_TYPES[anApiType].dest,
            command: aCommand,
            data: aData
        };
        
        try {
            if (anApiType === 'ClientAPI')
                mAPI.processAPI(apiMsg);
            else
                cAPI.processAPI(apiMsg);
        } catch (e) {
            wsDataFeed.send(JSON.stringify(apiMsg));
        }
    }
    
    self.processAPI = function(anApiMsg) {
        switch (anApiMsg.command) {
            case 'selectTask': {
                self.selectedTasks = anApiMsg.data;
                break;
            }
        }
    };
    
    self.selectTask = function(aTasks) {
        var tasks = [];
        (aTasks ? aTasks : self.selectedTasks).forEach(function(task) {
            tasks.push(task.id);
        });
        sendApiMsg('selectTask', tasks);
    };
    
    var wsDataFeed;
    try {
        P.require(['client/libs/ClientWebSocket.js'], function () {
            wsDataFeed = getWebSocket(anApiType, self.processAPI);
        });
    } catch(e) {
        console.log('Error initializing websocket')
    }
}
