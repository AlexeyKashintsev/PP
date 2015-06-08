function SVGController(anIconId, aSvgText, aParams) {
    var iconId = anIconId;
    var paramsSet = false;
    aSvgText = "<div id = 'd" + iconId + "'>" + aSvgText + "</div>";
    var icon = L.divIcon({className: 'svg-marker', html: aSvgText});
    var div;
    function getDiv() {
        if (!div) {
            div = document.getElementById('d' + iconId);
            if (aParams && div && !paramsSet) 
                setParams(aParams);
            if (!div) setTimeout(getDiv, 500);
        }
    }

    this.setFillColor = function(aFillColor) {
        div.innerHTML = div.innerHTML.replace(/fill:.{7}/g, 'fill:' + getHexColor(aFillColor));
    };            
    this.setRimColor = function(aRimColor) {
        div.innerHTML = div.innerHTML.replace(/stroke:.{7}/g, 'stroke:' + getHexColor(aRimColor));
    };
    this.setAngle = function(anAgle) {
        div.style.webkitTransform = 'rotate('+anAgle+'deg)'; 
        div.style.mozTransform    = 'rotate('+anAgle+'deg)'; 
        div.style.msTransform     = 'rotate('+anAgle+'deg)'; 
        div.style.oTransform      = 'rotate('+anAgle+'deg)'; 
        div.style.transform       = 'rotate('+anAgle+'deg)';
    };

    this.updateParams = function(aNewParams) {
        setParams(aNewParams ? aNewParams : aParams);
    };

    var setParams = function (aParams) {
        if (aParams.fillColor) 
            this.setFillColor(aParams.fillColor);
        if (aParams.rimColor)
            this.setRimColor(aParams.rimColor);
        if (aParams.angle)
            this.setAngle(aParams.angle);
        paramsSet = true;
    }.bind(this);

    Object.defineProperty(this, "icon", {
        get: function() {
            return icon;
        }
    });
    getDiv();
}

function getSvgIcon(anIconId, anUrl, aParams, callback) {
    P.Resource.load(anUrl, function(aSvgText) {
        callback(new SVGController(anIconId, aSvgText, aParams));
    });
};