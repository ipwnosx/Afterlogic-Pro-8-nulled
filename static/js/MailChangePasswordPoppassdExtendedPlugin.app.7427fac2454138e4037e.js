(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[25],{

/***/ "3Y+r":
/*!******************************************************!*\
  !*** ./modules/CoreWebclient/js/utils/Validation.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	
	Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "SQrT"),
	
	ValidationUtils = {}
;

ValidationUtils.checkIfFieldsEmpty = function (aRequiredFields, sErrorText)
{
	var koFirstEmptyField = _.find(aRequiredFields, function (koField) {
		return koField() === '';
	});
	
	if (koFirstEmptyField)
	{
		if (sErrorText)
		{
			Screens.showError(sErrorText);
		}
		koFirstEmptyField.focused(true);
		return false;
	}
	
	return true;
};

ValidationUtils.checkPassword = function (sNewPass, sConfirmPassword)
{
	var
		TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
		Settings = __webpack_require__(/*! modules/CoreWebclient/js/Settings.js */ "hPb3"),
		bPasswordValid = false
	;
	
	if (sConfirmPassword !== sNewPass)
	{
		Screens.showError(TextUtils.i18n('COREWEBCLIENT/ERROR_PASSWORDS_DO_NOT_MATCH'));
	}
	else if (Settings.PasswordMinLength > 0 && sNewPass.length < Settings.PasswordMinLength) 
	{ 
		Screens.showError(TextUtils.i18n('COREWEBCLIENT/ERROR_PASSWORD_TOO_SHORT').replace('%N%', Settings.PasswordMinLength));
	}
	else if (Settings.PasswordMustBeComplex && (!sNewPass.match(/([0-9])/) || !sNewPass.match(/([!,%,&,@,#,$,^,*,?,_,~])/)))
	{
		Screens.showError(TextUtils.i18n('COREWEBCLIENT/ERROR_PASSWORD_TOO_SIMPLE'));
	}
	else
	{
		bPasswordValid = true;
	}
	
	return bPasswordValid;
};

module.exports = ValidationUtils;


/***/ }),

/***/ "45eL":
/*!************************************************************************!*\
  !*** ./modules/MailChangePasswordPoppassdExtendedPlugin/js/manager.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

module.exports = function (oAppData) {
	var
		_ = __webpack_require__(/*! underscore */ "F/us"),
		
		TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
		
		App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
		Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "76Kh"),
		
		AlertPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/AlertPopup.js */ "1grR"),
		ConfirmPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/ConfirmPopup.js */ "20Ah"),
		ChangePasswordPopup = __webpack_require__(/*! modules/MailChangePasswordPoppassdExtendedPlugin/js/popups/ChangePasswordPopup.js */ "oToH")
	;
	
	return {
		start: function (ModulesManager) {
			App.subscribeEvent('StandardLoginFormWebclient::ConstructView::after', function (oParams) {
				var
					oLoginScreenView = oParams.View
				;
				if (oLoginScreenView)
				{
					// Do not completely replace previous onSystemLoginResponse, because it might be already changed by another plugin
					var fOldOnSystemLoginResponse = oLoginScreenView.onSystemLoginResponse.bind(oLoginScreenView);
					if (!_.isFunction(fOldOnSystemLoginResponse))
					{
						fOldOnSystemLoginResponse = oLoginScreenView.onSystemLoginResponseBase.bind(oLoginScreenView);
					}
					if (!_.isFunction(fOldOnSystemLoginResponse))
					{
						fOldOnSystemLoginResponse = function () {};
					}
					oLoginScreenView.onSystemLoginResponse = function (oResponse, oRequest) {
						if (oResponse && oResponse.SubscriptionsResult && oResponse.SubscriptionsResult['MailChangePasswordPoppassdExtendedPlugin::onBeforeLogin'])
						{
							this.loading(false);
							var oResult = oResponse.SubscriptionsResult['MailChangePasswordPoppassdExtendedPlugin::onBeforeLogin'];
							if (oResult.CallHelpdesk)
							{
								Popups.showPopup(AlertPopup, [TextUtils.i18n('MAILCHANGEPASSWORDPOPPASSDEXTENDEDPLUGIN/INFO_PASSWORD_EXPIRED'), function () {}, TextUtils.i18n('MAILCHANGEPASSWORDPOPPASSDEXTENDEDPLUGIN/HEADING_PASSWORD_EXPIRED')]);
							}
							else if (oResult.ChangePassword)
							{
								if (oResult.DaysBeforeExpire >= 0)
								{
									var sConfirm = TextUtils.i18n('MAILCHANGEPASSWORDPOPPASSDEXTENDEDPLUGIN/INFO_PASSWORD_ABOUT_EXPIRE_PLURAL', {'COUNT': oResult.DaysBeforeExpire}, null, oResult.DaysBeforeExpire);
									if (oResult.DaysBeforeExpire === 0)
									{
										sConfirm = TextUtils.i18n('MAILCHANGEPASSWORDPOPPASSDEXTENDEDPLUGIN/INFO_PASSWORD_EXPIRES_TODAY');
									}
									sConfirm += ' ' + TextUtils.i18n('MAILCHANGEPASSWORDPOPPASSDEXTENDEDPLUGIN/INFO_CHANGE_PASSWOD_BEFORE_EXPIRING');
									Popups.showPopup(ConfirmPopup, [sConfirm, function (bChangePassword) {
										if (bChangePassword)
										{
											App.setAuthToken(oResponse.Result.AuthToken);
											Popups.showPopup(ChangePasswordPopup, [TextUtils.i18n('MAILCHANGEPASSWORDPOPPASSDEXTENDEDPLUGIN/HEADING_PASSWORD_CHANGE'), function () {
												$.removeCookie('AuthToken');
											}]);
										}
										else
										{
											fOldOnSystemLoginResponse(oResponse, oRequest);
										}
									}.bind(this), TextUtils.i18n('MAILCHANGEPASSWORDPOPPASSDEXTENDEDPLUGIN/HEADING_PASSWORD_ABOUT_EXPIRE'), TextUtils.i18n('MAILCHANGEPASSWORDPOPPASSDEXTENDEDPLUGIN/ACTION_CHANGE'), TextUtils.i18n('MAILCHANGEPASSWORDPOPPASSDEXTENDEDPLUGIN/ACTION_LATER')]);
								}
								else
								{
									App.setAuthToken(oResponse.Result.AuthToken);
									Popups.showPopup(ChangePasswordPopup, [TextUtils.i18n('MAILCHANGEPASSWORDPOPPASSDEXTENDEDPLUGIN/HEADING_PASSWORD_EXPIRED_NEED_CHANGING'), function () {
										$.removeCookie('AuthToken');
									}]);
								}
							}
							else
							{
								fOldOnSystemLoginResponse(oResponse, oRequest);
							}
						}
						else
						{
							fOldOnSystemLoginResponse(oResponse, oRequest);
						}
					};
				}
			});
		}
	};
};

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "EVdn")))

