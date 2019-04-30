sap.ui.define([
	"webapp/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
], function (BaseController,JSONModel,MessageBox) {
	"use strict";
	return BaseController.extend("webapp.controller.persons.Persons", {
		onInit: function () {
			this.jPersModel = new JSONModel();
			this.ServModel = this.getSrvModel("empl");
			this.oRouter = this.getRouter();

			this.oRouter.getRoute("persons").attachMatched(this._onRouteMatched, this);
		},
		getOData: function (oArgs){
			var jsModel = this.jPersModel;

			var sKey = this.ServModel.createKey('/PERNRSet', { PERSNO: oArgs.PERSNO });
			this.ServModel.read(sKey, {
				success: function(oData){
					jsModel.setProperty("/User", oData);
				}.bind(this),
				error: function(error){
					var json = JSON.parse(error.responseText).error;
					
					var errMessage = error.message+'\n\n';
					errMessage += json.message.value+'\n\n';
					errMessage += json.innererror.Error_Resolution.SAP_Note+'\n\n';
					errMessage += json.innererror.Error_Resolution.SAP_Transaction+'\n\n';

					MessageBox.error(errMessage, {
						title: error.statusCode+':'+error.statusText,
					});
					
				}
			});			
			this.getView().setModel(jsModel);
		},
		_onRouteMatched : function (oEvent) {
			var oArgs = oEvent.getParameter("arguments");
			this.getOData(oArgs);
		}
	});
});