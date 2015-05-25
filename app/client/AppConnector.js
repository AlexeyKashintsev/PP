/**
 * 
 * @author root
 * @constructor
 * @public
 */ 
function AppConnector() {
    var self = this, model = P.loadModel(this.constructor.name);
    
    self.test = function() {
        return true;
    };
    
    inApp = self;
    
    self.mapObjAPI = null;
}
