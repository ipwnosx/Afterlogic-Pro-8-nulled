(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[22],{

/***/ "2jPS":
/*!****************************************************!*\
  !*** ./modules/OutlookSyncWebclient/js/manager.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (oAppData) {
	var App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5");
	
	if (App.isUserNormalOrTenant())
	{
		var
			TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),

			Settings = __webpack_require__(/*! modules/OutlookSyncWebclient/js/Settings.js */ "rRhg")
		;

		Settings.init(oAppData);

		return {
			start: function (ModulesManager) {
				ModulesManager.run('SettingsWebclient', 'registerSettingsTab', [function () { return __webpack_require__(/*! modules/OutlookSyncWebclient/js/views/OutlookSyncSettingsPaneView.js */ "FTKR"); }, Settings.HashModuleName, TextUtils.i18n('OUTLOOKSYNCWEBCLIENT/LABEL_SETTINGS_TAB')]);
			}
		};
	}
	
	return null;
};


/***/ }),

/***/ "FTKR":
/*!******************************************************************************!*\
  !*** ./modules/OutlookSyncWebclient/js/views/OutlookSyncSettingsPaneView.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	
	Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "o0Bx"),
	Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "JFZZ"),
	App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
	ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "OgeD"),
	UserSettings = __webpack_require__(/*! modules/CoreWebclient/js/Settings.js */ "hPb3"),
	
	Settings = __webpack_require__(/*! modules/OutlookSyncWebclient/js/Settings.js */ "rRhg")
;

/**
 * @constructor
 */
function COutlookSyncSettingsPaneView()
{
	this.oCreateLoginPasswordView = ModulesManager.run('OAuthIntegratorWebclient', 'getCreateLoginPasswordView');
	
	this.server = ko.observable('');
	
	this.bDemo = UserSettings.IsDemo;

	this.sPluginDownloadLink = Settings.PluginDownloadLink;
	this.sPluginReadMoreLink = Settings.PluginReadMoreLink;

	this.credentialsHintText = App.mobileCredentialsHintText;
}

COutlookSyncSettingsPaneView.prototype.ViewTemplate = 'OutlookSyncWebclient_OutlookSyncSettingsPaneView';

COutlookSyncSettingsPaneView.prototype.showTab = function ()
{
	Ajax.send(Settings.ServerModuleName, 'GetInfo', null, this.onGetInfoResponse, this);
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
COutlookSyncSettingsPaneView.prototype.onGetInfoResponse = function (oResponse, oRequest)
{
	var oResult = oResponse.Result;
	
	if (!oResult || !oResult.Dav)
	{
		Api.showErrorByCode(oResponse);
	}
	else
	{
		this.server(oResult.Dav.Server);
	}
};

module.exports = new COutlookSyncSettingsPaneView();


/***/ }),

/***/ "rRhg":
/*!*****************************************************!*\
  !*** ./modules/OutlookSyncWebclient/js/Settings.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	
	Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "AFLV")
;

module.exports = {
	ServerModuleName: 'MobileSync',
	HashModuleName: 'outlooksync',
	
	PluginDownloadLink: '',
	PluginReadMoreLink: '',
	
	/**
	 * Initializes settings from AppData object sections.
	 * 
	 * @param {Object} oAppData Object contained modules settings.
	 */
	init: function (oAppData)
	{
		var oAppDataSection = oAppData['OutlookSyncWebclient'];
		
		if (!_.isEmpty(oAppDataSection))
		{
			this.PluginDownloadLink = Types.pString(oAppDataSection.PluginDownloadLink, this.PluginDownloadLink);
			this.PluginReadMoreLink = Types.pString(oAppDataSection.PluginReadMoreLink, this.PluginReadMoreLink);
		}
	}
};


/***/ })

}]);