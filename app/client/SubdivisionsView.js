/**
 * 
 * @author Алексей
 */
function SubdivisionsView() {
    var self = this
            , model = P.loadModel(this.constructor.name)
            , form = P.loadForm(this.constructor.name, model);
    
    self.show = function (panel) {
        panel ? panel.add(form.view, new P.Anchors(2, null, 2, 2, null, 2)) : form.show();
        initSubdivisionGrid();
    };
    
    var subdivisions = null;
    function initSubdivisionGrid() {
        oc.getPoliceSubdivisions(
                function (subdivs) {
                    subdivisions = prepareTreeGridSource(subdivs);
                    form.grdSubDivisions.data = subdivisions;
                    form.grdSubDivisions.colName.field = "description";
                    form.grdSubDivisions.parentField = "parent";
                    form.grdSubDivisions.childrenField = "children";
                },
                function (e) {
                    P.Logger.severe(e);
                });
    }

    function prepareTreeGridSource(objects) {
        var treeGridSource = [], nodes = [];
        objects.forEach(function (obj) {
            if (!nodes[obj.id]) {
                nodes[obj.id] = {
                    node: obj,
                    children: []
                };
            }
            if (!nodes[obj.id].node) {
                nodes[obj.id].node = obj;
            }
            if (obj.parentId) {
                if (!nodes[obj.parentId]) {
                    nodes[obj.parentId] = {
                        node: null,
                        children: []
                    };
                }
                nodes[obj.parentId].children.push(obj);
            }
        });

        var root = {
            description: "Все подразделения",
            parent: null,
            children: []
        };

        objects.forEach(function (obj) {
            if (obj.parentId) {
                obj.parent = nodes[obj.parentId].node;
            } else {
                root.children.push(obj);
                obj.parent = root;
            }
            obj.children = nodes[obj.id].children;
            /*if (warrantsBySubdivId[obj.id] && warrantsBySubdivId[obj.id].length) {
                warrantsBySubdivId[obj.id].forEach(function (warrant) {
                    warrant.description = warrant.num;
                    warrant.parent = obj;
                    warrant.children = [];
                    obj.children.push(warrant);
                    treeGridSource.push(warrant);
                });
            }*/
            treeGridSource.push(obj);
        });

        treeGridSource.push(root);
        return treeGridSource;
    }    
}
