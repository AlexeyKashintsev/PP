/**
 * 
 * @author Алексей
 * @constructor
 * @public
 */ 
function ClientWebSocket() {
    var self = this;
    
    var webSocket = null;
    
    function messageSender() {
        if (webSocket) {
            webSocket.close();
            webSocket = null;
        }
        
        var wsProtocol = "ws:";
        if (window.location.protocol == 'https:')
            wsProtocol = "wss:";
        
        webSocket = new WebSocket(wsProtocol + "//" + window.location.host + window.location.pathname.substr(0, window.location.pathname.lastIndexOf("/")) + "/taggedfeed");
        
        webSocket.onopen = function() {
            webSocket.send("default");
        };

        webSocket.onerror = function(anError) {};
        
        webSocket.onmessage = function(aEventData) {
            var msg = JSON.parse(aEventData.data);
            
        };
        
        webSocket.onclose = function() {
            sendChatMsg.pusher(JSON.stringify({
                lostUser   :   userSession.getUserName()
            }));
        };
    }
}
