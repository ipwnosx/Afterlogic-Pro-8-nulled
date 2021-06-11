'use strict';

module.exports = function (oAppData) {
	var App = require('%PathToCoreWebclientModule%/js/App.js');
	
	if (App.isMobile())
	{
		return {
			start: function (ModulesManager) {
				var
					InformationView = require('%PathToCoreWebclientModule%/js/views/InformationView.js'),
					HeaderView = require('%PathToCoreWebclientModule%/js/views/HeaderView.js'),
					CHeaderItemView = require('%PathToCoreWebclientModule%/js/views/CHeaderItemView.js')
				;
				InformationView.ViewTemplate = '%ModuleName%_InformationView';
				HeaderView.ViewTemplate = '%ModuleName%_HeaderView';
				CHeaderItemView.prototype.ViewTemplate = '%ModuleName%_HeaderItemView';
				
				if (ModulesManager.isModuleAvailable('SettingsWebclient')
						&& (App.isUserNormalOrTenant() || App.getUserRole() === Enums.UserRole.SuperAdmin))
				{
					var CommonSettingsFormView = require('%PathToCoreWebclientModule%/js/views/CommonSettingsFormView.js');
					CommonSettingsFormView.ViewTemplate = '%ModuleName%_CommonSettingsFormView';
				}
			}
		};
	}
	
	return null;
};
