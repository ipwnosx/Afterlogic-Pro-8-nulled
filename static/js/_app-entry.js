'use strict';
import Promise from 'bluebird';
Promise.config({
	warnings: {
		wForgottenReturn: false
	}
});
if (!window.Promise) { window.Promise = Promise; }
import $ from 'jquery';
import _ from 'underscore';
import "core-js";
import "regenerator-runtime/runtime";

$('body').ready(function () {
	var oAvailableModules = {};
	if (window.aAvailableModules) {

		if (window.aAvailableModules.indexOf('ActiveServer') >= 0) {
			oAvailableModules['ActiveServer'] = import(/* webpackChunkName: "ActiveServer" */ 'modules/ActiveServer/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('ActivityHistory') >= 0) {
			oAvailableModules['ActivityHistory'] = import(/* webpackChunkName: "ActivityHistory" */ 'modules/ActivityHistory/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('AdminPanelWebclient') >= 0) {
			oAvailableModules['AdminPanelWebclient'] = import(/* webpackChunkName: "AdminPanelWebclient" */ 'modules/AdminPanelWebclient/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('BrandingWebclient') >= 0) {
			oAvailableModules['BrandingWebclient'] = import(/* webpackChunkName: "BrandingWebclient" */ 'modules/BrandingWebclient/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('CalendarWebclient') >= 0) {
			oAvailableModules['CalendarWebclient'] = import(/* webpackChunkName: "CalendarWebclient" */ 'modules/CalendarWebclient/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('ChangePasswordWebclient') >= 0) {
			oAvailableModules['ChangePasswordWebclient'] = import(/* webpackChunkName: "ChangePasswordWebclient" */ 'modules/ChangePasswordWebclient/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('ContactsMobileWebclient') >= 0) {
			oAvailableModules['ContactsMobileWebclient'] = import(/* webpackChunkName: "ContactsMobileWebclient" */ 'modules/ContactsMobileWebclient/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('ContactsWebclient') >= 0) {
			oAvailableModules['ContactsWebclient'] = import(/* webpackChunkName: "ContactsWebclient" */ 'modules/ContactsWebclient/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('CoreMobileWebclient') >= 0) {
			oAvailableModules['CoreMobileWebclient'] = import(/* webpackChunkName: "CoreMobileWebclient" */ 'modules/CoreMobileWebclient/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('CoreParanoidEncryptionWebclientPlugin') >= 0) {
			oAvailableModules['CoreParanoidEncryptionWebclientPlugin'] = import(/* webpackChunkName: "CoreParanoidEncryptionWebclientPlugin" */ 'modules/CoreParanoidEncryptionWebclientPlugin/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('CpanelIntegrator') >= 0) {
			oAvailableModules['CpanelIntegrator'] = import(/* webpackChunkName: "CpanelIntegrator" */ 'modules/CpanelIntegrator/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('Dropbox') >= 0) {
			oAvailableModules['Dropbox'] = import(/* webpackChunkName: "Dropbox" */ 'modules/Dropbox/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('Facebook') >= 0) {
			oAvailableModules['Facebook'] = import(/* webpackChunkName: "Facebook" */ 'modules/Facebook/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('FileViewerWebclientPlugin') >= 0) {
			oAvailableModules['FileViewerWebclientPlugin'] = import(/* webpackChunkName: "FileViewerWebclientPlugin" */ 'modules/FileViewerWebclientPlugin/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('FilesCutCopyPasteWebclientPlugin') >= 0) {
			oAvailableModules['FilesCutCopyPasteWebclientPlugin'] = import(/* webpackChunkName: "FilesCutCopyPasteWebclientPlugin" */ 'modules/FilesCutCopyPasteWebclientPlugin/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('FilesTableviewWebclientPlugin') >= 0) {
			oAvailableModules['FilesTableviewWebclientPlugin'] = import(/* webpackChunkName: "FilesTableviewWebclientPlugin" */ 'modules/FilesTableviewWebclientPlugin/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('FilesWebclient') >= 0) {
			oAvailableModules['FilesWebclient'] = import(/* webpackChunkName: "FilesWebclient" */ 'modules/FilesWebclient/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('GMailConnector') >= 0) {
			oAvailableModules['GMailConnector'] = import(/* webpackChunkName: "GMailConnector" */ 'modules/GMailConnector/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('Google') >= 0) {
			oAvailableModules['Google'] = import(/* webpackChunkName: "Google" */ 'modules/Google/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('ImportExportMailPlugin') >= 0) {
			oAvailableModules['ImportExportMailPlugin'] = import(/* webpackChunkName: "ImportExportMailPlugin" */ 'modules/ImportExportMailPlugin/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('Ios') >= 0) {
			oAvailableModules['Ios'] = import(/* webpackChunkName: "Ios" */ 'modules/Ios/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('LicensingWebclient') >= 0) {
			oAvailableModules['LicensingWebclient'] = import(/* webpackChunkName: "LicensingWebclient" */ 'modules/LicensingWebclient/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('LogsViewerWebclient') >= 0) {
			oAvailableModules['LogsViewerWebclient'] = import(/* webpackChunkName: "LogsViewerWebclient" */ 'modules/LogsViewerWebclient/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('MailChangePasswordPoppassdExtendedPlugin') >= 0) {
			oAvailableModules['MailChangePasswordPoppassdExtendedPlugin'] = import(/* webpackChunkName: "MailChangePasswordPoppassdExtendedPlugin" */ 'modules/MailChangePasswordPoppassdExtendedPlugin/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('MailChangePasswordPoppassdPlugin') >= 0) {
			oAvailableModules['MailChangePasswordPoppassdPlugin'] = import(/* webpackChunkName: "MailChangePasswordPoppassdPlugin" */ 'modules/MailChangePasswordPoppassdPlugin/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('MailLoginFormMobileWebclient') >= 0) {
			oAvailableModules['MailLoginFormMobileWebclient'] = import(/* webpackChunkName: "MailLoginFormMobileWebclient" */ 'modules/MailLoginFormMobileWebclient/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('MailLoginFormWebclient') >= 0) {
			oAvailableModules['MailLoginFormWebclient'] = import(/* webpackChunkName: "MailLoginFormWebclient" */ 'modules/MailLoginFormWebclient/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('MailMasterPassword') >= 0) {
			oAvailableModules['MailMasterPassword'] = import(/* webpackChunkName: "MailMasterPassword" */ 'modules/MailMasterPassword/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('MailMobileWebclient') >= 0) {
			oAvailableModules['MailMobileWebclient'] = import(/* webpackChunkName: "MailMobileWebclient" */ 'modules/MailMobileWebclient/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('MailNotesPlugin') >= 0) {
			oAvailableModules['MailNotesPlugin'] = import(/* webpackChunkName: "MailNotesPlugin" */ 'modules/MailNotesPlugin/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('MailSaveAttachmentsToFilesPlugin') >= 0) {
			oAvailableModules['MailSaveAttachmentsToFilesPlugin'] = import(/* webpackChunkName: "MailSaveAttachmentsToFilesPlugin" */ 'modules/MailSaveAttachmentsToFilesPlugin/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('MailSaveMessageAsPdfPlugin') >= 0) {
			oAvailableModules['MailSaveMessageAsPdfPlugin'] = import(/* webpackChunkName: "MailSaveMessageAsPdfPlugin" */ 'modules/MailSaveMessageAsPdfPlugin/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('MailSensitivityWebclientPlugin') >= 0) {
			oAvailableModules['MailSensitivityWebclientPlugin'] = import(/* webpackChunkName: "MailSensitivityWebclientPlugin" */ 'modules/MailSensitivityWebclientPlugin/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('MailTnefWebclientPlugin') >= 0) {
			oAvailableModules['MailTnefWebclientPlugin'] = import(/* webpackChunkName: "MailTnefWebclientPlugin" */ 'modules/MailTnefWebclientPlugin/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('MailWebclient') >= 0) {
			oAvailableModules['MailWebclient'] = import(/* webpackChunkName: "MailWebclient" */ 'modules/MailWebclient/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('MailZipWebclientPlugin') >= 0) {
			oAvailableModules['MailZipWebclientPlugin'] = import(/* webpackChunkName: "MailZipWebclientPlugin" */ 'modules/MailZipWebclientPlugin/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('MobileAppsWebclient') >= 0) {
			oAvailableModules['MobileAppsWebclient'] = import(/* webpackChunkName: "MobileAppsWebclient" */ 'modules/MobileAppsWebclient/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('MobileSyncWebclient') >= 0) {
			oAvailableModules['MobileSyncWebclient'] = import(/* webpackChunkName: "MobileSyncWebclient" */ 'modules/MobileSyncWebclient/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('OAuthIntegratorWebclient') >= 0) {
			oAvailableModules['OAuthIntegratorWebclient'] = import(/* webpackChunkName: "OAuthIntegratorWebclient" */ 'modules/OAuthIntegratorWebclient/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('OfficeDocumentEditor') >= 0) {
			oAvailableModules['OfficeDocumentEditor'] = import(/* webpackChunkName: "OfficeDocumentEditor" */ 'modules/OfficeDocumentEditor/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('OfficeDocumentViewer') >= 0) {
			oAvailableModules['OfficeDocumentViewer'] = import(/* webpackChunkName: "OfficeDocumentViewer" */ 'modules/OfficeDocumentViewer/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('OpenPgpFilesWebclient') >= 0) {
			oAvailableModules['OpenPgpFilesWebclient'] = import(/* webpackChunkName: "OpenPgpFilesWebclient" */ 'modules/OpenPgpFilesWebclient/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('OpenPgpWebclient') >= 0) {
			oAvailableModules['OpenPgpWebclient'] = import(/* webpackChunkName: "OpenPgpWebclient" */ 'modules/OpenPgpWebclient/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('OutlookSyncWebclient') >= 0) {
			oAvailableModules['OutlookSyncWebclient'] = import(/* webpackChunkName: "OutlookSyncWebclient" */ 'modules/OutlookSyncWebclient/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('RecaptchaWebclientPlugin') >= 0) {
			oAvailableModules['RecaptchaWebclientPlugin'] = import(/* webpackChunkName: "RecaptchaWebclientPlugin" */ 'modules/RecaptchaWebclientPlugin/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('S3Filestorage') >= 0) {
			oAvailableModules['S3Filestorage'] = import(/* webpackChunkName: "S3Filestorage" */ 'modules/S3Filestorage/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('SessionTimeoutWebclient') >= 0) {
			oAvailableModules['SessionTimeoutWebclient'] = import(/* webpackChunkName: "SessionTimeoutWebclient" */ 'modules/SessionTimeoutWebclient/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('SettingsWebclient') >= 0) {
			oAvailableModules['SettingsWebclient'] = import(/* webpackChunkName: "SettingsWebclient" */ 'modules/SettingsWebclient/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('SharedFiles') >= 0) {
			oAvailableModules['SharedFiles'] = import(/* webpackChunkName: "SharedFiles" */ 'modules/SharedFiles/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('StandardLoginFormMobileWebclient') >= 0) {
			oAvailableModules['StandardLoginFormMobileWebclient'] = import(/* webpackChunkName: "StandardLoginFormMobileWebclient" */ 'modules/StandardLoginFormMobileWebclient/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('StandardLoginFormWebclient') >= 0) {
			oAvailableModules['StandardLoginFormWebclient'] = import(/* webpackChunkName: "StandardLoginFormWebclient" */ 'modules/StandardLoginFormWebclient/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('Tasks') >= 0) {
			oAvailableModules['Tasks'] = import(/* webpackChunkName: "Tasks" */ 'modules/Tasks/js/manager.js').then(function (module) { return module.default});
		}

		if (window.aAvailableModules.indexOf('TwoFactorAuth') >= 0) {
			oAvailableModules['TwoFactorAuth'] = import(/* webpackChunkName: "TwoFactorAuth" */ 'modules/TwoFactorAuth/js/manager.js').then(function (module) { return module.default});
		}
	}
	Promise.all(_.values(oAvailableModules)).then(function(aModules){
		var
			ModulesManager = require('modules/CoreWebclient/js/ModulesManager.js'),
			App = require('modules/CoreWebclient/js/App.js'),
			bSwitchingToMobile = App.checkMobile()
		;
		if (!bSwitchingToMobile) {
			if (window.isPublic) {
				App.setPublic();
			}
			if (window.isNewTab) {
				App.setNewTab();
			}
			ModulesManager.init(_.object(_.keys(oAvailableModules), aModules));
			App.init();
		}
	}).catch(function (oError) { console.error('An error occurred while loading the component:'); console.error(oError); });
});

