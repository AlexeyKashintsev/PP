/**
 * 
 * @author Алексей
 * @constructor
 * @stateless
 */ 
function ServerWebSocket() {
    var self = this;//, model = P.loadModel(this.constructor.name);
    
    self.pusher = function(aMsg, aTag) {
        if (!aTag) aTag = "default";
        var Pusher = com.eas.server.websocket.TaggedFeedEndPoint;
        var msg = JSON.parse(aMsg);
        //msg.time = new Date();
        
        if(msg.text && msg.user_name){    
            Pusher.broadcast(aTag, JSON.stringify(msg));
        }
    };
    
    var socket = new P.WebSocketServerSession();
    var socket2 = new P.WebSocketSession();
//    socket2.
}
