sap.ui.define([
	"webapp/controller/BaseController"
], function (BaseController) {
	"use strict";
	return BaseController.extend("webapp.controller.persons.Persons", {
		onInit: function () {
			var oRouter = this.getRouter();
			oRouter.getRoute("persons").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched : function (oEvent) {
			var oArgs, oView;
			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();

            

			oView.bindElement({
				path : "/People/" + oArgs.employeeID ,
				events : {
					change: this._onBindingChange.bind(this),
					dataRequested: function (oEvent) {
						oView.setBusy(true);
					},
					dataReceived: function (oEvent) {
						oView.setBusy(false);
					}
				}
            });
            
            console.log(11111111111111111111)
		},
		_onBindingChange : function (oEvent) {
            // No data for the binding
			if (!this.getView().getBindingContext()) {
				this.getRouter().getTargets().display("notFound");
			}
		}
	});
});