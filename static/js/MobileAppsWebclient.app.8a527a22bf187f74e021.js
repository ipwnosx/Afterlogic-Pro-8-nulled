(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[10],{

/***/ "/fkj":
/*!****************************************************!*\
  !*** ./modules/MobileAppsWebclient/js/Settings.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),

	Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "AFLV")
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
		var oAppDataSection = oAppData['MobileAppsWebclient'];
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


/***/ }),

/***/ "J2yz":
/*!***************************************************!*\
  !*** ./modules/MobileAppsWebclient/js/manager.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (oAppData) {
	var App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5");

	if (App.isUserNormalOrTenant())
	{
		var
			TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),

			Settings = __webpack_require__(/*! modules/MobileAppsWebclient/js/Settings.js */ "/fkj")
		;

		Settings.init(oAppData);

		return {
			start: function (ModulesManager) {
				ModulesManager.run(
					'SettingsWebclient',
					'registerSettingsTab',
					[
						function () { 
							return __webpack_require__(/*! modules/MobileAppsWebclient/js/views/MobileAppsSettingsPaneView.js */ "Tvnh");
						},
						Settings.HashModuleName,
						TextUtils.i18n('MOBILEAPPSWEBCLIENT/LABEL_SETTINGS_TAB')
					]
				);
			}
		};
	}

	return null;
};


/***/ }),

/***/ "Tvnh":
/*!****************************************************************************!*\
  !*** ./modules/MobileAppsWebclient/js/views/MobileAppsSettingsPaneView.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
	UrlUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Url.js */ "ZP6a"),

	App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),

	Settings = __webpack_require__(/*! modules/MobileAppsWebclient/js/Settings.js */ "/fkj")
;

/**
 * @constructor
 */
function CMobileAppsSettingsPaneView()
{
	this.sAppPath = UrlUtils.getAppPath();

	this.sMailSectionName = Settings.MailSectionName || TextUtils.i18n('MOBILEAPPSWEBCLIENT/HEADING_MAIL_APP');
	this.bShowMailServerUrlApp = Settings.ShowMailServerUrlApp;
	this.bShowMailIosApp = Settings.ShowMailIosApp && Settings.MailIosAppLink !== '';
	this.sMailIosApp = Settings.MailIosAppLink;
	this.bShowMailAndroidApp = Settings.ShowMailAndroidApp && Settings.MailAndroidAppLink !== '';
	this.sMailAndroidApp = Settings.MailAndroidAppLink;
	this.bShowMailSection = this.bShowMailIosApp || this.bShowMailAndroidApp;

	this.sFilesSectionName = Settings.FilesSectionName || TextUtils.i18n('MOBILEAPPSWEBCLIENT/HEADING_FILES_APP');
	this.bShowFilesServerUrlApp = Settings.ShowFilesServerUrlApp;
	this.bShowFilesAndroidApp = Settings.ShowFilesAndroidApp && Settings.FilesAndroidAppLink !== '';
	this.sFilesAndroidAppLink = Settings.FilesAndroidAppLink;
	this.bShowFilesIosApp = Settings.ShowFilesIosApp && Settings.FilesIosAppLink !== '';
	this.sFilesIosAppLink = Settings.FilesIosAppLink;
	this.bShowFilesWinApp = Settings.ShowFilesWinApp && Settings.FilesWinAppLink !== '';
	this.sFilesWinAppLink = Settings.FilesWinAppLink;
	this.bShowFilesSection = this.bShowFilesAndroidApp || this.bShowFilesIosApp || this.bShowFilesWinApp;
}

CMobileAppsSettingsPaneView.prototype.ViewTemplate = 'MobileAppsWebclient_MobileAppsSettingsPaneView';

module.exports = new CMobileAppsSettingsPaneView();


/***/ })

}]);