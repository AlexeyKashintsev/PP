function getWebSocket(aModuleName, anOpener, aProcessor) {    
    var urlBase = "ws://" + window.location.host + window.location.pathname.substr(0, window.location.pathname.lastIndexOf("/"));
    var wsDataFeed = new WebSocket(urlBase + '/' + aModuleName);//'/AppApi');
    wsDataFeed.onopen = function (evt) {
        wsDataFeed.send(JSON.stringify(anOpener));
    };
    wsDataFeed.onerror = function (evt) {
        console.log('Ошибка сокета: ' + evt);
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