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
            form.lbStartTime.text = warrantData.postWarrantKind.description;
            form.lbPost.text = warrantData.postWarrantKind.description;
            form.lbPost.text = warrantData.postWarrantKind.description;
            form.lbPost.text = warrantData.postWarrantKind.description;
            oc.getPoliceWarrant2TaskLinksList([], [warrantData.id], function(aLinks) {
                console.log(aLinks);
            }, function(anError) {
                throw 'Ошибка: ' + anError;
            });
        } catch (e) {
            console.log('Ошибка ' + e);
        }
    };    
}
