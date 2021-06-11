'use strict';

var
	$ = require('jquery'),
	ko = require('knockout'),
	
	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
	UrlUtils = require('%PathToCoreWebclientModule%/js/utils/Url.js'),
	
	Ajax = require('%PathToCoreWebclientModule%/js/Ajax.js'),
	Api = require('%PathToCoreWebclientModule%/js/Api.js'),
	App = require('%PathToCoreWebclientModule%/js/App.js'),
	Browser = require('%PathToCoreWebclientModule%/js/Browser.js'),
	ModulesManager = require('%PathToCoreWebclientModule%/js/ModulesManager.js'),
	UserSettings = require('%PathToCoreWebclientModule%/js/Settings.js'),
	
	Settings = require('modules/%ModuleName%/js/Settings.js')
;

/**
 * @constructor
 */
function CMobileSyncSettingsPaneView()
{
	this.oMailMobileSyncSettingsView = ModulesManager.run('MailWebclient', 'getMobileSyncSettingsView');
	this.oFilesMobileSyncSettingsView = ModulesManager.run('FilesWebclient', 'getMobileSyncSettingsView');
	this.oCalendarMobileSyncSettingsView = ModulesManager.run('CalendarWebclient', 'getMobileSyncSettingsView');
	this.oContactsMobileSyncSettingsView = ModulesManager.run('ContactsWebclient', 'getMobileSyncSettingsView');
	
	this.oCreateLoginPasswordView = ModulesManager.run('OAuthIntegratorWebclient', 'getCreateLoginPasswordView');
	
	this.enableDav = ko.observable(false);
	
	this.showSyncViaUrlSection = ko.computed(function () {
		return this.enableDav() && (ModulesManager.isModuleEnabled('CalendarWebclient') || ModulesManager.isModuleEnabled('ContactsWebclient'));
	}, this);
	
	this.sSyncViaUrlSectionInfo = this.getSyncViaUrlSectionInfo();
	this.sSyncViaUrlIOSDeviceSectionInfo = TextUtils.i18n('%MODULENAME%/INFO_DAVSYNC_IOS_DEVICE', {
		'WEBMAIL_URL': UrlUtils.getAppPath()
	});
	
	this.davServer = ko.observable('');
	
	this.bIosDevice = Browser.iosDevice;
	this.bDemo = UserSettings.IsDemo;
	
	this.visibleDavViaUrls = ko.computed(function () {
		return !!this.oCalendarMobileSyncSettingsView && this.oCalendarMobileSyncSettingsView.visible() || !!this.oContactsMobileSyncSettingsView;
	}, this);
	
	this.credentialsHintText = App.mobileCredentialsHintText;
}

CMobileSyncSettingsPaneView.prototype.ViewTemplate = '%ModuleName%_MobileSyncSettingsPaneView';

CMobileSyncSettingsPaneView.prototype.showTab = function ()
{
	Ajax.send(Settings.ServerModuleName, 'GetInfo', null, this.onGetInfoResponse, this);
};

/**
 * Returns info text for "Sync via URL" section
 * 
 * @returns {String}
 */
CMobileSyncSettingsPaneView.prototype.getSyncViaUrlSectionInfo = function ()
{
	var
		bAllowCalendar = ModulesManager.isModuleEnabled('CalendarWebclient'),
		bAllowContacts = ModulesManager.isModuleEnabled('ContactsWebclient')
	;
	
	if (bAllowCalendar && bAllowContacts)
	{
		return TextUtils.i18n('%MODULENAME%/INFO_DAVSYNC');
	}
	if (bAllowCalendar)
	{
		return TextUtils.i18n('%MODULENAME%/INFO_DAVSYNC_CALENDAR_ONLY');
	}
	if (bAllowContacts)
	{
		return TextUtils.i18n('%MODULENAME%/INFO_DAVSYNC_CONTACTS_ONLY');
	}
	return '';
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CMobileSyncSettingsPaneView.prototype.onGetInfoResponse = function (oResponse, oRequest)
{
	var
		oResult = oResponse.Result,
		oDav = !!oResult.EnableDav ? oResult.Dav : null
	;
	
	if (!oResult)
	{
		Api.showErrorByCode(oResponse);
	}
	else
	{
		this.enableDav(!!oResult.EnableDav);

		if (this.enableDav() && oDav)
		{
			this.davServer(oDav.Server);
			if (this.oFilesMobileSyncSettingsView && $.isFunction(this.oFilesMobileSyncSettingsView.populate))
			{
				this.oFilesMobileSyncSettingsView.populate(oDav);
			}
			if (this.oCalendarMobileSyncSettingsView && $.isFunction(this.oCalendarMobileSyncSettingsView.populate))
			{
				this.oCalendarMobileSyncSettingsView.populate(oDav);
			}
			if (this.oContactsMobileSyncSettingsView && $.isFunction(this.oContactsMobileSyncSettingsView.populate))
			{
				this.oContactsMobileSyncSettingsView.populate(oDav);
			}
		}
	}
};

module.exports = new CMobileSyncSettingsPaneView();
