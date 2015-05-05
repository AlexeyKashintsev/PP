/**
 * Геокодирование.js
 * Created on 20.04.2012, 10:42:56
 * Формат ГеоОбъекта: {addressCollection:{
 *                     count:1,
 *                     objects: [{
 *                         geoObject:{
 *                             textAddress: "Россия, Москва, улица Новый Арбат, 24",
 *                             topCorner.lat: "37.591701 55.755409", (\d*\.\d{3})\d*
 *                             topCorner.lon: "37.591701 55.755409",
 *                             downCorner.lat: "37.583490 55.750778",
 *                             downCorner.lon: "37.583490 55.750778",
 *                             point.lat: "37.587596 55.753093",
 *                             point.lon: "37.587596 55.753093"
 *                         }
 *                     },
 *                     {
 *                         geoObject:{
 *                             textAddress: "Россия, Москва, улица Новый Арбат, 24",
 *                             topCorner: "37.591701 55.755409",
 *                             downCorner: "37.583490 55.750778",
 *                             point: "37.587596 55.753093"
 *                         }
 *                     }     
 *                     ]
 * }
 * }
 *
 * @author ab
 */
function GeoCode() {
    /*
     function encodeURIComponent(aValue){
     return java.net.URLEncoder.encode(aValue, 'utf-8');
     }
     */
    function StringUtils() {

        var self = this;

        self.format = function (aObj, aArguments) {
            var formatted = aObj;
            for (var arg in aArguments) {
                formatted = formatted.replace("{" + arg + "}", aArguments[arg]);
            }
            return formatted;
        };
    }
    var self = this;

    var yaKey = "ANpUFEkBAAAAf7jmJwMAHGZHrcKNDsbEqEVjEUtCmufxQMwAAAAAAAAAAAAvVrubVT4btztbduoIgTLAeFILaQ==";
    var urlYandex = "http://geocode-maps.yandex.ru/1.x/?format=json&geocode={0}&key={1}";

    var urlOSM = "http://nominatim.openstreetmap.org/search/{0}?format=json&polygon=1&addressdetails=1";
    var urlOSMReverse = "http://nominatim.openstreetmap.org/reverse?format=json&accept-language=ru&lat={0}&lon={1}&zoom=18&addressdetails=1";

    var utils = new StringUtils();

    function constructOSMAddress(aAddress) {
        var result = aAddress.road ? aAddress.road/*.replace(/улица/, "ул.")*/ + " " : "";
        result += aAddress.house_number ? "д." + aAddress.house_number : "";
        result += result ? ", " : "";
        result += aAddress.city ? aAddress.city : aAddress.town ? aAddress.town : aAddress.village ? aAddress.village : aAddress.state ? aAddress.state : aAddress.country ? aAddress.country : "";
        return result;
    }

    /**
     *  Получить координаты объекта по его имени(yandex).
     */
    function getCoordinatesFromYandex(objName, key, onSuccess, onFailure) {
        key = key ? key : yaKey;
        var address = encodeURIComponent(objName);
        var link = utils.format(urlYandex, [address, key]);
        P.Resource.load(link, function (aJSONText) {
            var yaGeoObject = JSON.parse(aJSONText);
            if (yaGeoObject && yaGeoObject.response.GeoObjectCollection.metaDataProperty.GeocoderResponseMetaData.found !== 0) {
                var point = yaGeoObject.response.GeoObjectCollection.featureMember[0].GeoObject.Point;
                if (point) {
                    var coordinats = point.Point.split(" ");
                    onSuccess({lat: coordinats[1], lng: coordinats[0]});
                }
            } else {
                //TODO Add new geocode service.
            }
            onSuccess(null);
        }, function (e) {
            if (onFailure)
                onFailure(e);
            else
                P.Logger.severe(e);
        });
    }

    /**
     *  Получить координаты объекта по его имени(OpenStreetMap).
     */
    function getCoordinatesFromOSM(objName, onSuccess, onFailure) {
        var address = encodeURIComponent(objName);
        var link = utils.format(urlOSM, [address]);
        P.Resource.load(link, function (aJSONText) {
            var osmGeoObject = JSON.parse(aJSONText);
            if (osmGeoObject && osmGeoObject.length > 0) {
                onSuccess({lat: osmGeoObject[0].lat, lng: osmGeoObject[0].lon, address: constructOSMAddress(osmGeoObject[0].address)});
            } else{
                getCoordinatesFromYandex(objName, yaKey, onSuccess, onFailure);
            }
        }, function (e) {
            if (onFailure)
                onFailure(e);
            else
                P.Logger.severe(e);
        });
    }

    /**
     *  Получить имя объекта по его координатам (yandex).
     */
    function getAddressFromYandex(lat, lon, key, onSuccess, onFailure) {
        key = key ? key : yaKey;
        var point = lon + "," + lat;
        var link = utils.format(urlYandex, [point, key]);
        P.Resource.load(link, function (aJSONText) {

            var result = "Неизвестно";
            var yaGeoObject = JSON.parse(aJSONText);
            if (yaGeoObject && yaGeoObject.response.GeoObjectCollection.metaDataProperty.GeocoderResponseMetaData.found !== 0) {
                var fullDescription = yaGeoObject.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.AddressDetails.Country;
                if (fullDescription) {
                    result = fullDescription.Locality.Thoroughfare ? fullDescription.Locality.Thoroughfare.ThoroughfareName.replace(/улица/, "ул.") + "," : "";
                    result += (fullDescription.Locality.Thoroughfare && fullDescription.Locality.Thoroughfare.Premise) ? "д." + fullDescription.Locality.Thoroughfare.Premise.PremiseNumber + "," : "";
                    result += fullDescription.Locality ? fullDescription.Locality.LocalityName : fullDescription.CountryName;
                }

            } else {
                // TODO Add new reverse geocode service.
            }
            onSuccess(result);
        }, function (e) {
            if (onFailure)
                onFailure(e);
            else
                P.Logger.severe(e);
        });
    }

    /**
     *  Получить имя объекта по его координатам (OpenStreetMap).
     */
    function getAddressFromOSM(lat, lon, onSuccess, onFailure) {
        var link = utils.format(urlOSMReverse, [lat, lon]);
        P.Resource.load(link, function (aJSONText) {

            var result = "Неизвестно";
            var osmGeoObject = JSON.parse(aJSONText);
            if (osmGeoObject && osmGeoObject.address) {
                result = constructOSMAddress(osmGeoObject.address);
            } else {
                result = getAddressFromYandex(lat, lon, yaKey);
            }
            onSuccess(result);
        }, function (e) {
            if (onFailure)
                onFailure(e);
            else
                P.Logger.severe(e);
        });
    }

    /**
     * Получение координат объекта по его имени.
     * @param {type} aName
     * @returns {undefined}
     */
    self.toCoordinates = function (aName, onSuccess, onFailure) {
        getCoordinatesFromOSM(aName, onSuccess, onFailure);
    };

    /**
     * Получение наименования объекта по его координатам.
     * @param {type} aLat
     * @param {type} aLon
     * @returns {undefined}
     */
    self.toName = function (aLatLng, onSuccess, onFailure) {
        getAddressFromOSM(aLatLng.lat, aLatLng.lng, onSuccess, onFailure);
    };
}