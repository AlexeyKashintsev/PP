/**
 * 
 * @author Алексей
 * @constructor
 */
function ClientMapAPI(anAPIObjects) {
    var self = this, model = P.loadModel(this.constructor.name);

    mAPI = self;
    var TasksMap;
    self.setTasksControl = function (aTasksMap) {
//        self.selectTaskMarker = aTasksMap.selectTaskMarker;
        TasksMap = aTasksMap;
    };

    self.setWarrantsControl = function (aWarrantsMap) {

    };

    self.setSubdivisionsControl = function (aSubdivisionsMap) {

    };

    if (anAPIObjects) {
        if (anAPIObjects.tasksMapObj)
            self.setTasksControl(anAPIObjects.tasksMapObj);
        if (anAPIObjects.subdivisionsMapObj)
            self.setSubdivisionsControl(anAPIObjects.subdivisionsMapObj);
        if (anAPIObjects.warrantsMapObj)
            self.setWarrantsControl(anAPIObjects.warrantsMapObj);
    }
    
    var wsDataFeed;
    P.require(['client/libs/ClientWebSocket.js'], function () {
        wsDataFeed = getWebSocket('ClientMapAPI', self.processAPI);
    });
    
    function sendApiMsg(aCommand, aData) {
        var apiMsg = {
            dest:   'client',
            command: aCommand,
            data: aData
        };
        
        wsDataFeed.send(JSON.stringify(apiMsg));
//        try {
//            cAPI.processAPI(apiMsg);
//        } catch (e) {
//            
//        }
    }
    
    self.processAPI = function(anApiMsg) {
        switch (anApiMsg.command) {
            case 'selectTask': {
                    if (TasksMap)
                        TasksMap.selectTaskMarker(anApiMsg.data);
                    break;
            }
        }
    };
}
