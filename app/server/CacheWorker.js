/**
 * 
 * @author Алексей
 * @constructor
 * @stateless
 */ 
function CacheWorker() {
    var self = this, model = P.loadModel(this.constructor.name);
    
    self.getCached = function(anUrl, onSuccess, onFailure) {
        model.cache_all.params.url = anUrl;
        model.cache_all.requery(function() {
            onSuccess(model.cache_all.cursor.response);
        }, onFailure);
    };
    
    self.writeCache = function(anUrl, aResponse) {
        model.cache_update.params.url = anUrl;
        model.cache_update.params.response = aResponse;
        model.cache_update.executeUpdate();
    };
}
