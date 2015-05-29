/**
 * 
 * @author Алексей
 * @constructor
 * @resident
 */ 
function AppGlobal() {
    var self = this, model = P.loadModel(this.constructor.name);
    
    inAppApiSessions = [];
    
}
