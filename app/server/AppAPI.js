/**
 * @public
 * @author Алексей
 * @constructor
 * @stateless
 */ 
function AppApi() {
    var self = this;
    
    function processMessage(aMsgData) {
        inAppApiSessions.forEach(function(wsSession) {
            if (wsSession.sType === aMsgData.dest) {
                try {
                    wsSession.session.send(JSON.stringify(aMsgData));
                } catch(e) {
                    P.Logger.warning(e + ' Probably closed session. Deleting from pool! Session id: ' + wsSession.arr_index);
                    inAppApiSessions.splice(wsSession.arr_index, 1);
                }
            }
        });
    }
    
    function pushSession(aWsSession, aSessionType) {
        aWsSession.arr_index = inAppApiSessions.length;
        inAppApiSessions.push({
            session: aWsSession,
            sType: aSessionType,
            id: aWsSession.arr_index
        });
    }
    
    self.onopen = function (aWsSession) {
        aWsSession.onmessage = function (evt) {
            var data = JSON.parse(evt.data);
            switch (data) {
                case 'ClientAPI': {
                        pushSession(aWsSession, 'client');
                        break;
                }
                case 'ClientMapAPI': {
                        pushSession(aWsSession, 'map');
                        break;
                }
                default: {
                        processMessage(data);
                }
            }

            P.Logger.info('\nWebSocket message: ' + data + ' json: ' + JSON.stringify(evt));
        };
        
        aWsSession.onclose = function () {
            P.Logger.info('\nClosing wsSession Id = ' + aWsSession.id);
            delete inAppApiSessions[aWsSession.id];
            aWsSession = null;
        };
        aWsSession.onerror = function (evt) {
            P.Logger.severe('Front proxy WebSocket error: ' + JSON.stringify(evt));
        };
    };
    
    
}
