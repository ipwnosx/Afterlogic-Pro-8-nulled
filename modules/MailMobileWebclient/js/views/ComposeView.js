'use strict';

var
	_ = require('underscore'),
	ko = require('knockout'),
	
	App = require('%PathToCoreWebclientModule%/js/App.js'),
	
	CComposeView = require('modules/MailWebclient/js/views/CComposeView.js'),
	ComposeView = null
;

CComposeView.prototype.registerOwnToolbarControllers = function () {
	this.registerToolbarController({
		ViewTemplate: '%ModuleName%_Compose_SendButtonView',
		sId: 'send',
		bAllowMobile: true,
		sendCommand: this.sendCommand
	});
	this.registerToolbarController({
		ViewTemplate: '%ModuleName%_Compose_SaveButtonView',
		sId: 'save',
		bAllowMobile: true,
		saveCommand: this.saveCommand
	});
	this.registerToolbarController({
		ViewTemplate: 'MailWebclient_Compose_ImportanceDropdownView',
		sId: 'importance',
		selectedImportance: this.selectedImportance
	});
	this.registerToolbarController({
		ViewTemplate: 'MailWebclient_Compose_ConfirmationCheckboxView',
		sId: 'confirmation',
		sendReadingConfirmation: this.sendReadingConfirmation
	});
};

ComposeView = new CComposeView();
ComposeView.ViewTemplate = '%ModuleName%_ComposeView';
ComposeView.oHtmlEditor.ViewTemplate = '%ModuleName%_HtmlEditorView';
ComposeView.executeBackToList = function ()
{
	if (App.isNewTab())
	{
		window.close();
	}
	else if (!!this.shown && this.shown())
	{
		var
			HeaderItemView = require('modules/MailMobileWebclient/js/views/HeaderItemView.js'),
			Routing = require('%PathToCoreWebclientModule%/js/Routing.js')
		;
		HeaderItemView.hash(HeaderItemView.baseHash());
		Routing.setPreviousHash();
	}
	this.backToListOnSendOrSave(false);
};

ComposeView.showMore = ko.observable(false);
ComposeView.showMore.subscribe(function () {
	if (ComposeView.showMore())
	{
		setTimeout(function () {
			$('body').one('click', function () {
				ComposeView.showMore(false);
			});
		});
	}
});
ComposeView.toolbarMobileControllers = ko.computed(function () {
	return _.filter(this.toolbarControllers(), function (oController) {
		return oController.bAllowMobile;
	});
}, ComposeView);
ComposeView.toolbarFirstMobileControllers = ko.computed(function () {
	return this.toolbarMobileControllers().length > 2 ? _.first(this.toolbarMobileControllers(), 1) : this.toolbarMobileControllers();
}, ComposeView);
ComposeView.toolbarNextMobileControllers = ko.computed(function () {
	return this.toolbarMobileControllers().length > 2 ? _.rest(this.toolbarMobileControllers(), 1) : [];
}, ComposeView);

module.exports = ComposeView;
