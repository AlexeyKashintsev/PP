/**
 * 
 * @author Алексей
 * @constructor
 * @stateless
 */ 
function CacheWorker() {
    var self = this, model = P.loadModel(this.constructor.name);
    
    self.getCached = function(anUrl, onSuccess, onFailure) {
        try {
            model.cache_all.params.url = anUrl;
            model.cache_all.requery(function() {
                if (!model.cache_all.empty)
                    onSuccess(model.cache_all.cursor.response);
                else
                    onFailure();
            }, onFailure);
        } catch (e) {
            P.Logger.warning('Cache worker error on read: ' + e);
        }
    };
    
    self.writeCache = function(anUrl, aResponse) {
        try {
            model.cache_update.params.url = anUrl;
            model.cache_update.params.response = aResponse;
            model.cache_update.executeUpdate();
        } catch (e) {
            P.Logger.warning('Cache worker error on update: ' + e);
        }
    };
}
