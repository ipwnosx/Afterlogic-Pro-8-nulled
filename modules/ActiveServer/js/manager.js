'use strict';

module.exports = function (oAppData) {
	var
		TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),

		App = require('%PathToCoreWebclientModule%/js/App.js'),
				
		Settings = require('modules/%ModuleName%/js/Settings.js')
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
						require.ensure(
							['modules/%ModuleName%/js/views/PerUserAdminSettingsView.js'],
							function() {
								resolve(require('modules/%ModuleName%/js/views/PerUserAdminSettingsView.js'));
							},
							'admin-bundle'
						);
					},
					Settings.HashModuleName + '-user',
					TextUtils.i18n('%MODULENAME%/LABEL_SETTINGS_TAB_SYNC')
				]);
				ModulesManager.run('AdminPanelWebclient', 'registerAdminPanelTab', [
					function(resolve) {
						require.ensure(
							['modules/%ModuleName%/js/views/AdminSettingsView.js'],
							function() {
								resolve(require('modules/%ModuleName%/js/views/AdminSettingsView.js'));
							},
							'admin-bundle'
						);
					},
					Settings.HashModuleName + '-system',
					TextUtils.i18n('%MODULENAME%/LABEL_SETTINGS_TAB')
				]);
			}
		};
	}
	if (App.isUserNormalOrTenant())
	{
		var
			TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js')
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
					ModulesManager.run('SettingsWebclient', 'registerSettingsTab', [function () { return require('modules/%ModuleName%/js/views/SettingsFormView.js'); }, Settings.HashModuleName, TextUtils.i18n('%MODULENAME%/LABEL_SETTINGS_TAB')]);
				}
			}
		};
	}	
	
	return null;
};
