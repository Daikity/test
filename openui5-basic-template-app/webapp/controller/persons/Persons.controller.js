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
		getOData: function (oArgs){
			var jsModel = this.jPersModel;
			var res;
			/*
			*	createKey version is return 500 error message. 
			*	please, just use "read" method and don't whory :)
			*
				var qKey = { 
					Pernr: oArgs.Pernr,
					Label: oArgs.Label,
					Value: oArgs.Value 
				};
				var sKey = this.ServModel.createKey('/Emps', qKey);

				this.ServModel.read(sKey, qKey, {
					success: function(oData){
						console.log(oData)
						res = oData.results.filter(function(el){
							return el.Pernr == oArgs.Pernr
						})
						jsModel.setProperty("/User", res[0]);
					}.bind(this),
					error: function(){
						MessageBox.error("Ошибка чтения данных!");
					}
				});
			*/

			/*
			*	no createKey method
			*/
			this.ServModel.read("/Emps", {
				success: function(oData){
					res = oData.results.filter(function(el){
						return el.Pernr == oArgs.Pernr
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