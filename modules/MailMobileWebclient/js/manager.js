'use strict';

module.exports = function (oAppData) {
	require('modules/MailWebclient/js/enums.js');
	
	var
		_ = require('underscore'),
		ko = require('knockout'),
		$ = require('jquery'),
		
		App = require('%PathToCoreWebclientModule%/js/App.js'),
		ModulesManager = require('%PathToCoreWebclientModule%/js/ModulesManager.js'),
		
		MailSettings = require('modules/MailWebclient/js/Settings.js')
	;
	
	MailSettings.init(oAppData);
	
	if (!ModulesManager.isModuleAvailable('CoreMobileWebclient'))
	{
		return null;
	}
	
//	require('node_modules/framework7/dist/css/framework7.css');
	require('node_modules/framework7/dist/css/framework7.material.css');
//	require('node_modules/framework7/dist/css/framework7.material.colors.css');
//	require('node_modules/framework7/dist/css/framework7.ios.css');
//	require('node_modules/framework7/dist/css/framework7.ios.colors.css');
	
	$('html').addClass("md");
	
	if (App.isUserNormalOrTenant())
	{
		if (App.isMobile())
		{
			var Cache = require('modules/MailWebclient/js/Cache.js');
			Cache.init();
			var AccountList = require('modules/MailWebclient/js/AccountList.js');

			return {
				enableModule: ko.observable(MailSettings.AllowAddAccounts || AccountList.hasAccount() ),
				start: function (ModulesManager) {
					var
						Browser = require('%PathToCoreWebclientModule%/js/Browser.js'),
						MailUtils = require('modules/MailWebclient/js/utils/Mail.js')
					;

					require('modules/MailWebclient/js/koBindings.js');

					if (MailSettings.AllowAppRegisterMailto)
					{
						MailUtils.registerMailto(Browser.firefox);
					}

					ko.computed(function () {
						var aAuthAcconts = _.filter(AccountList.collection(), function (oAccount) {
							return oAccount.useToAuthorize();
						});

						MailSettings.userMailAccountsCount(aAuthAcconts.length);
					}, this);
				},
				getScreens: function () {
					var oScreens = {};
					oScreens[MailSettings.HashModuleName] = function () {
						return require('modules/%ModuleName%/js/views/MailView.js');
					};
					oScreens[MailSettings.HashModuleName + '-compose'] = function () {
						return require('modules/%ModuleName%/js/views/ComposeView.js');
					};
					return oScreens;
				},
				getHeaderItem: function () {
					return {
						item: require('modules/%ModuleName%/js/views/HeaderItemView.js'),
						name: MailSettings.HashModuleName
					};
				},
				registerComposeToolbarController: function (oController) {
					var ComposeView = require('modules/%ModuleName%/js/views/ComposeView.js');
					ComposeView.registerToolbarController(oController);
				}
			};
		}
	}
	
	return null;
};
