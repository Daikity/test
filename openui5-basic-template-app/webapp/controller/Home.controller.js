sap.ui.define([
	"webapp/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"../model/formatter"
	
], function(BaseController, Filter, FilterOperator, formatter) {
	"use strict";

	return BaseController.extend("webapp.controller.App", {

		formatter: formatter,

		onInit: function () {
			var oRouter = this.getRouter();
			this._oTable = this.byId("peopleList");
			this._sSearchQuery = null;
			this._oRouterArgs = null;

			oRouter.getRoute("home").attachMatched(this._onRouteMatched, this);

			
		},

		_onRouteMatched : function (oEvent) {
			
			this._oRouterArgs = oEvent.getParameter("arguments");
			this._oRouterArgs.query = this._oRouterArgs["?query"] || {};

			if (this._oRouterArgs.query) {
				
				this._applySearchFilter(this._oRouterArgs.query.search);
			}
			
		},
		_applySearchFilter : function (sSearchQuery) {
			var aFilters, oFilter, oBinding;

			// first check if we already have this search value
			if (this._sSearchQuery === sSearchQuery) {
				return;
			}
			this._sSearchQuery = sSearchQuery;
			this.byId("searchField").setValue(sSearchQuery);

			// add filters for search
			aFilters = [];
			if (sSearchQuery && sSearchQuery.length > 0) {
				aFilters.push(new Filter("FirstName", FilterOperator.Contains, sSearchQuery));
				aFilters.push(new Filter("LastName", FilterOperator.Contains, sSearchQuery));
				oFilter = new Filter({ filters: aFilters, and: false });  // OR filter
			} else {
				oFilter = null;
			}

			// update list binding
			oBinding = this._oTable.getBinding("items");
			oBinding.filter(oFilter, "Application");
		},
		onSearchEmployeesTable : function (oEvent) {
			var oRouter = this.getRouter();
			
			this._oRouterArgs.query.search = oEvent.getSource().getValue();
			oRouter.navTo("home",this._oRouterArgs, true);
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