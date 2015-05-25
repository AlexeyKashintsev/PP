P.require(["server/libs/http.js", "server/libs/dateUtils.js"]);

function InvocationContext() {
    this.clientIPAddress = '192.169.1.49';
    this.initiator = 'oper-info-front-end';
    this.userName = 'admin';
    this.password = '9v3/5IyQjesPTDvTbAMucg==';
}

// Тест
var inforUrl = 'http://infor.trans-monitor.ru:9393/vms-ws/rest/';
var iv = new InvocationContext();

var cs = {
    useDB: false,
    updateDB: true
}

function HTTPrequest(aService, aMethod, aParams, onSuccess, onFailure, aCustomInvocationContext) {
    function success(aResponse) {
        P.Logger.info(aService + '/' + aMethod + ' answer: \n' + aResponse);
        if (cs.updateDB)
            cacheWorker.writeCache(aService + '/' + aMethod, aResponse)
        var loaded = JSON.parse(aResponse);
        if (aMethod === 'getList') 
            loaded = loaded && loaded.objList ? loaded.objList : [];
        onSuccess(loaded);
    }
    function failure(e) {
        if (onFailure)
            onFailure(e);
        else
            P.Logger.severe(e);
    }
    
    var cacheWorker = new CacheWorker();
    var URL = inforUrl + aService + '/' + aMethod;
    var params = aCustomInvocationContext ? [aCustomInvocationContext].concat(aParams) : [iv].concat(aParams);
    if (cs.useDB) {
        P.Logger.info(aService + '/' + aMethod + ' http request: \n' + JSON.stringify(params));
        Http.post(URL, JSON.stringify(params), success, failure);
    } else {
        P.Logger.info(aService + '/' + aMethod + ' db request: \n' + JSON.stringify(params));
        cacheWorker.getCached(aService + '/' + aMethod, success, failure);
    }
};