(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[30],{

/***/ "5jes":
/*!****************************************************************!*\
  !*** ./modules/MailSaveAttachmentsToFilesPlugin/js/manager.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (oAppData) {
	var
		TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
		
		Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "o0Bx"),
		Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "JFZZ"),
		App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
		ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "OgeD"),
		Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "SQrT")
	;
	
	if (!ModulesManager.isModuleEnabled('FilesWebclient'))
	{
		return null;
	}
	
	if (App.isUserNormalOrTenant())
	{
		return {
			start: function (ModulesManager) {
				App.subscribeEvent('MailWebclient::AddAllAttachmentsDownloadMethod', function (fAddAllAttachmentsDownloadMethod) {
					fAddAllAttachmentsDownloadMethod({
						'Text': TextUtils.i18n('MAILSAVEATTACHMENTSTOFILESPLUGIN/ACTION_SAVE_ATTACHMENTS_TO_FILES'),
						'Handler': function (iAccountId, aHashes) {
							Screens.showLoading(TextUtils.i18n('COREWEBCLIENT/INFO_LOADING'));
							Ajax.send('MailSaveAttachmentsToFilesPlugin', 'Save', {
								'AccountID': iAccountId,
								'Attachments': aHashes
							}, function (oResponse) {
								Screens.hideLoading();
								if (oResponse.Result)
								{
									var oHeaderItem = ModulesManager.run('FilesWebclient', 'getHeaderItem');
									if (oHeaderItem && oHeaderItem.item)
									{
										oHeaderItem.item.recivedAnim(true);
									}
								}
								else
								{
									Api.showErrorByCode(oResponse);
								}
							});
						}
					});
				});
			}
		};
	}
	
	return null;
};


/***/ })

}]);