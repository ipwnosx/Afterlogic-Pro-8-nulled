(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[50],{

/***/ "O7io":
/*!***********************************************************!*\
  !*** ./modules/ActiveServer/js/views/SettingsFormView.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	
	ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "OgeD"),
	CAbstractSettingsFormView = ModulesManager.run('SettingsWebclient', 'getAbstractSettingsFormViewClass'),
	
	Settings = __webpack_require__(/*! modules/ActiveServer/js/Settings.js */ "ll04"),
	TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
	App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
	UserSettings = __webpack_require__(/*! modules/CoreWebclient/js/Settings.js */ "hPb3")
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
	this.infoCredentials = TextUtils.i18n('ACTIVESERVER/INFO_CREDENTIALS', {'EMAIL': App.getUserPublicId()});
	this.bDemo = UserSettings.IsDemo;
	this.infoDemo = TextUtils.i18n('ACTIVESERVER/INFO_DEMO', {'PRODUCT_NAME': Settings.ProductName});
}

_.extendOwn(SettingsFormView.prototype, CAbstractSettingsFormView.prototype);

/**
 * Name of template that will be bound to this JS-object. 'SimpleChatWebclient' - name of the object,
 * 'SimpleChatSettingsFormView' - name of template file in 'templates' folder.
 */
SettingsFormView.prototype.ViewTemplate = 'ActiveServer_SettingsFormView';

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


/***/ }),

/***/ "h0hg":
/*!********************************************!*\
  !*** ./modules/ActiveServer/js/manager.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (oAppData) {
	var
		TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),

		App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
				
		Settings = __webpack_require__(/*! modules/ActiveServer/js/Settings.js */ "ll04")
	;
	
	Settings.init(oAppData);
	
	if (App.getUserRole() === Enums.UserRole.SuperAdmin)
	{
		return {
			/**
			 * Registers admin settings tabs before application start.
			 * 
			 * @param {Object} ModulesManager
			 */
			start: function (ModulesManager)
			{
				ModulesManager.run('AdminPanelWebclient', 'registerAdminPanelTab', [
					function(resolve) {
						__webpack_require__.e(/*! require.ensure | admin-bundle */ 13).then((function() {
								resolve(__webpack_require__(/*! modules/ActiveServer/js/views/PerUserAdminSettingsView.js */ "iQb4"));
							}).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
					},
					Settings.HashModuleName + '-user',
					TextUtils.i18n('ACTIVESERVER/LABEL_SETTINGS_TAB_SYNC')
				]);
				ModulesManager.run('AdminPanelWebclient', 'registerAdminPanelTab', [
					function(resolve) {
						__webpack_require__.e(/*! require.ensure | admin-bundle */ 13).then((function() {
								resolve(__webpack_require__(/*! modules/ActiveServer/js/views/AdminSettingsView.js */ "rzO8"));
							}).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
					},
					Settings.HashModuleName + '-system',
					TextUtils.i18n('ACTIVESERVER/LABEL_SETTINGS_TAB')
				]);
			}
		};
	}
	if (App.isUserNormalOrTenant())
	{
		var
			TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F")
		;

		Settings.init(oAppData);
		
		return {
			/**
			 * Registers settings tab of a module before application start.
			 * 
			 * @param {Object} ModulesManager
			 */
			start: function (ModulesManager) {
				if (Settings.EnableModuleForUser)
				{
					ModulesManager.run('SettingsWebclient', 'registerSettingsTab', [function () { return __webpack_require__(/*! modules/ActiveServer/js/views/SettingsFormView.js */ "O7io"); }, Settings.HashModuleName, TextUtils.i18n('ACTIVESERVER/LABEL_SETTINGS_TAB')]);
				}
			}
		};
	}	
	
	return null;
};


/***/ }),

/***/ "ll04":
/*!*********************************************!*\
  !*** ./modules/ActiveServer/js/Settings.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	
	Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "AFLV")
;

module.exports = {
	ServerModuleName: 'ActiveServer',
	HashModuleName: 'activeserver',
	EnableModule: false,
	EnableModuleForUser: false,
	EnableForNewUsers: false,
	UsersCount: 0,
	LicensedUsersCount: 0,
	UsersFreeSlots: 0,
	Server: '',
	LinkToManual: '',
	ProductName: '',
	
	/**
	 * Initializes settings from AppData object sections.
	 * 
	 * @param {Object} oAppData Object contained modules settings.
	 */
	init: function (oAppData)
	{
		var 
			oAppDataSection = oAppData['ActiveServer'],
			oAppDataCoreSection = oAppData['Core']
		;
		
		if (!_.isEmpty(oAppDataSection))
		{
			this.EnableModule = Types.pBool(oAppDataSection.EnableModule, this.EnableModule);
			this.EnableModuleForUser = Types.pBool(oAppDataSection.EnableModuleForUser, this.EnableModuleForUser);
			this.EnableForNewUsers = Types.pBool(oAppDataSection.EnableForNewUsers, this.EnableForNewUsers);
			this.UsersCount = Types.pInt(oAppDataSection.UsersCount, this.UsersCount);
			this.LicensedUsersCount = oAppDataSection.LicensedUsersCount;
			this.UsersFreeSlots = oAppDataSection.UsersFreeSlots;
			this.Server = oAppDataSection.Server;
			this.LinkToManual = oAppDataSection.LinkToManual;
			this.ProductName = oAppDataCoreSection.ProductName;
		}		
	},
	
	updateAdmin: function (sEnableModule, sEnableForNewUsers, sServer, sLinkToManual)
	{
		this.EnableModule = sEnableModule;
		this.EnableForNewUsers = sEnableForNewUsers;
		this.Server = sServer;
		this.LinkToManual = sLinkToManual;
	}
};


/***/ })

}]);