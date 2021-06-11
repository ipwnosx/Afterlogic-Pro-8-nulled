'use strict';

var $ = require('jquery');

$('body').ready(function () {
	var
		oAvailableModules = {
			'CalendarWebclient': require('modules/CalendarWebclient/js/manager.js')
		},
		ModulesManager = require('%PathToCoreWebclientModule%/js/ModulesManager.js'),
		App = require('%PathToCoreWebclientModule%/js/App.js')
	;
	
	App.setPublic();
	ModulesManager.init(oAvailableModules);
	App.init();
});
