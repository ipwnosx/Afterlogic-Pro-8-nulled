'use strict';

var
	_ = require('underscore'),
	ko = require('knockout'),
	
	ModulesManager = require('%PathToCoreWebclientModule%/js/ModulesManager.js'),
	CAbstractSettingsFormView = ModulesManager.run('AdminPanelWebclient', 'getAbstractSettingsFormViewClass'),
	
	Settings = require('modules/%ModuleName%/js/Settings.js')
;

/**
* @constructor
*/
function CDavAdminSettingsView()
{
	CAbstractSettingsFormView.call(this, Settings.ServerDavModuleName);
	
	/* Editable fields */
	this.davServer = ko.observable(Settings.ExternalHostNameOfDAVServer);
	/*-- Editable fields */
}

_.extendOwn(CDavAdminSettingsView.prototype, CAbstractSettingsFormView.prototype);

CDavAdminSettingsView.prototype.ViewTemplate = '%ModuleName%_DavAdminSettingsView';

CDavAdminSettingsView.prototype.getCurrentValues = function()
{
	return [
		this.davServer()
	];
};

CDavAdminSettingsView.prototype.revertGlobalValues = function()
{
	this.davServer(Settings.ExternalHostNameOfDAVServer);
};

CDavAdminSettingsView.prototype.getParametersForSave = function ()
{
	return {
		'ExternalHostNameOfDAVServer': this.davServer()
	};
};

/**
 * Applies saved values to the Settings object.
 * 
 * @param {Object} oParameters Parameters which were saved on the server side.
 */
CDavAdminSettingsView.prototype.applySavedValues = function (oParameters)
{
	Settings.update(oParameters.ExternalHostNameOfDAVServer);
};

CDavAdminSettingsView.prototype.setAccessLevel = function (sEntityType, iEntityId)
{
	this.visible(sEntityType === '');
};

module.exports = new CDavAdminSettingsView();
