(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[53],{

/***/ "Vk54":
/*!*************************************************!*\
  !*** ./modules/BrandingWebclient/js/manager.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (oAppData) {
	__webpack_require__(/*! modules/CoreWebclient/js/vendors/jquery.cookie.js */ "fJbT");
	
	var
		TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
		
		App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
		
		Settings = __webpack_require__(/*! modules/BrandingWebclient/js/Settings.js */ "iIt5")
	;
	
	Settings.init(oAppData);

	if (App.getUserRole() === Enums.UserRole.SuperAdmin || App.getUserRole() === Enums.UserRole.TenantAdmin)
	{
		return {
			start: function (ModulesManager) {
				ModulesManager.run('AdminPanelWebclient', 'registerAdminPanelTab', [
					function(resolve) {
						__webpack_require__.e(/*! require.ensure | admin-bundle */ 13).then((function() {
								resolve(__webpack_require__(/*! modules/BrandingWebclient/js/views/AdminSettingsView.js */ "u+3T"));
							}).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
					},
					Settings.HashModuleName,
					TextUtils.i18n('BRANDINGWEBCLIENT/ADMIN_SETTINGS_TAB_LABEL')
				]);
			}
		};
	}
	
	return null;
};


/***/ }),

/***/ "iIt5":
/*!**************************************************!*\
  !*** ./modules/BrandingWebclient/js/Settings.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	
	Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "AFLV")
;

module.exports = {
	ServerModuleName: 'BrandingWebclient',
	HashModuleName: 'branding',
	
	LoginLogo: '',
	TabsbarLogo: '',
	
	/**
	 * Initializes settings from AppData object sections.
	 * 
	 * @param {Object} oAppData Object contained modules settings.
	 */
	init: function (oAppData)
	{
		var oAppDataSection = oAppData['BrandingWebclient'];
		
		if (!_.isEmpty(oAppDataSection))
		{
			this.LoginLogo = Types.pString(oAppDataSection['LoginLogo'], this.LoginLogo);
			this.TabsbarLogo = Types.pString(oAppDataSection['TabsbarLogo'], this.TabsbarLogo);
		}
	},

	/**
	 * Updates new settings values after saving on server.
	 * 
	 * @param {array} aParameters
	 */
	update: function (aParameters)
	{
		if (!_.isEmpty(aParameters))
		{
			this.LoginLogo = aParameters['LoginLogo'];
			this.TabsbarLogo = aParameters['TabsbarLogo']
		}
	}
};


/***/ })

}]);