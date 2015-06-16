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
    API = this;
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
        
        self.selectTask = function(aTasks) {
            if (!RECIEVED_MSG_PROCESS) {
                var tasks = [];
                (aTasks ? aTasks : self.selectedTasks).forEach(function(task) {
                    tasks.push(task.id);
                });
                sendApiMsg('selectTask', tasks);
            } else {
                self.selectedTasks = aTasks;
            }
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
        self.updateWarrants = function() {
            aWarrantsControl.updateWarrants();
            sendApiMsg('updateWarrants');
        };
        
        self.selectWarrant = function(aWarrants) {
            if (!RECIEVED_MSG_PROCESS) {
                var warrants = [];
                (aWarrants ? aWarrants : self.selectedWarrants).forEach(function(warrant) {
                    warrants.push(warrant.id);
                });
                sendApiMsg('selectWarrant', warrants);
            } else {
                self.selectedWarrants = aWarrants;
            }
        };
        
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
        self.updateSubdivisions = function() {
            aSubdivisionsControl.updateSubdivisions();
            sendApiMsg('updateSubdivisions');
        };
        
        self.selectSubdivision = function(aSubdivisions) {
            if (!RECIEVED_MSG_PROCESS) {
                var subdivisions = [];
                (aSubdivisions ? aSubdivisions : self.selectedSubdivisions).forEach(function(subdivision) {
                    subdivisions.push(subdivision.id);
                });
                sendApiMsg('selectSubdivision', subdivisions);
            } else {
                self.selectedSubdivisions = aSubdivisions;
            }
        };
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
        if (!RECIEVED_MSG_PROCESS) {
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
    }
    
    var RECIEVED_MSG_PROCESS = false;
    self.processAPI = function(anApiMsg) {
        try {
            RECIEVED_MSG_PROCESS = true;
            console.log('API_COMMAND: ' + anApiMsg.command + ', API_DATA: ' + anApiMsg.data);
            if (self[anApiMsg.command])
                self[anApiMsg.command](anApiMsg.data);
        }
        finally {
            RECIEVED_MSG_PROCESS = false;
        }
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
