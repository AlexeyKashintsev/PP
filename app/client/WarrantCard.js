/**
 * 
 * @author Алексей
 */
function WarrantCard(parent) {
    var self = this
            , model = P.loadModel(this.constructor.name)
            , form = P.loadForm(this.constructor.name, model);
    

    self.show = function () {
        form.show();
    };
    
    self.showModal = function(callback) {
        form.showModal(callback);
    };
    
    var warrantData = {};
    self.setWarrant = function(aWarrantData) {
        try {
            warrantData = aWarrantData;
            form.lbPost.text = warrantData.postWarrantKind.description;
            form.lbTC.text = warrantData.transportRegnum;
            form.lbForces.text = warrantData.subdivision.description;
            form.lbStartTime.text = warrantData.warrantDate.toLocaleFormat();
            form.lbCallsign.text = warrantData.callsign;
            form.lbStatus.text = warrantData.statusTSname;
            warrantData.officers = [];
            
            oc.getPoliceWarrantsByList([aWarrantData.id], function(aWarrant) {
                if (aWarrant[0].officer1)
                    warrantData.officers.push(aWarrant[0].officer1);
                if (aWarrant[0].officer2)
                    warrantData.officers.push(aWarrant[0].officer2);
                if (aWarrant[0].officer3)
                    warrantData.officers.push(aWarrant[0].officer3);
                form.mgOfficers.data = warrantData.officers;
                form.mgOfficers.colRank.field = 'rank.code';
                form.mgOfficers.colFIO.field = 'fam';
                form.mgOfficers.colJobTitle.field = '';
            }, function(anError) {
                throw 'Ошибка: ' + anError;
            });
            
            oc.getPoliceWarrant2TaskLinksList([], [warrantData.id], function(aLinks) {
                console.log(aLinks);
                form.mgLinkedTasks.data = aLinks;
                form.mgLinkedTasks.colTask.field = 'task.incident.description';
                form.mgLinkedTasks.colExecStage.field = 'task.exec.description';
                form.mgLinkedTasks.colStartTime.field = 'startAt';
//                form.mgLinkedTasks.colTask.field = 'incident.description';
            }, function(anError) {
                throw 'Ошибка: ' + anError;
            });
        } catch (e) {
            console.log('Ошибка ' + e);
        }
    };    
}
