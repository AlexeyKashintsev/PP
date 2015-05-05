P.require("server/libs/http.js");

var DateFormatClass = Java.type("java.text.SimpleDateFormat");
var DateClass = Java.type("java.util.Date");
var LocaleClass = Java.type("java.util.Locale");
var URLEncoderClass = Java.type("java.net.URLEncoder");

function dateToString(aDate) {
    if (aDate !== null) {
        var sdf = new DateFormatClass("MMM dd, yyyy hh:mm:ss a", LocaleClass.ENGLISH);
        var now = new DateClass(aDate.getTime());
        return sdf.format(now);
    } else {
        return null;
    }
}

function stringToDate(aValue) {
    if (aValue !== null) {
        var sdf = new DateFormatClass("MMM dd, yyyy hh:mm:ss a", LocaleClass.ENGLISH);
        try {
            return new Date(sdf.parse(aValue).getTime());
        } catch (e) {
            return null;
        }
    } else {
        return null;
    }
}

/** (date) -> date <br> 
 * Возвращает начало дня, соответствующего заданной дате.
 * @param aDate Параметр типа date.
 * @return Значение типа date, соответствующее дате <i>aDate</i> со значением времени, установленным в 00:00:00:000.<br>
 * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.
 */
function beginOfDay(aDate) {
    if (aDate) {
        var dt = new Date(aDate.getTime());
        dt.setHours(0, 0, 0, 0);
        return dt;
    }
    return null;
}

/** (date) -> date <br>
 * Возвращает конец дня, соответствующего заданной дате.
 * @param aDate Параметр типа date.
 * @return Значение типа date, соответствующее дате <i>aDate</i> со значением времени, установленным в 23:59:59:999.<br>
 * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.
 */
function endOfDay(aDate) {
    if (aDate) {
        var dt = new Date(aDate.getTime());
        dt.setHours(23, 59, 59, 999);
        return dt;
    }
    return null;
}

/** (date, number) -> date <br> 
 * Возвращает значение параметра <i>aDate</i> типа date, увеличенное на количество часов <i>hoursAmount</i>.
 * При необходимости значения месяца или года изменяются автоматически.
 * @param aDate Параметр типа date, значение которого надо увеличить.
 * @param hoursAmount Параметр типа number. Количество часов, на которое увеличивается дата <i>aDate</i>.
 * Если значение меньше 0, то значение параметра <i>aDate</i> уменьшается.
 * @return Значение параметра <i>aDate</i> типа date, увеличенное на количество часов <i>hoursAmount</i>.<br>
 * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.<br>
 * Если параметр <i>hoursAmount</i> не определен, то функция вернет значение параметра <i>aDate</i>.
 */
function incHour(aDate, hoursAmount) {
    if (aDate) {
        if (hoursAmount) {
            var dt = new Date(aDate.getTime());
            dt.setHours(dt.getHours() + hoursAmount);
            return dt;
        } else
            return aDate;
    }
    return null;
}

/** (date, number) -> date <br>
 * Возвращает значение параметра <i>aDate</i> типа date, увеличенное на количество дней <i>daysAmount</i>.
 * При необходимости значения месяца или года изменяются автоматически.
 * @param aDate Параметр типа date, значение которого надо увеличить.
 * @param daysAmount Параметр типа number. Количество дней, на которое увеличивается дата <i>aDate</i>.
 * Если значение меньше 0, то значение параметра <i>aDate</i> уменьшается.
 * @return Значение параметра <i>aDate</i> типа date, увеличенное на количество дней <i>daysAmount</i>. Время остается без изменений.<br>
 * Если параметр <i>aDate</i> не определен, то функция вернет <code>null</code>.<br>
 * Если параметр <i>daysAmount</i> не определен, то функция вернет значение параметра <i>aDate</i>. 
 */
function incDay(aDate, daysAmount) {
    if (aDate) {
        if (daysAmount) {
            var dt = new Date(aDate.getTime());
            dt.setDate(dt.getDate() + daysAmount);
            return dt;
        } else
            return aDate;
    }
    return null;
}

function InvocationContext() {
    this.clientIPAddress = '192.169.1.49';
    this.initiator = 'oper-info-front-end';
    this.userName = 'admin';
    this.password = '9v3/5IyQjesPTDvTbAMucg==';
}

// Тест
var inforUrl = 'http://infor.trans-monitor.ru:9393/vms-ws/rest/';

