'use strict';

module.exports = function (oAppData) {
	var
		_ = require('underscore'),
		TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
		
		App = require('%PathToCoreWebclientModule%/js/App.js'),
		ModulesManager = require('%PathToCoreWebclientModule%/js/ModulesManager.js'),
		
		Settings = require('modules/%ModuleName%/js/Settings.js')
	;
	
	Settings.init(oAppData);
	
	if (!ModulesManager.isModuleAvailable(Settings.ServerModuleName))
	{
		return null;
	}
	
	require('modules/%ModuleName%/js/enums.js');
	require('modules/%ModuleName%/js/vendors/fullcalendar/fullcalendar.css');
	require('modules/%ModuleName%/js/vendors/fullcalendar/fullcalendar.js');

	if (App.isPublic())
	{
		return {
			getScreens: function () {
				var oScreens = {};
				oScreens[Settings.HashModuleName] = function () {
					return require('modules/%ModuleName%/js/views/CalendarView.js');
				};
				return oScreens;
			},
			getHeaderItem: function () {
				return {
					item: require('modules/%ModuleName%/js/views/PublicHeaderItem.js'),
					name: Settings.HashModuleName
				};
			}
		};
	}
	else if (App.isUserNormalOrTenant())
	{
		if (App.isNewTab())
		{
			return {
				start: function (ModulesManager) {
					if (Settings.AllowAppointments)
					{
						App.subscribeEvent('MailWebclient::RegisterMessagePaneController', function (fRegisterMessagePaneController) {
							fRegisterMessagePaneController(require('modules/%ModuleName%/js/views/IcalAttachmentView.js'), 'BeforeMessageBody');
						});
					}
				}
			};
		}
		else
		{
			require('modules/%ModuleName%/js/koBindings.js');
			require('modules/%ModuleName%/js/MainTabExtMethods.js');

			return {
				start: function (ModulesManager) {
					if (Settings.AllowAppointments)
					{
						App.subscribeEvent('MailWebclient::RegisterMessagePaneController', function (fRegisterMessagePaneController) {
							fRegisterMessagePaneController(require('modules/%ModuleName%/js/views/IcalAttachmentView.js'), 'BeforeMessageBody');
						});
					}
					ModulesManager.run('SettingsWebclient', 'registerSettingsTab', [function () { return require('modules/%ModuleName%/js/views/CalendarSettingsFormView.js'); }, Settings.HashModuleName, TextUtils.i18n('%MODULENAME%/LABEL_SETTINGS_TAB')]);
				},
				getScreens: function () {
					var oScreens = {};
					oScreens[Settings.HashModuleName] = function () {
						return require('modules/%ModuleName%/js/views/CalendarView.js');
					};
					return oScreens;
				},
				getHeaderItem: function () {
					return {
						item: require('modules/%ModuleName%/js/views/HeaderItemView.js'),
						name: Settings.HashModuleName
					};
				},
				getWeekStartsOn: function () {
					return Settings.WeekStartsOn;
				},
				getMobileSyncSettingsView: function () {
					return require('modules/%ModuleName%/js/views/MobileSyncSettingsView.js');
				}
			};
		}
	}
	else if (App.getUserRole() === Enums.UserRole.SuperAdmin)
	{
		return {
			start: function (ModulesManager) {
				ModulesManager.run('AdminPanelWebclient', 'registerAdminPanelTab', [
					function(resolve) {
						require.ensure(
							['modules/%ModuleName%/js/views/CalendarSettingsFormView.js'],
							function() {
								resolve(require('modules/%ModuleName%/js/views/CalendarSettingsFormView.js'));
							},
							"admin-bundle"
						);
					},
					Settings.HashModuleName,
					TextUtils.i18n('%MODULENAME%/LABEL_SETTINGS_TAB')
				]);
			}
		};
	}
	
	return null;
};
