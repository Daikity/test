sap.ui.define([
	"webapp/controller/BaseController",
	"../model/formatter",
	"sap/ui/model/json/JSONModel"
], function(BaseController, formatter, JSONModel) {
	"use strict";

	return BaseController.extend("webapp.controller.App", {

		formatter: formatter,

		onInit: function () {
			var oJSONData = {
				busy : false
			};
			var oModel = new JSONModel(oJSONData);
			this.getView().setModel(oModel, "appView");
		},
	});
});