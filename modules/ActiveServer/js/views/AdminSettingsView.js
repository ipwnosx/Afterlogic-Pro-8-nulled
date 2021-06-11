'use strict';

var
	_ = require('underscore'),
	ko = require('knockout'),
	
	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
	Types = require('%PathToCoreWebclientModule%/js/utils/Types.js'),
	Ajax = require('%PathToCoreWebclientModule%/js/Ajax.js'),
	
	ModulesManager = require('%PathToCoreWebclientModule%/js/ModulesManager.js'),
	CAbstractSettingsFormView = ModulesManager.run('AdminPanelWebclient', 'getAbstractSettingsFormViewClass'),
	
	Settings = require('modules/%ModuleName%/js/Settings.js')
;

/**
* @constructor
*/
function CActiveServerAdminSettingsView()
{
	CAbstractSettingsFormView.call(this, Settings.ServerModuleName);

	this.enable = ko.observable(Settings.EnableModule);
	this.enableForNewUsers = ko.observable(Settings.EnableForNewUsers);
	this.usersNumber = ko.observable(Settings.UsersCount);
	this.usersNumberLicensed = ko.observable(Settings.LicensedUsersCount);
	this.usersFreeSlots = ko.observable(Settings.UsersFreeSlots);
	this.licenseType = ko.observable('');
	this.server = ko.observable(Settings.Server);
	this.linkToManual = ko.observable(Settings.LinkToManual);
}

_.extendOwn(CActiveServerAdminSettingsView.prototype, CAbstractSettingsFormView.prototype);

CActiveServerAdminSettingsView.prototype.ViewTemplate = '%ModuleName%_AdminSettingsView';

CActiveServerAdminSettingsView.prototype.getCurrentValues = function()
{
	return [
		this.usersNumber(),
		this.usersNumberLicensed(),
		this.usersFreeSlots()
	];
};

CActiveServerAdminSettingsView.prototype.revertGlobalValues = function()
{
//	this.appName(Settings.AppName);
};

CActiveServerAdminSettingsView.prototype.getParametersForSave = function ()
{
	return {
		'EnableModule': this.enable(),
		'EnableForNewUsers': this.enableForNewUsers(),
		'Server': this.server(),
		'LinkToManual': this.linkToManual()
	};
};

/**
 * Applies saved values to the Settings object.
 * 
 * @param {Object} oParameters Parameters which were saved on the server side.
 */
CActiveServerAdminSettingsView.prototype.applySavedValues = function (oParameters)
{
	Settings.updateAdmin(oParameters.EnableModule, oParameters.EnableForNewUsers, oParameters.Server);
};

/**
 * Sets access level for the view via entity type and entity identifier.
 * This view is visible only for empty entity type.
 * 
 * @param {string} sEntityType Current entity type.
 * @param {number} iEntityId Indentificator of current intity.
 */
CActiveServerAdminSettingsView.prototype.setAccessLevel = function (sEntityType, iEntityId)
{
	this.visible(sEntityType === '');
};

CActiveServerAdminSettingsView.prototype.getLicenseInfo = function()
{
	Ajax.send(Settings.ServerModuleName, 'GetLicenseInfo', {}, function (oResponse) {
		var
			sLicenseType = TextUtils.i18n('LICENSINGWEBCLIENT/LABEL_TYPE_INVALID'),
			oData = oResponse && oResponse.Result
		;
		
		if (oData)
		{
			switch (oData.Type)
			{
				case 0:
					sLicenseType = TextUtils.i18n('LICENSINGWEBCLIENT/LABEL_TYPE_UNLIM');
					break;
				case 1:
					sLicenseType = TextUtils.i18n('LICENSINGWEBCLIENT/LABEL_TYPE_PERMANENT_PLURAL', { 'COUNT' : oData.Count }, null, oData.Count);
					break;
				case 2:
					sLicenseType = TextUtils.i18n('LICENSINGWEBCLIENT/LABEL_TYPE_DOMAINS_PLURAL', { 'COUNT' : oData.Count }, null, oData.Count);
					break;
				case 4:
					if (oData.ExpiresIn < 1)
					{
						sLicenseType = TextUtils.i18n('LICENSINGWEBCLIENT/LABEL_TYPE_OUTDATED_INFO');
					}
					break;
				case 3:
				case 10:
					sLicenseType = oData.Type === 3
						? TextUtils.i18n('LICENSINGWEBCLIENT/LABEL_TYPE_ANNUAL_PLURAL', { 'COUNT' : oData.Count }, null, oData.Count)
						: TextUtils.i18n('LICENSINGWEBCLIENT/LABEL_TYPE_TRIAL');
					if (oData.ExpiresIn !== '*')
					{
						if (oData.ExpiresIn > 0)
						{
							sLicenseType += TextUtils.i18n('LICENSINGWEBCLIENT/LABEL_TYPE_EXPIRES_IN_PLURAL', { 'DAYS' : oData.ExpiresIn }, null, oData.ExpiresIn);
						}
						else
						{
							sLicenseType += TextUtils.i18n('LICENSINGWEBCLIENT/LABEL_TYPE_EXPIRED') + ' ' + TextUtils.i18n('LICENSINGWEBCLIENT/LABEL_TYPE_OUTDATED_INFO');
						}
					}
					break;
			}
		}
		else
		{
			if (Settings.LicenseKey === '')
			{
				sLicenseType = TextUtils.i18n('LICENSINGWEBCLIENT/LABEL_TYPE_NOT_SET');
			}
		}
		
		this.licenseType(sLicenseType);
	}, this);
};


/**
 * Executes when routing was changed.
 * @param {array} aParams Routing parameters.
 */
CActiveServerAdminSettingsView.prototype.onRouteChild = function (aParams)
{
	this.getLicenseInfo();
};

module.exports = new CActiveServerAdminSettingsView();
