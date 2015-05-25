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

function HTTPrequest(aService, aMethod, aParams, onSuccess, onFailure, aCustomInvocationContext) {
    var URL = inforUrl + aService + '/' + aMethod;
    var params = aCustomInvocationContext ? [aCustomInvocationContext].concat(aParams) : [iv].concat(aParams);
    var paramsStr = JSON.stringify(params);
    P.Logger.info(aService + '/' + aMethod + ' request: \n' + paramsStr);
    Http.post(URL, paramsStr,
                function (aResponse) {
                    P.Logger.info(aService + '/' + aMethod + ' answer: \n' + aResponse);
                    var loaded = JSON.parse(aResponse);
                    if (aMethod === 'getList') 
                        loaded = loaded && loaded.objList ? loaded.objList : [];
                    onSuccess(loaded);
                },
                function (e) {
                    if (onFailure)
                        onFailure(e);
                    else
                        P.Logger.severe(e);
                });
};