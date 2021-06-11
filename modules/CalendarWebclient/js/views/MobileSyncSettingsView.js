'use strict';

var
	_ = require('underscore'),
	ko = require('knockout')
;

/**
 * @constructor
 */
function CMobileSyncSettingsView()
{
	this.davCalendars = ko.observable([]);
	this.visible = ko.computed(function () {
		return this.davCalendars().length > 0;
	}, this);
}

CMobileSyncSettingsView.prototype.ViewTemplate = '%ModuleName%_MobileSyncSettingsView';

/**
 * @param {Object} oDav
 */
CMobileSyncSettingsView.prototype.populate = function (oDav)
{
	if (_.isArray(oDav.Calendars))
	{
		this.davCalendars(oDav.Calendars);
	}
};

module.exports = new CMobileSyncSettingsView();
