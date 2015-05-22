/**
 * 
 */
function OperInfoView_1() {
    var self = this
            , model = P.loadModel(this.constructor.name)
            , form = P.loadForm(this.constructor.name, model);

    var oc_ = new OperControl();

    var operInfoMapView = new OperInfoMapView();
    operInfoMapView.setAPI(self);
    var subdivisionsView = new SubdivisionsView();
    var tasksView = new TasksView();
    var warrantsView = new WarrantsView();

    self.show = function () {
        subdivisionsView.showOnPanel(form.pnlSubdivisionsTree);
        tasksView.showOnPanel(form.pnTasks);
        warrantsView.showOnPanel(form.pnlWarrants);
        operInfoMapView.showOnPanel(form.pnlOperInfoMap);
        var containerElement = document.getElementById("OperInfoView");
        form.view.showOn(containerElement);
    };
}
