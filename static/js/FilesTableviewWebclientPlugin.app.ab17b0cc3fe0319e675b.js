(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[44],{

/***/ "JL8A":
/*!**************************************************************!*\
  !*** ./modules/FilesTableviewWebclientPlugin/js/Settings.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	_ = __webpack_require__(/*! underscore */ "F/us"),
	
	Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "AFLV")
;

module.exports = {
	ServerModuleName: 'FilesTableviewWebclientPlugin',
	HashModuleName: 'files',
	
	/**
	 * Setting indicates if module is enabled by user or not.
	 * The Core subscribes to this setting changes and if it is **true** displays module tab in header and its screens.
	 * Otherwise the Core doesn't display module tab in header and its screens.
	 */
	enableModule: ko.observable(false),
	enablePreviewPane: ko.observable(false),
	
	/**
	 * Initializes settings from AppData object sections.
	 * 
	 * @param {Object} oAppData Object contained modules settings.
	 */
	init: function (oAppData)
	{
		var oAppDataSection = oAppData['FilesTableviewWebclientPlugin'];
		
		if (!_.isEmpty(oAppDataSection))
		{
			this.enableModule(Types.pBool(oAppDataSection.EnableModule, this.enableModule()));
			this.enablePreviewPane(Types.pBool(oAppDataSection.EnablePreviewPane, this.enablePreviewPane()));
		}
	},
	
	/**
	 * Updates settings of simple chat module after editing.
	 * 
	 * @param {boolean} bEnableModule New value of setting 'EnableModule'
	 * @param {boolean} bEnablePreviewPane New value of setting 'EnablePreviewPane'
	 */
	update: function (bEnableModule, bEnablePreviewPane)
	{
		this.enableModule(bEnableModule);
		this.enablePreviewPane(bEnablePreviewPane);
	}
};


/***/ }),

/***/ "bDtL":
/*!******************************************************************************************!*\
  !*** ./modules/FilesTableviewWebclientPlugin/js/views/FilesTableviewSettingsFormView.js ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	
	ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "OgeD"),
	CAbstractSettingsFormView = ModulesManager.run('SettingsWebclient', 'getAbstractSettingsFormViewClass'),
	
	Settings = __webpack_require__(/*! modules/FilesTableviewWebclientPlugin/js/Settings.js */ "JL8A")
;

/**
 * Inherits from CAbstractSettingsFormView that has methods for showing and hiding settings tab,
 * updating settings values on the server, checking if there was changins on the settings page.
 * 
 * @constructor
 */
function CFilesTableviewSettingsFormView()
{
	CAbstractSettingsFormView.call(this, Settings.ServerModuleName);

	this.enableModule = ko.observable(Settings.enableModule());
	this.enablePreviewPane = ko.observable(Settings.enablePreviewPane());
}

_.extendOwn(CFilesTableviewSettingsFormView.prototype, CAbstractSettingsFormView.prototype);

/**
 * Name of template that will be bound to this JS-object.
 * 'FilesTableviewSettingsFormView' - name of template file in 'templates' folder.
 */
CFilesTableviewSettingsFormView.prototype.ViewTemplate = 'FilesTableviewWebclientPlugin_FilesTableviewSettingsFormView';

/**
 * Returns array with all settings values wich is used for indicating if there were changes on the page.
 * 
 * @returns {Array} Array with all settings values;
 */
CFilesTableviewSettingsFormView.prototype.getCurrentValues = function ()
{
	return [
		this.enableModule(),
		this.enablePreviewPane()
	];
};

/**
 * Reverts all settings values to global ones.
 */
CFilesTableviewSettingsFormView.prototype.revertGlobalValues = function ()
{
	this.enableModule(Settings.enableModule());
	this.enablePreviewPane(Settings.enablePreviewPane());
};

/**
 * Returns Object with parameters for passing to the server while settings updating.
 * 
 * @returns Object
 */
CFilesTableviewSettingsFormView.prototype.getParametersForSave = function ()
{
	return {
		'EnableModule': this.enableModule(),
		'EnablePreviewPane': this.enablePreviewPane()
	};
};

