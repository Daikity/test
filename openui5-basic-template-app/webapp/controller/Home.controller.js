sap.ui.define([
	"webapp/controller/BaseController",
	"../model/formatter"
	
], function(BaseController, formatter, ) {
	"use strict";

	return BaseController.extend("webapp.controller.App", {

		formatter: formatter,

		onInit: function () {
		},

		onNext : function (oEvent) {
			var oTable = new sap.m.Table("peopleList");
			var oTableSource = oTable.getSource();
			console.log(oTableSource);
		},
		onColumnListItemPressed: function(oEvent){
			var oItem = oEvent.getSource();
			var oCtx = oItem.getBindingContext();
			var paginPage = 1;

			//console.log(oCtx.getProperty());
			
			this.getRouter().navTo("persons", {
				employeeID		: oCtx.getProperty("EmployeeID")
			});
		}
	});
});