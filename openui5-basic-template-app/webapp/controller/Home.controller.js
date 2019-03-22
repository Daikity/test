sap.ui.define([
	"webapp/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"../model/formatter",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
	
], function(BaseController, Filter, FilterOperator, formatter, MessageBox, JSONModel) {
	"use strict";

	return BaseController.extend("webapp.controller.App", {

		formatter: formatter,

		onInit: function () {
			this.oRouters = this.getRouter();
			this.ServModel = this.getSrvModel("empl");
			this.jPaginPages = new JSONModel();
			this.jModel = new JSONModel();
			
			this.jModel.setProperty("/canBack", false);
			this.getOData();
		},
		

		onItemPressed:function(oEvent){
			var oItem = oEvent.getSource();
			var oCtx = oItem.getBindingContext();
			
			this.getRouter().navTo("persons", {
				Pernr: oCtx.getProperty("Pernr"),
				Label: oCtx.getProperty("Label"),
				Value: oCtx.getProperty("Value")
			});
		},

		getOData: function (){
			this.jModel.setProperty("/page", 1);
			this.ServModel.read('/Emps', {
				success: function(oData){
					oData.results.forEach((el, i) => {
						el.id = (i+1)
					});
					this.jModel.setProperty("/Users", oData);
					this.jModel.setProperty("/page", 0 );
					this.onNext();
				}.bind(this),
				error: function(){
					MessageBox.error("Ошибка чтения данных!");
				}
			});
			this.getView().setModel(this.jModel);
		},
		onNext: function (oE) {
			var page = this.jModel.getData().page;
			var fullData = this.jModel.getData().Users.results;
			if(oE){
				var id = oE.getSource().getId();
				id = id.split('---home--')[1];
			}
			
			switch (id) {
				case "incBtn":	page = Number(page)+1;
					break;
				case "decBtn": page = Number(page)-1;
					break;
				default: page = Number(page)+1;
					break;
			}

			this.jModel.setProperty("/page", page );
			
			var showElms = fullData.filter(function(el) {
				return el.id <= 5*page;
			});
			
			if(showElms[0].id > 5 || showElms.length > 5){
				showElms = showElms.filter(function(el, ind){
					return el.id > ( showElms.length - 5 )
				})
			}
			this.jModel.setProperty("/UsersPagin", showElms);
			this.checkCanBack();
			this.getView().setModel(this.jModel);
		},
		checkCanBack: function(){			
			var data = this.jModel.getData().UsersPagin;
			var btnBack = this.byId("decBtn");

			if(data[0].id && data[0].id != 1) 
				this.jModel.setProperty("/canBack", true);
			else
				this.jModel.setProperty("/canBack", false);
			
			btnBack.setEnabled(this.jModel.getData().canBack);
		},
		onColumnListItemPressed: function(oEvent){
			var oItem = oEvent.getSource();
			var oCtx = oItem.getBindingContext();
			var aFilters = [];

			aFilters.push(new Filter("EmployeeID", FilterOperator.Contains, oCtx.getProperty("EmployeeID")));
			var oFilter = new Filter({ filters: aFilters, and: false });
			var oBinding = this._oTable.getBinding("items");
			oBinding.filter(oFilter, "Application");
			
			this.getRouter().navTo("persons", {
				employeeID		: oCtx.getProperty("EmployeeID")
			});
		}
	});
});