/**
 * Applies new settings values to global settings object.
 * 
 * @param {Object} oParameters Parameters with new values which were passed to the server.
 */
CFilesTableviewSettingsFormView.prototype.applySavedValues = function (oParameters)
{
	Settings.update(oParameters.EnableModule, oParameters.EnablePreviewPane);
};

module.exports = new CFilesTableviewSettingsFormView();


/***/ }),

/***/ "lTe8":
/*!*************************************************************!*\
  !*** ./modules/FilesTableviewWebclientPlugin/js/manager.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (oAppData) {
	var
		$ = __webpack_require__(/*! jquery */ "EVdn"),
		ko = __webpack_require__(/*! knockout */ "0h2I"),
		TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
		
		App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
				
		Settings = __webpack_require__(/*! modules/FilesTableviewWebclientPlugin/js/Settings.js */ "JL8A"),
		
		bShow = false,
		TemplateName = 'FilesTableviewWebclientPlugin_ItemsView'
	;

	Settings.init(oAppData);
	
	if (App.isUserNormalOrTenant())
	{
		return {
			start: function (ModulesManager) {
				ModulesManager.run(
					'SettingsWebclient',
					'registerSettingsTabSection', 
					[
						function () { return __webpack_require__(/*! modules/FilesTableviewWebclientPlugin/js/views/FilesTableviewSettingsFormView.js */ "bDtL"); },
						Settings.HashModuleName,
						TextUtils.i18n('FILESTABLEVIEWWEBCLIENTPLUGIN/LABEL_SETTINGS_TAB')
					]
				);
//				{
					App.subscribeEvent('Files::ChangeItemsView', function (oParam) {
						if (Settings.enableModule())
						{
							oParam.View.itemsViewTemplate(TemplateName);
						}
						Settings.enableModule.subscribe(function(newValue){
							oParam.View.itemsViewTemplate(newValue ? TemplateName : oParam.TemplateName);
						});
					});
//				}
				App.subscribeEvent('FilesWebclient::ShowView::after', function (oParams) {
					var 
						data = {
							'displayName': ko.observable(''),
							'fileInfo': ko.observable(''),
							'enablePreviewPane': Settings.enablePreviewPane
						},
						oItem = null,
						$RightPannel = $("<!-- ko template: {name: 'FilesTableviewWebclientPlugin_PaneView'} --><!-- /ko -->"),
						aImgMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
					;
					
					if (!bShow)
					{
						bShow = true;

						$("#files_center_panel").after($RightPannel);

						ko.applyBindings(data, $RightPannel.get(0));
	
						oParams.View.firstSelectedFile.subscribe(function(newValue) {
							data.displayName('');
							data.fileInfo('');
							$("#files_view_pane").html("");
							if (newValue !== undefined && oItem !== newValue && Settings.enablePreviewPane())
							{
								data.displayName(newValue.displayName());
								data.fileInfo(newValue.sHeaderText);
								if (typeof(newValue.oExtendedProps) !== 'undefined' &&  typeof(newValue.oExtendedProps.InitializationVector) !== 'undefined')
								{
									$("#files_view_pane").html("<span style=\"font-style: normal;\n\
										font-weight: normal;\n\
										font-variant: normal;\n\
										text-transform: none;\n\
										line-height: 1;\n\
										display: inline-block;\n\
										font-size: 200px;\n\
										height: 250px;\n\
										font-family: 'afterlogic';\n\
										width: 500px;\">&#59658;</span>");
								}
								else if (-1 !== $.inArray(newValue.mimeType(), aImgMimeTypes))
								{
									$("#files_view_pane").html("<img style='width:100%;' src='" + newValue.getActionUrl('view') + "'>");
								}
								else
								{
									$("#files_view_pane").html("<iframe id='view_iframe' name='view_iframe' style='width: 100%; height: 400px; border: none;' src='" + newValue.getActionUrl('view') + "'></iframe>");
								}
							}
						});
					}
				});
			}
		};
	}
	
	return null;
};


/***/ })

}]);