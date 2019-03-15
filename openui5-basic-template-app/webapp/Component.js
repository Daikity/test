sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"./model/models",
	"sap/base/Log",
	"sap/m/MessageBox",
	"./localService/mockserver"
	
], function(UIComponent, Device, models, Log, MessageBox, mockserver) {
	"use strict";

	// initialize the mock server
	mockserver.init().catch(function (oError) {
		MessageBox.error(oError.message);
	}).finally(function () {
		// initialize the embedded component on the HTML page
		sap.ui.require(["sap/ui/core/ComponentSupport"]);
	});

	return UIComponent.extend("webapp.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			// create the views based on the url/hash
			this.getRouter().initialize();
		}
	});
});