var Http = {};
(function () {
    var ScriptedResourceClass = Java.type("com.eas.client.scripts.ScriptedResource");
    var URLEncoder = Java.type("java.net.URLEncoder");
    var headers = {};
    headers["Content-Type"] = "text/xml;charset=utf-8"; // "application/x-www-form-urlencoded"
    //headers["Accept"] = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8";
    //headers["Accept-Encoding"] = 'gzip,deflate';
    headers["Accept-Charset"] = 'utf-8';
//    headers["Authorization"] = ;

    Http.urlEncode = function (aValue) {
        return URLEncoder.encode(aValue, 'utf-8');
    };
    Http.get = function (aUrl, aOnSuccess, aOnFailure) {
        P.async(function () {
            var response = ScriptedResourceClass.jsRequestHttpResource(aUrl, "GET", null, headers);
            return response.body;
        }, aOnSuccess, function (e) {
            P.Logger.severe("[GET] Infor server error occured. Url: " + aUrl + ". Error message: " + e);
            aOnFailure(e);
        });
    };

    Http.post = function (aUrl, aValue, aOnSuccess, aOnFailure) {
        P.async(function () {
            var response = ScriptedResourceClass.jsRequestHttpResource(aUrl, "POST", aValue, headers);
            return response.body;
        }, aOnSuccess, function (e) {
            P.Logger.severe("[POST] Infor server error occured. Url: " + aUrl + ". Request body: " + aValue + ". Error message: " + e);
            aOnFailure(e);
        });
    };
})();