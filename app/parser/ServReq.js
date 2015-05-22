/**
 * 
 * @author Алексей
 */
function ServReq() {
    var self = this
            , model = P.loadModel(this.constructor.name)
            , form = P.loadForm(this.constructor.name, model);
    
    self.show = function () {
        form.show();
    };
    
    /*jslint white: true, devel: true, onevar: true, browser: true, undef: true, nomen: true, regexp: true, plusplus: false, bitwise: true, newcap: true, maxerr: 50, indent: 4 */
var jsl = {};

/**
 * jsl.format - Provide json reformatting in a character-by-character approach, so that even invalid JSON may be reformatted (to the best of its ability).
 *
**/
jsl.format = function(json) {
        function repeat(s, count) {
            return new Array(count + 1).join(s);
        }
        
        var i           = 0,
            il          = 0,
            tab         = "    ",
            newJson     = "",
            indentLevel = 0,
            inString    = false,
            currentChar = null;

        for (i = 0, il = json.length; i < il; i += 1) { 
            currentChar = json.charAt(i);

            switch (currentChar) {
            case '{': 
            case '[': 
                if (!inString) { 
                    newJson += currentChar + "\n" + repeat(tab, indentLevel + 1);
                    indentLevel += 1; 
                } else { 
                    newJson += currentChar; 
                }
                break; 
            case '}': 
            case ']': 
                if (!inString) { 
                    indentLevel -= 1; 
                    newJson += "\n" + repeat(tab, indentLevel) + currentChar; 
                } else { 
                    newJson += currentChar; 
                } 
                break; 
            case ',': 
                if (!inString) { 
                    newJson += ",\n" + repeat(tab, indentLevel); 
                } else { 
                    newJson += currentChar; 
                } 
                break; 
            case ':': 
                if (!inString) { 
                    newJson += ": "; 
                } else { 
                    newJson += currentChar; 
                } 
                break; 
            case ' ':
            case "\n":
            case "\t":
                if (inString) {
                    newJson += currentChar;
                }
                break;
            case '"': 
                if (i > 0 && json.charAt(i - 1) !== '\\') {
                    inString = !inString; 
                }
                newJson += currentChar; 
                break;
            default: 
                newJson += currentChar; 
                break;                    
            } 
        } 

        return newJson; 
    };
    
    var curIndex;
    //var dataAr = [];
    function prepareArray(aData, aParent) {
        if (!aParent) {
            aParent = null;
            curIndex = 0;
        }
        var res = [];
        for (var j in aData) {
            var rec = {
                id: ++curIndex,
                key: j,
                parent: aParent
            };
            if (typeof aData[j] == "object") {
                rec.data = ">>" + (aData[j].description ? aData[j].description : "object") + "<<";
                rec.children = prepareArray(aData[j], rec);
            } else {
                rec.data = aData[j];
            };
            res.push(rec);
        }
        return res;
    };
    
    //var oc = new P.ServerModule("OperInfoProxy");

    var methodsList = [];
    for (var j in oc)
        methodsList.push({methodName: j});

    form.mcMethods.displayList = methodsList;
    form.mcMethods.displayField = "methodName";
    
    form.button.onActionPerformed = function(event) {
        oc[form.mcMethods.text](function(aResult) {
            form.result.text = jsl.format(JSON.stringify(aResult));
            
            form.res.data = prepareArray(aResult);;
            form.res.colKey.field = "key";
            form.res.colValue.field = "data";
            form.res.childrenField = "children";
            form.res.parentField = "parent";
        }, function(aResult) {
             form.result.text = aResult;
        });
    };

}
