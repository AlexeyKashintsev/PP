function getWebSocket(aModule, aProcessor) {    
    var urlBase = "ws://" + window.location.host + window.location.pathname.substr(0, window.location.pathname.lastIndexOf("/"));
    var wsDataFeed = new WebSocket(urlBase + '/AppApi');
    wsDataFeed.onopen = function (evt) {
        wsDataFeed.send(JSON.stringify(aModule));
    };
    wsDataFeed.onerror = function (evt) {
        wsDataFeed.close();
        wsDataFeed = null;
    };
    wsDataFeed.onclose = function (evt) {
        wsDataFeed = null;
    };
    wsDataFeed.onmessage = function (evt) {
        var message = JSON.parse(evt.data);
        aProcessor(message);
    };
    
    return wsDataFeed;
};