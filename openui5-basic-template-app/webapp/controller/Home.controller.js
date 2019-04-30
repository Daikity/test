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
			this.jModel.setProperty("/canNext", true);
			this.getOData();
		},
		

		onItemPressed:function(oEvent){
			var oItem = oEvent.getSource();
			var oCtx = oItem.getBindingContext();
			console.log(oCtx.getProperty('PERSNO'))
			var navToData = {
				PERSNO: oCtx.getProperty("PERSNO"),
			};
			
			this.getRouter().navTo("persons", navToData, false);
		},

		getOData: function (){
			this.jModel.setProperty("/page", 0);
			this.jModel.setProperty("/MAXPernr", 5);
			this.ServModel.read('/PERNRSet', {
				success: function(oData){
					oData.results.forEach((el, i) => {
						el.id = (i+1)
					});
					this.jModel.setProperty("/Users", oData);
					this.onNext();
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
			this.getView().setModel(this.jModel);
		},
		onNext: function (oE) {
			var btnBack = this.byId("decBtn");
			var btnNext = this.byId("incBtn");
			var page = this.jModel.getData().page;
			var maxpernr = this.jModel.getData().MAXPernr;
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
				default: page = Number(page);
					break;
			}
			
			this.jModel.setProperty("/page", page );
			
			var _start = page * maxpernr,
				_end = _start + maxpernr;
			var showElms = fullData.slice(_start, _end);
			
			this.jModel.setProperty("/canBack", _start !== 0);
			this.jModel.setProperty("/canNext", _end !== fullData.length);

			btnBack.setEnabled(this.jModel.getData().canBack);
			btnNext.setEnabled(this.jModel.getData().canNext);

			this.jModel.setProperty("/UsersPagin", showElms);

			this.getView().setModel(this.jModel);
		}
	});
});