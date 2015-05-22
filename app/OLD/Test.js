/**
 * 
 */
function Test() {
    var self = this
            , model = P.loadModel(this.constructor.name)
            , form = P.loadForm(this.constructor.name, model);

    var operInfoProxy = new P.ServerModule("OperInfoProxy");
    self.show = function () {
        P.require('client/libs/leaflet.js', function () {
            // geom.js depends on leaflet.js
            P.require('client/libs/geom.js', function () {
                var containerElement = document.getElementById("OperInfoView");
                form.view.showOn(containerElement);
            });
        });
    };

    model.requery(function () {
        // TODO : place your code here
    });

    form.button.onActionPerformed = function (event) {
        form.txtTest.text = "";
/*
        operInfoProxy.getCoordinatesDownTown(
                function (response) {
                    for (var i in response){
                        form.txtTest.text += i + "=" + response[i] + ' ';
                    }                    
                },
                function (e) {
                    form.txtTestError.text = e;
                });                

        operInfoProxy.getTransportStatuses(
                function (statuses) {
                    statuses.forEach(function(status){
                        form.txtTest.text += status.description + '\n';
                    });
                },
                function (e) {
                    form.txtTestError.text = e;
                });
            };

        operInfoProxy.getPoliceTaskExec(
                function (statuses) {
                    statuses.forEach(function(status){
                        form.txtTest.text += status.description + '\n';
                    });
                },
                function (e) {
                    form.txtTestError.text = e;
                });

        operInfoProxy.getDispositionPlans(
                function (plans) {
                    plans.forEach(function(plan){
                        form.txtTest.text += plan.name + ' ' + plan.beginDate + ' ' + plan.endDate;
                    });
                },
                function (e) {
                    form.txtTestError.text = e;
                });

        operInfoProxy.getDispositionPlans(
                function (plans) {
                    if(plans.length > 0){
                        operInfoProxy.getPolicePosts(
                            plans[0].id,    
                            function (posts) {
                                posts.forEach(function(post){
                                    form.txtTest.text += post.id + "\n";
                                });
                            },
                            function (e) {
                                form.txtTestError.text = e;
                            });                        
                    }
                },
                function (e) {
                    form.txtTestError.text = e;
                });
*/
        operInfoProxy.getDispositionPlans(
                function (plans) {
                    if(plans.length > 0){
                        operInfoProxy.getPolicePosts(
                            plans[0].id,    
                            function (posts) {
                                if(posts.length > 0){
                                    operInfoProxy.getPolicePost(
                                            posts[0].id,
                                            function (post) {
                                                form.txtTest.text = post.id + " " + post.secureSubdivision.description;
                                            },
                                            function (e) {
                                                form.txtTestError.text = e;
                                            });
                                }
                            },
                            function (e) {
                                form.txtTestError.text = e;
                            });                        
                    }
                },
                function (e) {
                    form.txtTestError.text = e;
                });

    };
}
