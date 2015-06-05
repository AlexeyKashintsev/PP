P.require(['client/libs/DecToHex.js']);

function getSvgIcon(anIconId, anUrl, aParams, callback) {
    P.Resource.load(anUrl, function(aSvgText) {
        function SVGController() {
            aSvgText = "<div id = 'd" + anIconId + "'>" + aSvgText + "</div>";
            L.divIcon({className: 'svg-marker', html: aSvgText});
            var div = document.getElementById('d' + anIconId);
            
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
            
            if (aParams.fillColor) 
                this.setFillColor(aParams.fillColor);
            if (aParams.rimColor)
                this.setRimColor(aParams.rimColor);
            if (aParams.angle)
                this.setAngle(aParams.angle);
            
        }
//        aSvgText = aFillColor ? aSvgText.replace(/fill:.{7}/g, 'fill:' + getHexColor(aFillColor)) : aSvgText;
//        aSvgText = aRimColor ? aSvgText.replace(/stroke:.{7}/g, 'stroke:' + getHexColor(aRimColor)) : aSvgText;
//        callback(new L.divIcon());
        callback(new SVGController());
    });
};

