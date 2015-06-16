/**
 * 
 * @author Алексей
 */
function ControlsView() {
    var self = this
            , model = P.loadModel(this.constructor.name)
            , form = P.loadForm(this.constructor.name, model);
    
    self.show = function (panel) {
        panel ? panel.add(form.view, new P.Anchors(2, null, 2, 2, null, 2)) : form.show();
        initControlCombos();
    };
    
    function initControlCombos() {
        initTaskStatusCombo();
        initWarrantStatusCombo();
    }

    var taskExecStatuses = [];
    function initTaskStatusCombo() {
        oc.getPoliceTaskExec(
            function (statuses) {
                taskExecStatuses = [];
                statuses.forEach(function (status) {
                    taskExecStatuses.push(status);
                });

                form.cmbTaskStatus.displayList = taskExecStatuses;
                form.cmbTaskStatus.displayField = "description";
            },
            function (e) {
                P.Logger.severe(e);
            });
    }

    var warrantStatuses = [];
    function initWarrantStatusCombo() {
        oc.getTransportStatuses(
            function (statuses) {
                warrantStatuses = [];
                statuses.forEach(function (status) {
                    warrantStatuses.push(status);
                });

                form.cmbWarrantStatus.displayList = warrantStatuses;
                form.cmbWarrantStatus.displayField = "description";
            },
            function (e) {
                P.Logger.severe(e);
            });
    }
    
    /**
     * Снимает все наряды с проишествия
     * @param {type} event
     * @returns {undefined}
     */
    form.btnRemoveAllWarrants.onActionPerformed = function (event) {
        var selectedTasks = API.selectedTasks;// form.grdTasks.selected;
        if (selectedTasks.length !== 1) {
            alert("Необходимо выбрать одно происшествие");
            return;
        }
        oc.removeWarrant(
                null,
                selectedTasks[0].id,
                new Date(),
                function () {
                    API.updateTasks();
                    API.updateWarrants();
                    alert("Операция выполнена");
                },
                function (e) {
                    P.Logger.severe(e);
                });
    };
    
    /**
     * Снимает с проишествия выбранный наряд
     * @param {type} event
     * @returns {undefined}
     */
    form.btnRemoveWarrant.onActionPerformed = function (event) {
        var selectedWarrants = API.selectedWarrants;//form.grdWarrants.selected;
        var selectedTasks = API.selectedTasks;//form.grdTasks.selected;
        if (selectedWarrants.length !== 1 || selectedTasks.length !== 1) {
            alert("Необходимо выбрать происшествие и наряд");
            return;
        }
        if (selectedWarrants[0].curentTaskId != null &&
                selectedWarrants[0].curentTaskId == selectedTasks[0].id) {
            oc.removeWarrant(
                    selectedWarrants[0].id,
                    selectedTasks[0].id,
                    new Date(),
                    function () {
                        API.updateTasks();
                        API.updateWarrants();
                        alert("Операция выполнена");
                    },
                    function (e) {
                        P.Logger.severe(e);
                    });
        } else
            alert("Необходимо выбрать связанные происшествие и наряд");
    };
    
    /**
     * Задать наряд на проишествие
     * @param {type} event
     * @returns {undefined}
     * TODO проверять выбрано ли одно проишествие, и если выбрано несколько нарядов пробегаться по всем
     */
    form.btnSetWarrant.onActionPerformed = function (event) {
        var selectedWarrants = API.selectedWarrants;//form.grdWarrants.selected;
        var selectedTasks = API.selectedTasks;//form.grdTasks.selected;
        if (selectedWarrants.length !== 1 || selectedTasks.length !== 1) {
            alert("Необходимо выбрать происшествие и наряд");
            return;
        }
        oc.setWarrant(
                selectedWarrants[0].id,
                selectedTasks[0].id,
                new Date(),
                function () {
                    API.updateTasks();
                    API.updateWarrants();
                    alert("Операция привязки выполнена");
                },
                function (e) {
                    P.Logger.severe(e);
                });
    };
    
    /**
     * Сменить статус наряда
     * @param {type} event
     * @returns {undefined}
     */
    form.btnChangeSelectedWarrantsStatus.onActionPerformed = function (event) {
        var selectedWarrants = API.selectedWarrants;//form.grdWarrants.selected;
        if (!selectedWarrants.length) {
            alert("Необходимо выбрать наряды");
            return;
        }
        var selectedWarrantStatus = form.cmbWarrantStatus.value;
        if (!selectedWarrantStatus) {
            alert("Необходимо выбрать статус наряда");
            return;
        }

        oc.changePoliceWarrantsStatus(
                selectedWarrants,
                selectedWarrantStatus,
                function () {
                    
                },
                function (e) {
                    P.Logger.severe(e);
                });
    };
    
    
    /**
     * Сменить статус проишествия
     * @param {type} event
     * @returns {undefined}
     */
    form.btnChangeSelectedTasksStatus.onActionPerformed = function (event) {
        var selectedTasks = API.selectedTasks;//form.grdTasks.selected;
        if (!selectedTasks.length) {
            alert("Необходимо выбрать происшествия");
            return;
        }
        var selectedTaskStatus = form.cmbTaskStatus.value;
        if (!selectedTaskStatus) {
            alert("Необходимо выбрать статус происшествия");
            return;
        }

        oc.changePoliceTasksStatus(
                selectedTasks,
                selectedTaskStatus,
                function () {
                    
                },
                function (e) {
                    P.Logger.severe(e);
                });
    };
}
