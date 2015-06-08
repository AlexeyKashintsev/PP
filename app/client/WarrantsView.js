/**
 * 
 * @author Алексей
 */
function WarrantsView() {
    var self = this
            , model = P.loadModel(this.constructor.name)
            , form = P.loadForm(this.constructor.name, model);
    
    self.show = function (panel) {
        panel ? panel.add(form.view, new P.Anchors(2, null, 2, 2, null, 2)) : form.show();
        initWarrantGrid();
    };
    
    var listW = [], warrantsBySubdivId = [], view = [], viewId = [], kinds = [];
    function initWarrantGrid() {
        listW = [];
        warrantsBySubdivId = [];
        view = [];
        viewId = [];
        kinds = [];
        oc.getPoliceWarrants(
                function (warrants) {
                    warrants.forEach(function (warrant) {
                        listW.push(warrant);
                        if (!kinds[warrant.postWarrantKind.id])
                            kinds[warrant.postWarrantKind.id] = warrant.postWarrantKind;
//                        if (warrant.policeSubdivisionId) {
//                            if (!warrantsBySubdivId[warrant.policeSubdivisionId]) {
//                                warrantsBySubdivId[warrant.policeSubdivisionId] = [];
//                            }
//                            warrantsBySubdivId[warrant.policeSubdivisionId].push(JSON.parse(JSON.stringify(warrant)));
//                        }
                    });
                    form.grdWarrants.data = listW;
                    form.grdWarrants.colWarrantDate.field = "warrantDate";
                    form.grdWarrants.colСallsign.field = "callsign";
                    form.grdWarrants.colActive.field = "active";
                    form.grdWarrants.colNum.field = "num";
                    form.grdWarrants.colTransportRegnum.field = "transportRegnum";
                    form.grdWarrants.colPostNum.field = "postNum";
                    form.grdWarrants.colPostWarrantKind.field = "postWarrantKind.description";
                    form.grdWarrants.colTaskTypeDescription.field = "curentTaskTypeDescription";
                    form.grdWarrants.colTaskIncidentDescription.field = "curentTaskIncidentDescription";
                    //form.grdWarrants.colStaff1.field = "";
                    //form.grdWarrants.colStaff2.field = "";
                    //form.grdWarrants.colStaff3.field = "";
                    form.grdWarrants.colStatus.field = "statusTSname";
                    form.grdWarrants.colDistance.field = "";
                    
                    form.grdWarrants.redraw();
                    
//                    initSubdivisionGrid();
                },
                function (e) {
                    P.Logger.severe(e);
                });
    }
    
    self.getSelected = function() {
        return form.grdWarrants.selected;
    };
    
    self.setSelected = function(aTasks) {
        form.grdWarrants.clearSelection();
        aTasks.forEach(function(warrant) {
            form.grdWarrants.select(warrant);     
        });
    };
    
    var fmWarrant;
    form.grdWarrants.onMouseClicked = function(event) {
        if (event.clickCount === 2) {
            if (!fmWarrant)
                fmWarrant = new WarrantCard();
            fmWarrant.setWarrant(form.grdWarrants.selected[0]);
            fmWarrant.showModal();
        }
    };

}
