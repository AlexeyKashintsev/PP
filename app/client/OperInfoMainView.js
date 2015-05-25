/**
 * 
 */
function OperInfoMainView() {
    var self = this
            , model = P.loadModel(this.constructor.name)
            , form = P.loadForm(this.constructor.name, model);

    new OperControl();
    try {
        inApp.test();
    } catch (e) {
        new AppConnector();
    }
    
    var operInfoMapView = new OperInfoMapView();
    var subdivisionsView = new SubdivisionsView();
    var tasksView = new TasksView();
    var warrantsView = new WarrantsView();

    self.show = function () {
        var containerElement = document.getElementById("OperInfoView");
        form.view.showOn(containerElement);
        subdivisionsView.show(form.pnlSubdivisionsTree);
        tasksView.show(form.pnTasks);
        warrantsView.show(form.pnlWarrants);
        operInfoMapView.showOnPanel(form.pnlOperInfoMap);
    };
}
