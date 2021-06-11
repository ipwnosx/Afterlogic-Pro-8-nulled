'use strict';

var
	_ = require('underscore'),
	$ = require('jquery'),
	
	Types = require('%PathToCoreWebclientModule%/js/utils/Types.js')
;

module.exports = {
	ServerModuleName: 'Calendar',
	HashModuleName: 'calendar',
	ServerMeetingsPluginName: 'CalendarMeetingsPlugin',
	ServerCorporateCalendarName: 'CorporateCalendar',
	
	AddDescriptionToTitle: false,
	AllowAppointments: true,
	AllowShare: false,
	AllowTasks: true,
	DefaultTab: '3', // 1 - day, 2 - week, 3 - month
	HighlightWorkingDays: true,
	HighlightWorkingHours: true,
	PublicCalendarId: '',
	WeekStartsOn: '0', // 0 - sunday, 1 - monday, 6 - saturday
	WorkdayEnds: '18',
	WorkdayStarts: '9',
	
	/**
	 * Initializes settings from AppData object sections.
	 * 
	 * @param {Object} oAppData Object contained modules settings.
	 */
	init: function (oAppData)
	{
		var
			oAppDataSection = oAppData[this.ServerModuleName],
			oAppMeetingsDataSection = oAppData[this.ServerMeetingsPluginName],
			oAppCorporateCalendarDataSection = oAppData[this.ServerCorporateCalendarName]
		;
		
		if (!_.isEmpty(oAppDataSection))
		{
			this.AddDescriptionToTitle = Types.pBool(oAppDataSection.AddDescriptionToTitle, this.AddDescriptionToTitle);
			if (this.AddDescriptionToTitle)
			{
				$('html').addClass('AddDescriptionToTitle');
			}
			if (!_.isEmpty(oAppCorporateCalendarDataSection))
			{
				this.AllowShare = Types.pBool(oAppCorporateCalendarDataSection.AllowShare, this.AllowShare);
			}
			this.AllowTasks = Types.pBool(oAppDataSection.AllowTasks, this.AllowTasks);
			this.DefaultTab = Types.pString(oAppDataSection.DefaultTab, this.DefaultTab); // 1 - day, 2 - week, 3 - month
			this.HighlightWorkingDays = Types.pBool(oAppDataSection.HighlightWorkingDays, this.HighlightWorkingDays);
			this.HighlightWorkingHours = Types.pBool(oAppDataSection.HighlightWorkingHours, this.HighlightWorkingHours);
			this.PublicCalendarId = Types.pString(oAppDataSection.PublicCalendarId, this.PublicCalendarId);
			this.WeekStartsOn = Types.pString(oAppDataSection.WeekStartsOn, this.WeekStartsOn); // 0 - sunday
			this.WorkdayEnds = Types.pString(oAppDataSection.WorkdayEnds, this.WorkdayEnds);
			this.WorkdayStarts = Types.pString(oAppDataSection.WorkdayStarts, this.WorkdayStarts);
		}
		if (!_.isEmpty(oAppMeetingsDataSection))
		{
			this.AllowAppointments = Types.pBool(oAppMeetingsDataSection.AllowAppointments, this.AllowAppointments);
		}
	},
	
	/**
	 * Updates new settings values after saving on server.
	 * 
	 * @param {boolean} bHighlightWorkingDays
	 * @param {boolean} bHighlightWorkingHours
	 * @param {number} iWorkDayStarts
	 * @param {number} iWorkDayEnds
	 * @param {number} iWeekStartsOn
	 * @param {number} iDefaultTab
	 */
	update: function (bHighlightWorkingDays, bHighlightWorkingHours, iWorkDayStarts, iWorkDayEnds, iWeekStartsOn, iDefaultTab)
	{
		this.DefaultTab = iDefaultTab.toString();
		this.HighlightWorkingDays = bHighlightWorkingDays;
		this.HighlightWorkingHours = bHighlightWorkingHours;
		this.WeekStartsOn = iWeekStartsOn.toString();
		this.WorkdayEnds = iWorkDayEnds.toString();
		this.WorkdayStarts = iWorkDayStarts.toString();
	}
};
