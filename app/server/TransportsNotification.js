P.require('server/libs/infor.js');
/**
 * 
 * @author mg
 * @stateless
 * @public 
 * @constructor
 */
function TransportsNotification() {
    var self = this, model = P.loadModel(this.constructor.name);

    self.onopen = function(aWsSession){
        var iContext = new InvocationContext();
        var proxy = null;
        var signed = false;
        aWsSession.onmessage = function (evt) {
            if (!signed) {
                var devices = JSON.parse(evt.data);
                proxy = new P.WebSocket(devUrl);
                proxy.onopen = function () {
                    proxy.send(JSON.stringify({
                        serviceName:"NDDataWS",
                        methodName:"sendList",
                        messageType:"ru.infor.ws.business.vms.websocket.objects.SubscribingOptions_SendListNDData",
                        context: iContext,
                        deviceIdList: devices}));
                };
                proxy.onclose = function () {
                    aWsSession.close();
                };
                proxy.onerror = function () {
                    aWsSession.close();
                };
                proxy.onmessage = function (evt) {
                    var data = JSON.parse(evt.data);
                    if (!signed && data.status === 0)
                            signed = true;
                    if (data.messageType === "ru.infor.websocket.transport.DataPack")
                        aWsSession.send(evt.data);
                };
            }
        };
        aWsSession.onclose = function () {
            if (signed)
                proxy.close();
        };
        aWsSession.onerror = function () {
            if (signed)
                proxy.close();
        };
    };
}
