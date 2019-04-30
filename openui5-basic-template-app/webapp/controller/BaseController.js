sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel"
], function(Controller, History, UIComponent) {
	"use strict";

	return Controller.extend("webapp.BaseController", {
		getSrvModel: function (sName){
			return this.getOwnerComponent().getModel( sName );
		},
		getRouter : function () {
			return UIComponent.getRouterFor(this);
		},

		goBack: function () {
			var oHistory, sPreviousHash;

			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("appHome", {}, true);
			}
		}

	});

});