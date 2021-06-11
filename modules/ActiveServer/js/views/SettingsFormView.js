'use strict';

var
	_ = require('underscore'),
	ko = require('knockout'),
	
	ModulesManager = require('%PathToCoreWebclientModule%/js/ModulesManager.js'),
	CAbstractSettingsFormView = ModulesManager.run('SettingsWebclient', 'getAbstractSettingsFormViewClass'),
	
	Settings = require('modules/%ModuleName%/js/Settings.js'),
	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
	App = require('%PathToCoreWebclientModule%/js/App.js'),
	UserSettings = require('%PathToCoreWebclientModule%/js/Settings.js')
;

/**
 * Inherits from CAbstractSettingsFormView that has methods for showing and hiding settings tab,
 * updating settings values on the server, checking if there was changins on the settings page.
 * 
 * @constructor
 */
function SettingsFormView()
{
	CAbstractSettingsFormView.call(this, Settings.ServerModuleName);

	this.server = ko.observable(Settings.Server);
	this.linkToManual = ko.observable(Settings.LinkToManual);
	this.infoCredentials = TextUtils.i18n('%MODULENAME%/INFO_CREDENTIALS', {'EMAIL': App.getUserPublicId()});
	this.bDemo = UserSettings.IsDemo;
	this.infoDemo = TextUtils.i18n('%MODULENAME%/INFO_DEMO', {'PRODUCT_NAME': Settings.ProductName});
}

_.extendOwn(SettingsFormView.prototype, CAbstractSettingsFormView.prototype);

/**
 * Name of template that will be bound to this JS-object. 'SimpleChatWebclient' - name of the object,
 * 'SimpleChatSettingsFormView' - name of template file in 'templates' folder.
 */
SettingsFormView.prototype.ViewTemplate = '%ModuleName%_SettingsFormView';

/**
 * Returns array with all settings values wich is used for indicating if there were changes on the page.
 * 
 * @returns {Array} Array with all settings values;
 */
SettingsFormView.prototype.getCurrentValues = function ()
{
	return [
		this.server()
	];
};

/**
 * Reverts all settings values to global ones.
 */
SettingsFormView.prototype.revertGlobalValues = function ()
{
	this.server(Settings.Server);
};

module.exports = new SettingsFormView();
