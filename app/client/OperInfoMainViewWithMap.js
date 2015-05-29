/**
 * 
 */
function OperInfoMainView_1() {
    var self = this
            , model = P.loadModel(this.constructor.name)
            , form = P.loadForm(this.constructor.name, model);

    new OperControl();
    
    var operInfoMapView = new OperInfoMapView();
    var subdivisionsView = new SubdivisionsView();
    var tasksView = new TasksView();
    var warrantsView = new WarrantsView();
    var controlsView = new ControlsView();
    
    cAPI = new ClientAPI({
        tasks: tasksView,
        subdivisions: subdivisionsView,
        warrants: warrantsView
    }, 'ClientAPI');
    
    
    self.show = function () {
        var containerElement = document.getElementById("OperInfoView");
        form.view.showOn(containerElement);
        operInfoMapView.showOnPanel(form.pnlOperInfoMap);
        subdivisionsView.show(form.pnlSubdivisionsTree);
        tasksView.show(form.pnTasks);
        warrantsView.show(form.pnlWarrants);
        controlsView.show(form.pnlManagment);
    };
}