function SecurityWS() {
    var iContext = new InvocationContext();

    this.getUser = function (onSuccess, onFailure) {
        Http.post(inforUrl + 'SecurityWS/getUser', JSON.stringify([iContext]), function (aResponse) {
            var loaded = JSON.parse(aResponse);
            onSuccess(loaded);
        }, function (e) {
            if (onFailure)
                onFailure(e);
            else
                P.Logger.severe(e);
        });
    };
}

function SystemParameterListWS() {
    var iContext = new InvocationContext();

    this.getWorkPlaceRuntimeParameters = function (workplaceId, onSuccess, onFailure) {
        Http.post(inforUrl + 'SystemParameterListWS/getWorkPlaceRuntimeParameters', JSON.stringify([iContext, workplaceId]),
                function (aResponse) {
                    var loaded = JSON.parse(aResponse);
                    //onSuccess(loaded && loaded.objList ? loaded.objList : []);
                    onSuccess(loaded);
                    //onSuccess(aResponse);
                },
                function (e) {
                    if (onFailure)
                        onFailure(e);
                    else
                        P.Logger.severe(e);
                });
    };
}

function TransportStatusWS() {
    var iContext = new InvocationContext();

    this.getList = function (onSuccess, onFailure) {
        var criteria = {
            beginIndex: 0,
            count: 2147483647,
            listSort: [{direction: "ASC", name: "description"}],
            loadDeletedItems: 0
        };
        Http.post(inforUrl + 'TransportStatusWS/getList', JSON.stringify([iContext, criteria]), function (aResponse) {
            var loaded = JSON.parse(aResponse);
            onSuccess(loaded && loaded.objList ? loaded.objList : []);
        }, function (e) {
            if (onFailure)
                onFailure(e);
            else
                P.Logger.severe(e);
        });
    };
}

function PoliceTaskExecWS() {
    var iContext = new InvocationContext();

    this.getList = function (onSuccess, onFailure) {
        var criteria = {
            beginIndex: 0,
            count: 2147483647,
            listSort: [{direction: "ASC", name: "description"}],
            loadDeletedItems: 0
        };
        Http.post(inforUrl + 'PoliceTaskExecWS/getList', JSON.stringify([iContext, criteria]), function (aResponse) {
            var loaded = JSON.parse(aResponse);
            onSuccess(loaded && loaded.objList ? loaded.objList : []);
        }, function (e) {
            if (onFailure)
                onFailure(e);
            else
                P.Logger.severe(e);
        });
    };
}

function DispositionPlanWS() {
    var self = this;
    var iContext = new InvocationContext();
    self.pageSize = 20;

    this.getList = function (onSuccess, onFailure) {
        var criteria = {
            beginIndex: 0,
            count: self.pageSize,
            loadDeletedItems: 0,
            activeOnDate: dateToString(new Date(Date.now()))
        };
        Http.post(inforUrl + 'DispositionPlanWS/getList', JSON.stringify([iContext, criteria]), function (aResponse) {
            var loaded = JSON.parse(aResponse);
            onSuccess(loaded && loaded.objList ? loaded.objList : []);
        }, function (e) {
            if (onFailure)
                onFailure(e);
            else
                P.Logger.severe(e);
        });
    };
}

function PolicePostWS() {
    var iContext = new InvocationContext();

    this.getList = function (dispositionPlanId, onSuccess, onFailure) {
        var criteria = {
            beginIndex: 0,
            count: 2147483647,
            loadDeletedItems: 0,
            planIdList: [dispositionPlanId]
        };
        Http.post(inforUrl + 'PolicePostWS/getList', JSON.stringify([iContext, criteria]), function (aResponse) {
            var loaded = JSON.parse(aResponse);
            onSuccess(loaded && loaded.objList ? loaded.objList : []);
        }, function (e) {
            if (onFailure)
                onFailure(e);
            else
                P.Logger.severe(e);
        });
    };

    this.getCurrentObject = function (postId, onSuccess, onFailure) {
        Http.post(inforUrl + 'PolicePostWS/getCurrentObject', JSON.stringify([iContext, postId]), function (aResponse) {
            var loaded = JSON.parse(aResponse);
            onSuccess(loaded);
        }, function (e) {
            if (onFailure)
                onFailure(e);
            else
                P.Logger.severe(e);
        });
    };
}

