sap.ui.define([
	"webapp/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController,JSONModel) {
	"use strict";
	return BaseController.extend("webapp.controller.persons.Persons", {
		onInit: function () {
			this.jPersModel = new JSONModel();
			this.ServModel = this.getSrvModel("empl");
			this.oRouter = this.getRouter();

			this.oRouter.getRoute("persons").attachMatched(this._onRouteMatched, this);
		},
		getOData: function (pern){
			var jsModel = this.jPersModel;
			var res;
			this.ServModel.read('/Emps', {
				success: function(oData){
					res = oData.results.filter(function(el){
						return el.Pernr == pern.Pernr
					})
					jsModel.setProperty("/User", res[0]);
				}.bind(this),
				error: function(){
					MessageBox.error("Ошибка чтения данных!");
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