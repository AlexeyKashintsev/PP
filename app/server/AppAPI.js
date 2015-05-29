/**
 * @public
 * @author Алексей
 * @constructor
 * @stateless
 */ 
function AppApi() {
    var self = this;
    
    function processMessage(aMsgData) {
//        P.Logger.info('\nProcessMessage');
        AppSessions.forEach(function(wsSession) {
//            P.Logger.info('\nSessionType: ' + wsSession.sType + ' Session: ' + wsSession.session);
            if (wsSession.sType === aMsgData.dest) {
                try {
                    wsSession.session.send(JSON.stringify(aMsgData));
                } catch(e) {
                    P.Logger.warning(e + ' Probably closed session. Deleting from pool!');
                    delete AppSessions[wsSession.id];
                }
            }
        });
    }
    
    function pushSession(aWsSession, aSessionType) {
        aWsSession.id = AppSessions.length;
        AppSessions.push({
            session: aWsSession,
            sType: aSessionType,
            id: aWsSession.id
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
//            if (data === 'ClientAPI') {
//                pushSession(aWsSession, 'client');
//            } else
//                if (data === 'ClientMapAPI') {
//                    pushSession(aWsSession, 'map');
//                } else 
//                    processMessage(data);

            P.Logger.info('\nWebSocket message: ' + data + ' json: ' + JSON.stringify(evt));
        };
        
        aWsSession.onclose = function () {
            P.Logger.info('\nClosing wsSession Id = ' + aWsSession.id);
            delete AppSessions[aWsSession.id];
            aWsSession = null;
        };
        aWsSession.onerror = function (evt) {
            P.Logger.severe('Front proxy WebSocket error: ' + JSON.stringify(evt));
        };
    };
    
    
}