function PoliceTaskWS() {
    var iContext = new InvocationContext();

    this.getList = function (onSuccess, onFailure) {
        var criteria = {
            beginIndex: 0,
            count: 2147483647,
            loadDeletedItems: 0,
            activeOnDate: dateToString(new Date(Date.now()))
        };
        Http.post(inforUrl + 'PoliceTaskWS/getList', JSON.stringify([iContext, criteria]), function (aResponse) {
            var loaded = JSON.parse(aResponse);
            onSuccess(loaded && loaded.objList ? loaded.objList : []);
        }, function (e) {
            if (onFailure)
                onFailure(e);
            else
                P.Logger.severe(e);
        });
    };

    this.save = function (policeTask, onSuccess, onFailure) {
        //P.Logger.info('PoliceTaskWS/save request: ' + JSON.stringify([iContext, policeTask]));
        Http.post(inforUrl + 'PoliceTaskWS/save', JSON.stringify([iContext, policeTask]), function (aResponse) {
            //P.Logger.info('PoliceTaskWS/save response: ' + aResponse);
            var saved = JSON.parse(aResponse);
            onSuccess(saved);
        }, function (e) {
            if (onFailure)
                onFailure(e);
            else
                P.Logger.severe(e);
        });
    };
}

function PoliceWarrantUIWS() {
    var iContext = new InvocationContext();

    this.getList = function (onSuccess, onFailure) {
        var criteria = {
            beginIndex: 0,
            count: 2147483647,
            loadDeletedItems: 0,
            activeOnDate: dateToString(new Date(Date.now()))
        };
        Http.post(inforUrl + 'PoliceWarrantUIWS/getList', JSON.stringify([iContext, criteria]), function (aResponse) {
            var loaded = JSON.parse(aResponse);
            onSuccess(loaded && loaded.objList ? loaded.objList : []);
        }, function (e) {
            if (onFailure)
                onFailure(e);
            else
                P.Logger.severe(e);
        });
    };
}

function PoliceWarrantWS() {
    var iContext = new InvocationContext();

    this.updateWarrantTaskById = function (warrantId, taskId, dt, onSuccess, onFailure) {
        Http.post(inforUrl + 'PoliceWarrantWS/updateWarrantTaskById',
                JSON.stringify([iContext, warrantId, taskId, dateToString(dt)]), function (aResponse) {
            var loaded = JSON.parse(aResponse);
            onSuccess(loaded);
        }, function (e) {
            if (onFailure)
                onFailure(e);
            else
                P.Logger.severe(e);
        });
    };
}


function PoliceSubdivisionWS() {
    var iContext = new InvocationContext();

    this.getList = function (onSuccess, onFailure) {
        var criteria = {
            beginIndex: 0,
            count: 2147483647,
            loadDeletedItems: 0
        };
        Http.post(inforUrl + 'PoliceSubdivisionWS/getList', JSON.stringify([iContext, criteria]), function (aResponse) {
            var loaded = JSON.parse(aResponse);
            onSuccess(loaded && loaded.objList ? loaded.objList : []);
        }, function (e) {
            if (onFailure)
                onFailure(e);
            else
                P.Logger.severe(e);
        });
    };
}

function TransportWS() {
    var iContext = new InvocationContext();

    this.updateTransportStatusById = function (transportId, transportStatusId, onSuccess, onFailure) {
        Http.post(inforUrl + 'TransportWS/updateTransportStatusById',
                JSON.stringify([iContext, transportId, transportStatusId]),
                function (aResponse) {
                    var loaded = JSON.parse(aResponse);
                    onSuccess(loaded && loaded.objList ? loaded.objList : []);
                },
                function (e) {
                    if (onFailure)
                        onFailure(e);
                    else
                        P.Logger.severe(e);
                });
    };
}

function PoliceWarrant2TaskLinkWS() {
    var iContext = new InvocationContext();
    
    this.closeWarrant2Task = function (warrantId, taskId, dt, onSuccess, onFailure) {
        Http.post(inforUrl + 'PoliceWarrant2TaskLinkWS/closeWarrant2Task',
                JSON.stringify([iContext, warrantId, taskId, dateToString(dt)]), function (aResponse) {
            var loaded = JSON.parse(aResponse);
            onSuccess(loaded);
        }, function (e) {
            if (onFailure)
                onFailure(e);
            else
                P.Logger.severe(e);
        });
    };   
}
