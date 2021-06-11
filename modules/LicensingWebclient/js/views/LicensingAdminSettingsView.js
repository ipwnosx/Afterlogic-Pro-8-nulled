'use strict';

var
	_ = require('underscore'),
	ko = require('knockout'),
	
	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
	Types = require('%PathToCoreWebclientModule%/js/utils/Types.js'),
	
	Ajax = require('%PathToCoreWebclientModule%/js/Ajax.js'),
	Api = require('%PathToCoreWebclientModule%/js/Api.js'),
	Screens = require('%PathToCoreWebclientModule%/js/Screens.js'),
	ModulesManager = require('%PathToCoreWebclientModule%/js/ModulesManager.js'),
	UserSettings = require('%PathToCoreWebclientModule%/js/Settings.js'),
	
	Settings = require('modules/%ModuleName%/js/Settings.js'),
	
	CAbstractSettingsFormView = ModulesManager.run('AdminPanelWebclient', 'getAbstractSettingsFormViewClass')
;

/**
* @constructor
*/
function CLicensingAdminSettingsView()
{
	CAbstractSettingsFormView.call(this, Settings.ServerModuleName);
	
	/* Editable fields */
	this.licenseKey = ko.observable(Settings.LicenseKey);
	/*-- Editable fields */
	
	this.usersNumber = ko.observable(0);
	this.licenseType = ko.observable('');
	
	this.sTrialKeyHint = Settings.TrialKeyLink ? TextUtils.i18n('%MODULENAME%/LABEL_LICENSING_TRIAL_KEY_HINT', { 'LINK' : Settings.TrialKeyLink }) : '';
	this.sPermanentKeyHint = Settings.PermanentKeyLink ? TextUtils.i18n('%MODULENAME%/LABEL_LICENSING_PERMANENT_KEY_HINT', { 'LINK' : Settings.PermanentKeyLink }) : '';
	
	this.showTrialKeyHint = ko.observable(Settings.LicenseKey === '' && this.sTrialKeyHint !== '');
}

_.extendOwn(CLicensingAdminSettingsView.prototype, CAbstractSettingsFormView.prototype);

CLicensingAdminSettingsView.prototype.ViewTemplate = '%ModuleName%_LicensingAdminSettingsView';

/**
 * Executes when routing was changed.
 * @param {array} aParams Routing parameters.
 */
CLicensingAdminSettingsView.prototype.onRouteChild = function (aParams)
{
	var bDbNotConfigured = (UserSettings.DbLogin === '' || UserSettings.DbName === '' || UserSettings.DbHost === '');
	if (!bDbNotConfigured)
	{
		Ajax.send('Core', 'GetTotalUsersCount', {}, function (oResponse) {
			if (oResponse && Types.isNumber(oResponse.Result) && oResponse.Result >= 0)
			{
				this.usersNumber(oResponse.Result);
			}
			else
			{
				Api.showErrorByCode(oResponse);
			}
		}, this);
	}
	this.getLicenseInfo();
};

CLicensingAdminSettingsView.prototype.getLicenseInfo = function()
{
	Ajax.send(Settings.ServerModuleName, 'GetLicenseInfo', {}, function (oResponse) {
		var
			sLicenseType = TextUtils.i18n('%MODULENAME%/LABEL_TYPE_INVALID'),
			oData = oResponse && oResponse.Result
		;
		
		if (oData)
		{
			switch (oData.Type)
			{
				case 0:
					sLicenseType = TextUtils.i18n('%MODULENAME%/LABEL_TYPE_UNLIM');
					break;
				case 1:
					sLicenseType = TextUtils.i18n('%MODULENAME%/LABEL_TYPE_PERMANENT_PLURAL', { 'COUNT' : oData.Count }, null, oData.Count);
					break;
				case 2:
					sLicenseType = TextUtils.i18n('%MODULENAME%/LABEL_TYPE_DOMAINS_PLURAL', { 'COUNT' : oData.Count }, null, oData.Count);
					break;
				case 4:
					if (oData.ExpiresIn < 1)
					{
						sLicenseType = TextUtils.i18n('%MODULENAME%/LABEL_TYPE_OUTDATED_INFO');
					}
					break;
				case 3:
				case 10:
					sLicenseType = oData.Type === 3
						? TextUtils.i18n('%MODULENAME%/LABEL_TYPE_ANNUAL_PLURAL', { 'COUNT' : oData.Count }, null, oData.Count)
						: TextUtils.i18n('%MODULENAME%/LABEL_TYPE_TRIAL');
					if (oData.ExpiresIn !== '*')
					{
						if (oData.ExpiresIn > 0)
						{
							sLicenseType += TextUtils.i18n('%MODULENAME%/LABEL_TYPE_EXPIRES_IN_PLURAL', { 'DAYS' : oData.ExpiresIn }, null, oData.ExpiresIn);
						}
						else
						{
							sLicenseType += TextUtils.i18n('%MODULENAME%/LABEL_TYPE_EXPIRED') + ' ' + TextUtils.i18n('%MODULENAME%/LABEL_TYPE_OUTDATED_INFO');
						}
					}
					break;
			}
			this.showTrialKeyHint(false);
		}
		else
		{
			if (Settings.LicenseKey === '')
			{
				sLicenseType = TextUtils.i18n('%MODULENAME%/LABEL_TYPE_NOT_SET');
			}
			this.showTrialKeyHint(this.sTrialKeyHint !== '');
		}
		
		this.licenseType(sLicenseType);
	}, this);
};

CLicensingAdminSettingsView.prototype.getCurrentValues = function()
{
	return [
		this.licenseKey()
	];
};

CLicensingAdminSettingsView.prototype.revertGlobalValues = function()
{
	this.licenseKey(Settings.LicenseKey);
};

CLicensingAdminSettingsView.prototype.getParametersForSave = function ()
{
	return {
		'LicenseKey': this.licenseKey()
	};
};

/**
 * @param {Object} oParameters
 */
CLicensingAdminSettingsView.prototype.applySavedValues = function (oParameters)
{
	this.getLicenseInfo();
	Settings.update(oParameters.LicenseKey);
};

CLicensingAdminSettingsView.prototype.setAccessLevel = function (sEntityType, iEntityId)
{
	this.visible(sEntityType === '');
};

CLicensingAdminSettingsView.prototype.onResponse = function (oResponse, oRequest)
{
	this.isSaving(false);
	if (!oResponse.Result)
	{
		Api.showErrorByCode(oResponse, TextUtils.i18n('COREWEBCLIENT/ERROR_SAVING_SETTINGS_FAILED'));
	}
	else
	{
		var oParameters = oRequest.Parameters;
		
		this.updateSavedState();

		this.applySavedValues(oParameters);
		if (oResponse.SubscriptionsResult && Object.keys(oResponse.SubscriptionsResult).length > 0)
		{
			var aErrorMessages = _.map(
				oResponse.SubscriptionsResult, 
				function (obj) { 
					return obj.ErrorMessage;
				}
			);

			Screens.showError(TextUtils.i18n('COREWEBCLIENT/REPORT_SETTINGS_UPDATE_SUCCESS') + '[' + aErrorMessages.join(', ') + ']');
		}
		else
		{
			Screens.showReport(TextUtils.i18n('COREWEBCLIENT/REPORT_SETTINGS_UPDATE_SUCCESS'));
		}
	}

}

module.exports = new CLicensingAdminSettingsView();
