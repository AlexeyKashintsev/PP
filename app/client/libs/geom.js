    /**
     * Parses Well Known Text (WKT) and return a PolyLine, MultiPolyline, et cetera
     * The supported options depends on the type of feature found   http://leaflet.cloudmade.com/reference.html#path
     * @param wkt String WKT to be parsed
     * @param options Object to be passed to the new feature as it is constructed, e.g. fillColor, strokeWidth
     * @return An instance of a L.Path subclass, e.g. L.Polyline
     */ 
    L.parseWKT = function(wkt, options) {
        function parsePoint(wkt, options) {
            // split on , to get vertices. handle possible spaces after commas
            var coord = wkt.replace(/^POINT\s*\(/, '').replace(/\)$/, '').split(/,\s*/);
            if (coord && coord.length === 1) {
                var lng = parseFloat(coord[0].split(" ")[0]);
                var lat = parseFloat(coord[0].split(" ")[1]);
                return new L.Point(lat, lng, options);
            }
        }

        function parseLinestring(wkt, options) {
            // split on , to get vertices. handle possible spaces after commas
            var verts = wkt.replace(/^LINESTRING\s*\(/, '').replace(/\)$/, '').split(/,\s*/);

            // collect vertices into a line
            var line = [];
            for (var vi = 0, vl = verts.length; vi < vl; vi++) {
                var lng = parseFloat(verts[vi].split(" ")[0]);
                var lat = parseFloat(verts[vi].split(" ")[1]);
                line[line.length] = new L.LatLng(lat, lng);
            }

            // all set, return the Polyline with the user-supplied options/style
            var feature = new L.Polyline(line, options);
            return feature;
        }

        function parseMultiLinestring(wkt, options) {
            // some text fixes
            wkt = wkt.replace(/^MULTILINESTRING\s*\(/, '').replace(/\)\)$/, ')');

            // split by () content to get linestrings, split linestrings by commas to get vertices
            var multiline = [];
            var getLineStrings = /\((.+?)\)/g;
            var getVerts = /,\s*/g;
            var lsmatch = getLineStrings.exec(wkt);
            while (lsmatch && lsmatch.length > 1) {
                var line = [];
                var verts = lsmatch[1].split(getVerts);
                for (var i = 0; i < verts.length; i++) {
                    var coords = verts[i].split(" ");
                    var lng = parseFloat(coords[0]);
                    var lat = parseFloat(coords[1]);
                    line[line.length] = new L.LatLng(lat, lng);
                }
                multiline[multiline.length] = line;
                lsmatch = getLineStrings.exec(wkt);
            }

            // all set, return the MultiPolyline with the user-supplied options/style
            var feature = new L.MultiPolyline(multiline, options);
            return feature;
        }

        function parsePolygon(wkt, options) {
            // split on , to get shapes. handle possible spaces after commas
            var shapes = wkt.replace(/^POLYGON\s*\(\(/, '').replace(/\)\)$/, '').split(/\),\s*\(/);

            var polygon = [];
            for (var si = 0; si < shapes.length; si++) {
                var shapeVerts = shapes[si].split(/,\s*/);
                var shape = [];
                for (var vi = 0; vi < shapeVerts.length; vi++) {
                    var lng = parseFloat(shapeVerts[vi].split(" ")[0]);
                    var lat = parseFloat(shapeVerts[vi].split(" ")[1]);
                    shape.push(new L.LatLng(lat, lng));
                }
                polygon.push(shape);
            }

            // all set, return the Polyline with the user-supplied options/style
            var feature = new L.polygon(polygon, options);
            return feature;
        }

        // really, this is a wrapper to the WKTtoFeature.parse* functions
        wkt = wkt.replace(/^\s*/g, '').replace(/\s*$/, '');
        if (wkt.indexOf('LINESTRING') === 0)
            return parseLinestring(wkt, options);
        else if (wkt.indexOf('MULTILINESTRING') === 0)
            return parseMultiLinestring(wkt, options);
        else if (wkt.indexOf('POINT') === 0)
            return parsePoint(wkt, options);
        else if (wkt.indexOf('POLYGON') === 0)
            return parsePolygon(wkt, options);
    };