/***/ }),

/***/ "oToH":
/*!*******************************************************************************************!*\
  !*** ./modules/MailChangePasswordPoppassdExtendedPlugin/js/popups/ChangePasswordPopup.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	$ = __webpack_require__(/*! jquery */ "EVdn"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	
	TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
	ValidationUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Validation.js */ "3Y+r"),
	
	Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "o0Bx"),
	Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "JFZZ"),
	Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "SQrT"),
	
	CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "czxF")
;

/**
 * @constructor
 */
function CChangePasswordPopup()
{
	CAbstractPopup.call(this);
	
	this.currentPassword = ko.observable('');
	this.newPassword = ko.observable('');
	this.confirmPassword = ko.observable('');
	
	this.heading = ko.observable('');
	this.fOnPopupClose = null;
}

_.extendOwn(CChangePasswordPopup.prototype, CAbstractPopup.prototype);

CChangePasswordPopup.prototype.PopupTemplate = 'MailChangePasswordPoppassdExtendedPlugin_ChangePasswordPopup';

/**
 * @param {string} sHeading
 * @param {Function} fOnPopupClose
 */
CChangePasswordPopup.prototype.onOpen = function (sHeading, fOnPopupClose)
{
	this.currentPassword('');
	this.newPassword('');
	this.confirmPassword('');
	
	this.heading(sHeading);
	this.fOnPopupClose = fOnPopupClose;
};

CChangePasswordPopup.prototype.onClose = function ()
{
	if (_.isFunction(this.fOnPopupClose))
	{
		this.fOnPopupClose();
	}
};

CChangePasswordPopup.prototype.change = function ()
{
	var
		sNewPass = $.trim(this.newPassword()),
		sConfirmPassword = $.trim(this.confirmPassword())
	;
	
	if (ValidationUtils.checkPassword(sNewPass, sConfirmPassword))
	{
		this.sendChangeRequest();
	}
};

CChangePasswordPopup.prototype.sendChangeRequest = function ()
{
	var
		oParameters = {
			'CurrentPassword': $.trim(this.currentPassword()),
			'NewPassword': $.trim(this.newPassword())
		}
	;
	
	Ajax.send('Mail', 'ChangePassword', oParameters, this.onUpdatePasswordResponse, this);
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CChangePasswordPopup.prototype.onUpdatePasswordResponse = function (oResponse, oRequest)
{
	if (oResponse.Result === false)
	{
		Api.showErrorByCode(oResponse, TextUtils.i18n('MAILCHANGEPASSWORDPOPPASSDEXTENDEDPLUGIN/ERROR_PASSWORD_NOT_SAVED'));
	}
	else
	{
		Screens.showReport(TextUtils.i18n('MAILCHANGEPASSWORDPOPPASSDEXTENDEDPLUGIN/REPORT_PASSWORD_CHANGED'));
		this.closePopup();
	}
};

module.exports = new CChangePasswordPopup();


/***/ })

}]);