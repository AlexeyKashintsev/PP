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
        self.updateTasks = function() {
            aTasksControl.updateTasks();
            sendApiMsg('updateTasks');
        };
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
    
    function inAppMsgSend(apiMsg) {
        switch (apiMsg.dest) { 
            case 'map': {
                mAPI.processAPI(apiMsg);
                break;
            }
            case 'client': {
                cAPI.processAPI(apiMsg);
                break;
            }
            default: {
                API.processAPI(apiMsg);
                break;
            }
        }
    }
    
    function sendApiMsg(aCommand, aData, aDest) {
        var apiMsg = {
            dest: aDest ? aDest : API_TYPES[anApiType].dest,
            command: aCommand,
            data: aData
        };
        
        try {
            inAppMsgSend(apiMsg);
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
            case 'updateTasks': {
                    self.updateTasks();
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
            wsDataFeed = getWebSocket('AppApi', anApiType, self.processAPI);
        });
    } catch(e) {
        console.log('Error initializing websocket');
    }
}
