/**
 * 
 */
function OperInfoView() {
    var self = this
            , model = P.loadModel(this.constructor.name)
            , form = P.loadForm(this.constructor.name, model);

    var operInfoProxy = new P.ServerModule("OperInfoProxy");

    var operInfoMapView = new OperInfoMapView();

    self.show = function () {
        initCombos();
        initGrids();
        operInfoMapView.showOnPanel(form.pnlOperInfoMap);
        var containerElement = document.getElementById("OperInfoView");
        form.view.showOn(containerElement);
    };

    model.requery(function () {
        // TODO : place your code here
    });

    function initCombos() {
        initTaskStatusCombo();
        initWarrantStatusCombo();
    }

    var taskExecStatuses = [];
    function initTaskStatusCombo() {
        operInfoProxy.getPoliceTaskExec(
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
        operInfoProxy.getTransportStatuses(
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

    function initGrids() {
        initTaskGrid();
        initWarrantGrid();
        //initSubdivisionGrid();
    }

    var listT = [], viewT = [], incidents = [], listenIdTask = [];
    function initTaskGrid() {
        listT = [];
        viewT = [];
        incidents = [];
        listenIdTask = [];
        operInfoProxy.getFilteredPoliceTasks(
                function (tasks) {
                    tasks.forEach(function (task) {
                        operInfoMapView.API.newTask(task);
                        listT.push(task);
                        listenIdTask.push(task.id);
                        if (!incidents[task.incident.id])
                            incidents[task.incident.id] = task.incident;
                    });
                    form.grdTasks.data = listT;
                    form.grdTasks.colCreateDate.field = "createdDateTime";
                    form.grdTasks.colTaskType.field = "type.description";
                    form.grdTasks.colIncident.field = "incident.description";
                    form.grdTasks.colStatus.field = "exec.description";
                },
                function (e) {
                    P.Logger.severe(e);
                });
    }

    var listW = [], warrantsBySubdivId = [], view = [], viewId = [], kinds = [];
    function initWarrantGrid() {
        listW = [];
        warrantsBySubdivId = [];
        view = [];
        viewId = [];
        kinds = [];
        operInfoProxy.getPoliceWarrants(
                function (warrants) {
                    warrants.forEach(function (warrant) {
                        listW.push(warrant);
                        if (!kinds[warrant.postWarrantKind.id])
                            kinds[warrant.postWarrantKind.id] = warrant.postWarrantKind;
                        if (warrant.policeSubdivisionId) {
                            if (!warrantsBySubdivId[warrant.policeSubdivisionId]) {
                                warrantsBySubdivId[warrant.policeSubdivisionId] = [];
                            }
                            warrantsBySubdivId[warrant.policeSubdivisionId].push(JSON.parse(JSON.stringify(warrant)));
                        }
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
                    
                    initSubdivisionGrid();
                },
                function (e) {
                    P.Logger.severe(e);
                });
    }

    var subdivisions = null;
    function initSubdivisionGrid() {
        operInfoProxy.getPoliceSubdivisions(
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
            if (warrantsBySubdivId[obj.id] && warrantsBySubdivId[obj.id].length) {
                warrantsBySubdivId[obj.id].forEach(function (warrant) {
                    warrant.description = warrant.num;
                    warrant.parent = obj;
                    warrant.children = [];
                    obj.children.push(warrant);
                    treeGridSource.push(warrant);
                });
            }
            treeGridSource.push(obj);
        });

        treeGridSource.push(root);
        return treeGridSource;
    }


    form.btnChangeSelectedTasksStatus.onActionPerformed = function (event) {
        var selectedTasks = form.grdTasks.selected;
        if (!selectedTasks.length) {
            alert("Необходимо выбрать происшествия");
            return;
        }
        var selectedTaskStatus = form.cmbTaskStatus.value;
        if (!selectedTaskStatus) {
            alert("Необходимо выбрать статус происшествия");
            return;
        }

        operInfoProxy.changePoliceTasksStatus(
                selectedTasks,
                selectedTaskStatus,
                function () {
                    initTaskGrid();
                },
                function (e) {
                    P.Logger.severe(e);
                });
    };
    form.btnChangeSelectedWarrantsStatus.onActionPerformed = function (event) {
        var selectedWarrants = form.grdWarrants.selected;
        if (!selectedWarrants.length) {
            alert("Необходимо выбрать наряды");
            return;
        }
        var selectedWarrantStatus = form.cmbWarrantStatus.value;
        if (!selectedWarrantStatus) {
            alert("Необходимо выбрать статус наряда");
            return;
        }

        operInfoProxy.changePoliceWarrantsStatus(
                selectedWarrants,
                selectedWarrantStatus,
                function () {
                    initWarrantGrid();
                },
                function (e) {
                    P.Logger.severe(e);
                });
    };

    form.btnSetWarrant.onActionPerformed = function (event) {
        var selectedWarrants = form.grdWarrants.selected;
        var selectedTasks = form.grdTasks.selected;
        if (selectedWarrants.length !== 1 || selectedTasks.length !== 1) {
            alert("Необходимо выбрать происшествие и наряд");
            return;
        }
        operInfoProxy.setWarrant(
                selectedWarrants[0].id,
                selectedTasks[0].id,
                new Date(),
                function () {
                    alert("Операция привязки выполнена");
                },
                function (e) {
                    P.Logger.severe(e);
                });
    };

    form.btnRemoveWarrant.onActionPerformed = function (event) {
        var selectedWarrants = form.grdWarrants.selected;
        var selectedTasks = form.grdTasks.selected;
        if (selectedWarrants.length !== 1 || selectedTasks.length !== 1) {
            alert("Необходимо выбрать происшествие и наряд");
            return;
        }
        if (selectedWarrants[0].curentTaskId != null &&
                selectedWarrants[0].curentTaskId == selectedTasks[0].id) {
            operInfoProxy.removeWarrant(
                    selectedWarrants[0].id,
                    selectedTasks[0].id,
                    new Date(),
                    function () {
                        initTaskGrid();
                        alert("Операция выполнена");
                    },
                    function (e) {
                        P.Logger.severe(e);
                    });
        } else
            alert("Необходимо выбрать связанные происшествие и наряд");
    };

    form.btnRemoveAllWarrants.onActionPerformed = function (event) {
        var selectedTasks = form.grdTasks.selected;
        if (selectedTasks.length != 1) {
            alert("Необходимо выбрать одно происшествие");
            return;
        }
        operInfoProxy.removeWarrant(
                null,
                selectedTasks[0].id,
                new Date(),
                function () {
                    initTaskGrid();
                    alert("Операция выполнена");
                },
                function (e) {
                    P.Logger.severe(e);
                });
    };
    
    var callsData = new CallsData();
    form.btnWarrantCall.onActionPerformed = function(event) {
        callsData.show(); // TODO run single copy
    };
    form.btnSubdivisionCall.onActionPerformed = function(event) {
        callsData.show(); // TODO run single copy
    };
}
