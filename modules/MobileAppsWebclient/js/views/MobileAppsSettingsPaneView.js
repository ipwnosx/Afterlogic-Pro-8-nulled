'use strict';

var
	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
	UrlUtils = require('%PathToCoreWebclientModule%/js/utils/Url.js'),

	App = require('%PathToCoreWebclientModule%/js/App.js'),

	Settings = require('modules/%ModuleName%/js/Settings.js')
;

/**
 * @constructor
 */
function CMobileAppsSettingsPaneView()
{
	this.sAppPath = UrlUtils.getAppPath();

	this.sMailSectionName = Settings.MailSectionName || TextUtils.i18n('%MODULENAME%/HEADING_MAIL_APP');
	this.bShowMailServerUrlApp = Settings.ShowMailServerUrlApp;
	this.bShowMailIosApp = Settings.ShowMailIosApp && Settings.MailIosAppLink !== '';
	this.sMailIosApp = Settings.MailIosAppLink;
	this.bShowMailAndroidApp = Settings.ShowMailAndroidApp && Settings.MailAndroidAppLink !== '';
	this.sMailAndroidApp = Settings.MailAndroidAppLink;
	this.bShowMailSection = this.bShowMailIosApp || this.bShowMailAndroidApp;

	this.sFilesSectionName = Settings.FilesSectionName || TextUtils.i18n('%MODULENAME%/HEADING_FILES_APP');
	this.bShowFilesServerUrlApp = Settings.ShowFilesServerUrlApp;
	this.bShowFilesAndroidApp = Settings.ShowFilesAndroidApp && Settings.FilesAndroidAppLink !== '';
	this.sFilesAndroidAppLink = Settings.FilesAndroidAppLink;
	this.bShowFilesIosApp = Settings.ShowFilesIosApp && Settings.FilesIosAppLink !== '';
	this.sFilesIosAppLink = Settings.FilesIosAppLink;
	this.bShowFilesWinApp = Settings.ShowFilesWinApp && Settings.FilesWinAppLink !== '';
	this.sFilesWinAppLink = Settings.FilesWinAppLink;
	this.bShowFilesSection = this.bShowFilesAndroidApp || this.bShowFilesIosApp || this.bShowFilesWinApp;
}

CMobileAppsSettingsPaneView.prototype.ViewTemplate = '%ModuleName%_MobileAppsSettingsPaneView';

module.exports = new CMobileAppsSettingsPaneView();
