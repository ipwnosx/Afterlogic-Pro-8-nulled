'use strict';

var
	_ = require('underscore'),

	Types = require('%PathToCoreWebclientModule%/js/utils/Types.js')
;

module.exports = {
	ServerModuleName: 'MobileApps',
	HashModuleName: 'mobile-apps',

	FilesSectionName: '',
	ShowFilesServerUrlApp: true,
	ShowFilesAndroidApp: true,
	FilesAndroidAppLink: '',
	ShowFilesIosApp: true,
	FilesIosAppLink: '',
	ShowFilesWinApp: true,
	FilesWinAppLink: '',

	MailSectionName: '',
	ShowMailServerUrlApp: true,
	ShowMailAndroidApp: true,
	MailAndroidAppLink: '',
	ShowMailIosApp: true,
	MailIosAppLink: '',

	/**
	 * Initializes settings from AppData object sections.
	 * 
	 * @param {Object} oAppData Object contained modules settings.
	 */
	init: function (oAppData)
	{
		var oAppDataSection = oAppData['%ModuleName%'];
		if (!_.isEmpty(oAppDataSection))
		{
			this.FilesSectionName = Types.pString(oAppDataSection.FilesSectionName, this.FilesSectionName);
			this.ShowFilesServerUrlApp = Types.pBool(oAppDataSection.ShowFilesServerUrlApp, this.ShowFilesServerUrlApp);
			this.ShowFilesAndroidApp = Types.pBool(oAppDataSection.ShowFilesAndroidApp, this.ShowFilesAndroidApp);
			this.FilesAndroidAppLink = Types.pString(oAppDataSection.FilesAndroidAppLink, this.FilesAndroidAppLink);
			this.ShowFilesIosApp = Types.pBool(oAppDataSection.ShowFilesIosApp, this.ShowFilesIosApp);
			this.FilesIosAppLink = Types.pString(oAppDataSection.FilesIosAppLink, this.FilesIosAppLink);
			this.ShowFilesWinApp = Types.pBool(oAppDataSection.ShowFilesWinApp, this.ShowFilesWinApp);
			this.FilesWinAppLink = Types.pString(oAppDataSection.FilesWinAppLink, this.FilesWinAppLink);

			this.MailSectionName = Types.pString(oAppDataSection.MailSectionName, this.MailSectionName);
			this.ShowMailServerUrlApp = Types.pBool(oAppDataSection.ShowMailServerUrlApp, this.ShowMailServerUrlApp);
			this.ShowMailAndroidApp = Types.pBool(oAppDataSection.ShowMailAndroidApp, this.ShowMailAndroidApp);
			this.MailAndroidAppLink = Types.pString(oAppDataSection.MailAndroidAppLink, this.MailAndroidAppLink);
			this.ShowMailIosApp = Types.pBool(oAppDataSection.ShowMailIosApp, this.ShowMailIosApp);
			this.MailIosAppLink = Types.pString(oAppDataSection.MailIosAppLink, this.MailIosAppLink);
		}
	}
};
