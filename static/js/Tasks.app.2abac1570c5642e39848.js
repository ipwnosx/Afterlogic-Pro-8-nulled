(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[18],{

/***/ "1xZj":
/*!***************************************************************!*\
  !*** ./modules/CalendarWebclient/js/popups/EditEventPopup.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	$ = __webpack_require__(/*! jquery */ "EVdn"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	moment = __webpack_require__(/*! moment */ "wd/R"),
	
	DateUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Date.js */ "nKlx"),
	TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
	Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "AFLV"),
	Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "Yjhd"),
	
	Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "JFZZ"),
	App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
	ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "OgeD"),
	Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "SQrT"),
	UserSettings = __webpack_require__(/*! modules/CoreWebclient/js/Settings.js */ "hPb3"),
	
	Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "76Kh"),
	CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "czxF"),
	AlertPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/AlertPopup.js */ "1grR"),
	ConfirmPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/ConfirmPopup.js */ "20Ah"),
	
	CalendarUtils = __webpack_require__(/*! modules/CalendarWebclient/js/utils/Calendar.js */ "aM42"),
	
	Ajax = __webpack_require__(/*! modules/CalendarWebclient/js/Ajax.js */ "KA8O"),
	CalendarCache = __webpack_require__(/*! modules/CalendarWebclient/js/Cache.js */ "gcGb"),
	Settings = __webpack_require__(/*! modules/CalendarWebclient/js/Settings.js */ "tqo6")
;

/**
 * @constructor
 */
function CEditEventPopup()
{
	CAbstractPopup.call(this);
	
	this.modified = false;
	this.isPublic = App.isPublic();
	this.isEditable = ko.observable(false);
	this.isEditableReminders = ko.observable(false);
	this.selectedCalendarIsShared = ko.observable(false);
	this.selectedCalendarIsEditable = ko.observable(false);

	this.callbackSave = null;
	this.callbackDelete = null;
	this.timeFormatMoment = 'HH:mm';
	this.dateFormatMoment = 'MM/DD/YYYY';
	this.dateFormatDatePicker = 'mm/dd/yy';
	this.ampmTimeFormat = ko.observable(false);

	this.calendarId = ko.observable(null);
	this.id = ko.observable(null);
	this.uid = ko.observable(null);
	this.recurrenceId = ko.observable(null);
	this.allEvents = ko.observable(Enums.CalendarEditRecurrenceEvent.AllEvents);

	this.isMyEvent = ko.observable(false);

	this.startDom = ko.observable(null);
	this.endDom = ko.observable(null);
	this.repeatEndDom = ko.observable(null);

	this.yearlyDayText = ko.observable('');
	this.monthlyDayText = ko.observable('');

	this.subject = ko.observable('').extend({'disableLinebreaks': true});
	this.description = ko.observable('');

	this.lockSelectStartEndDate = ko.observable(false);
	
	this.startDate = ko.observable('');
	this.startTime = ko.observable('');
	this.startTime.subscribe(function () {
		this.selectStartDate();
	}, this);
	this.allDay = ko.observable(false);
	this.allDay.subscribe(function () {
		if (!this.allDay())
		{
			this.setActualTime();
		}
	}, this);

	this.endDate = ko.observable('');
	this.endTime = ko.observable('');
	this.endTime.subscribe(function () {
		this.selectEndDate();
	}, this);

	this.repeatEndDate = ko.observable('');

	this.isEvOneDay = ko.observable(true);
	this.isEvOneTime = ko.observable(true);

	this.isRepeat = ko.observable(false);

	this.location = ko.observable('').extend({'disableLinebreaks': true});

	this.repeatPeriodOptions = ko.observableArray(this.getDisplayedPeriods());
	this.repeatWeekIntervalOptions = ko.observableArray([1, 2, 3, 4]);
	this.defaultAlarms = ko.observableArray([5, 10, 15, 30, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660, 720, 1080, 1440, 2880, 4320, 5760, 10080, 20160]);
	this.alarmOptions = ko.observableArray([]);
	this.timeOptions = ko.observableArray(CalendarUtils.getTimeListStepHalfHour((UserSettings.timeFormat() !== Enums.TimeFormat.F24) ? 'hh:mm A' : 'HH:mm'));
	UserSettings.timeFormat.subscribe(function () {
		this.timeOptions(CalendarUtils.getTimeListStepHalfHour((UserSettings.timeFormat() !== Enums.TimeFormat.F24) ? 'hh:mm A' : 'HH:mm'));
	}, this);

	this.displayedAlarms = ko.observableArray([]);
	this.displayedAlarms.subscribe(function () {
		this.disableAlarms();
	}, this);

	this.excluded = ko.observable(false);
	this.repeatPeriod = ko.observable(Enums.CalendarRepeatPeriod.None);
	this.repeatPeriod.subscribe(function (iRepeatPeriod) {
		this.setDayOfWeek();
		this.isRepeat(!!iRepeatPeriod);
	}, this);
	this.repeatInterval = ko.observable(1);
	this.repeatCount = ko.observable(null);
	this.repeatWeekNum = ko.observable(null);

	this.weekMO = ko.observable(false);
	this.weekTU = ko.observable(false);
	this.weekWE = ko.observable(false);
	this.weekTH = ko.observable(false);
	this.weekFR = ko.observable(false);
	this.weekSA = ko.observable(false);
	this.weekSU = ko.observable(false);

	this.always = ko.observable(1);

	this.appointment = ko.observable(false);
	this.attendees = ko.observableArray([]);
	this.attenderStatus = ko.observable(0);
	this.owner = ko.observable('');
	this.ownerName = ko.observable('');

	this.recivedAnim = ko.observable(false).extend({'autoResetToFalse': 500});
	this.whomAnimate = ko.observable('');
	this.guestAutocompleteItem = ko.observable(null);
	this.guestAutocomplete = ko.observable('');
	this.guestEmailFocus = ko.observable(false);
	this.guestAutocomplete.subscribe(function (sItem) {
		if (sItem === '')
		{
			this.guestAutocompleteItem(null);
		}
	}, this);

	this.condition = ko.observable('');

	this.autosizeTrigger = ko.observable(true);

	this.calendars = null;

	this.calendarsList = ko.observableArray([]);
	this.calendarColor = ko.observable('');
	this.selectedCalendarId = ko.observable('');
	this.selectedCalendarName = ko.observable('');
	this.selectedCalendarId.subscribe(function (sValue) {
		if (sValue)
		{
			var oCalendar = this.calendars.getCalendarById(sValue);
			
			this.selectedCalendarName(oCalendar.name());
			this.selectedCalendarIsShared(oCalendar.isShared());
			this.selectedCalendarIsEditable(oCalendar.isEditable());
			this.changeCalendarColor(sValue);
		}
	}, this);
	
	this.subjectFocus = ko.observable(false);

	this.descriptionFocus = ko.observable(false);
	this.locationFocus = ko.observable(false);

	this.dateEdit = ko.observable(false);
	this.repeatEdit = ko.observable(false);
	this.guestsEdit = ko.observable(false);
	this.isEditForm = ko.computed(function () {
		return !!this.id();
	}, this);

	this.callbackAttendeeActionDecline = null;

	this.bAllowAppointments = Settings.AllowAppointments;
	this.bAllowTasks = Settings.AllowTasks;

	this.eventType = ko.observable('VEVENT');
	this.status = ko.observable(false);
	this.isTask = ko.observable(false);
	this.isTaskApp = ko.observable(false);
	this.withDate = ko.observable(true);

	this.isTask.subscribe(function(value) {
		this.eventType(value ? 'VTODO' : 'VEVENT');
	}, this);

	this.allChanges = ko.computed(function () {
		this.subject();
		this.description();
		this.location();
		this.isRepeat();
		this.allDay();
		this.repeatPeriod();
		this.repeatInterval();
		this.repeatCount();
		this.repeatWeekNum();
		this.startDate();
		this.startTime();
		this.endDate();
		this.endTime();
		this.repeatEndDate();
		this.displayedAlarms();
		this.weekMO();
		this.weekTU();
		this.weekWE();
		this.weekTH();
		this.weekFR();
		this.weekSA();
		this.weekSU();
		this.always();
		this.attendees();
		this.selectedCalendarId();
		this.status();
		this.isTask();
		this.withDate();
		
		this.modified = true;
	}, this);

	this.aReminderPhrase = TextUtils.i18n('CALENDARWEBCLIENT/INFO_REMINDER').split('%');

	this.isAppointmentButtonsVisible = ko.observable(false);
}

_.extendOwn(CEditEventPopup.prototype, CAbstractPopup.prototype);

CEditEventPopup.prototype.PopupTemplate = 'CalendarWebclient_EditEventPopup';

/**
 * @param {Object} oElement
 * @param {Function} fSelect
 */
CEditEventPopup.prototype.createDatePickerObject = function (oElement, fSelect)
{
	$(oElement).datepicker({
		showOtherMonths: true,
		selectOtherMonths: true,
		monthNames: DateUtils.getMonthNamesArray(),
		dayNamesMin: TextUtils.i18n('COREWEBCLIENT/LIST_DAY_NAMES_MIN').split(' '),
		nextText: '',
		prevText: '',
		firstDay: Settings.WeekStartsOn,
		showOn: 'both',
		buttonText: '',
		buttonImage: './static/styles/images/calendar-icon.png',
		buttonImageOnly: true,
		dateFormat: this.dateFormatDatePicker,
		onSelect: fSelect
	});

	$(oElement).mousedown(function() {
		$('#ui-datepicker-div').toggle();
	});
};

CEditEventPopup.prototype.initializeDatePickers = function ()
{
	this.createDatePickerObject(this.startDom(), this.selectStartDate.bind(this));
	this.createDatePickerObject(this.endDom(), this.selectEndDate.bind(this));
	this.createDatePickerObject(this.repeatEndDom(), function (sNewValue) {
		this.repeatEndDate(sNewValue);
	}.bind(this));

	this.startDom().datepicker('option', 'dateFormat', this.dateFormatDatePicker);
	this.endDom().datepicker('option', 'dateFormat', this.dateFormatDatePicker);
	this.repeatEndDom().datepicker('option', 'dateFormat', this.dateFormatDatePicker);
};

/**
 * @param {Object} oParameters
 */
CEditEventPopup.prototype.onOpen = function (oParameters)
{
	var
		owner = App.getUserPublicId(),
		oEndMomentDate = null,
		oStartMomentDate = null,
		sAttendee = '',
		oCalendar = null,
		sCalendarOwner = '',
		oToday = moment()
	;

	this.withDate(!!oParameters.Start && !!oParameters.End);

	if (!oParameters.Start && !oParameters.End)
	{
		if (oToday.minutes() > 30)
		{
			oToday.add(60 - oToday.minutes(), 'minutes');
		}
		else
		{
			oToday.minutes(30);
		}
		oToday
			.seconds(0)
			.milliseconds(0);	
		oParameters.Start = oToday;
		oParameters.End = oToday.clone().add(30, 'minutes');
	}
	oEndMomentDate = oParameters.End ? oParameters.End.clone() : null;
	oStartMomentDate = oParameters.Start ? oParameters.Start.clone() : null;
	
	this.iDiffInMinutes = null;

	this.eventType(oParameters.Type || 'VEVENT');
	this.isTask(this.eventType() === 'VTODO');

	this.calendarId(oParameters.SelectedCalendar);
	this.calendars = oParameters.Calendars;

	oCalendar = this.calendars.getCalendarById(this.calendarId());
	if (oCalendar)
	{
		sCalendarOwner = oCalendar.owner();
	}

	this.callbackSave = oParameters.CallbackSave;
	this.callbackDelete = oParameters.CallbackDelete;
	this.callbackAttendeeActionDecline = oParameters.CallbackAttendeeActionDecline;

	this.timeFormatMoment = oParameters.TimeFormat;
	this.dateFormatMoment = Utils.getDateFormatForMoment(oParameters.DateFormat);
	this.dateFormatDatePicker = CalendarUtils.getDateFormatForDatePicker(oParameters.DateFormat);
	
	this.ampmTimeFormat(UserSettings.timeFormat() !== Enums.TimeFormat.F24);
	
	this.initializeDatePickers();
	
	this.allDay(oParameters.AllDay);
	
	if (oStartMomentDate)
	{
		this.setStartDate(oStartMomentDate, true);
		this.startTime(oStartMomentDate.format(this.timeFormatMoment));
	}
	if (oEndMomentDate && this.allDay())
	{
		oEndMomentDate.subtract(1, 'days');
	}
	if (!oEndMomentDate && oStartMomentDate)
	{
		oEndMomentDate = oStartMomentDate;
	}
	if (oEndMomentDate)
	{
		this.setEndDate(oEndMomentDate, true);
		this.endTime(oEndMomentDate.format(this.timeFormatMoment));
	}

	if (this.calendars)
	{
		this.calendarsList(
			_.filter(
				this.calendars.collection(),
				function(oItem){ 
					return oItem.isEditable(); 
				}
			)
		);
	}
	this.selectedCalendarId(oParameters.SelectedCalendar);
	this.selectedCalendarId.valueHasMutated();

	this.changeCalendarColor(this.selectedCalendarId());
	
	// parameters for event editing only (not for creating)
	this.id(oParameters.ID || null);
	this.uid(oParameters.Uid || null);
	this.recurrenceId(oParameters.RecurrenceId || null);
	
	this.subject(oParameters.Subject || '');
	
	this.status(oParameters.Status || false);
	this.location(oParameters.Location || '');
	this.description(oParameters.Description || '');
	this.allEvents(oParameters.AllEvents || Enums.CalendarEditRecurrenceEvent.AllEvents);
	
	this.isTaskApp(oParameters.IsTaskApp || false);

	this.populateAlarms(oParameters.Alarms);

	this.appointment(oParameters.Appointment);

	this.attendees(oParameters.Attendees || []);

	if ($.isFunction(App.getAttendee))
	{
		sAttendee = App.getAttendee(this.attendees());
	}

	this.isMyEvent(sAttendee !== owner && (owner === oParameters.Owner || owner === sCalendarOwner));
	this.editableSwitch(this.selectedCalendarIsShared(), this.selectedCalendarIsEditable(), this.isMyEvent());

	this.setCurrentAttenderStatus(sAttendee, oParameters.Attendees || []);

	this.owner(oParameters.Owner || owner);
	
	this.ownerName(oParameters.OwnerName || (this.isMyEvent() && this.owner() === owner ? owner : ''));
	this.guestAutocomplete('');

	this.excluded(oParameters.Excluded || false);
	this.repeatRuleParse(oParameters.RRule || null);

	if (this.id() === null)
	{
		this.subjectFocus(true);
	}

	this.autosizeTrigger.notifySubscribers(true);
	
	this.modified = false;

	this.isAppointmentButtonsVisible(this.appointment() && this.selectedCalendarIsEditable() && _.find(this.attendees(), function(oAttendee){ return oAttendee.email === owner; }));
};

/**
 * @param {string} sId
 */
CEditEventPopup.prototype.changeCalendarColor = function (sId)
{
	if ($.isFunction(this.calendars.getCalendarById))
	{
		var oCalendar = this.calendars.getCalendarById(sId);
		if (oCalendar)
		{
			this.calendarColor('');
			this.calendarColor(oCalendar.color());
		}
	}
};

CEditEventPopup.prototype.onIsTaskClick = function ()
{
	this.eventType(this.eventType() === 'VTODO' ? 'VEVENT' : 'VTODO');
};

CEditEventPopup.prototype.onSaveClick = function ()
{
	if (this.subject() === '')
	{
		Popups.showPopup(AlertPopup, [TextUtils.i18n('CALENDARWEBCLIENT/ERROR_SUBJECT_BLANK'),
			_.bind(function () {
				this.subjectFocus(true);
			}, this)]);
	}
	else
	{
		if (this.callbackSave)
		{
			var
				iPeriod = Types.pInt(this.repeatPeriod()),
				sDate = '',
				iUnixDate = null,
				iInterval = 0,
				oStart = moment(this.getDateTime(this.startDom(), this.startTime())),
				oEnd = moment(this.getDateTime(this.endDom(), this.endTime())),
				oEventData = {
					calendarId: this.calendarId(),
					newCalendarId: this.selectedCalendarId(),
					id: this.id(),
					uid: this.uid(),
					recurrenceId: this.recurrenceId(),
					allEvents:  this.allEvents(),
					subject: this.subject(),
					title: CalendarUtils.getTitleForEvent(this.subject(), this.description()),
					allDay: this.allDay(),
					location: this.location(),
					description: this.description(),
					alarms: this.getAlarmsArray(this.displayedAlarms()),
					attendees: this.attendees(),
					owner: this.owner(),
					modified: this.modified,
					type: this.eventType(),
					status: this.status(),
					withDate: this.withDate()
				},
				iAlways = Types.pInt(this.always())
			;
			
			if (this.allDay())
			{
				oEnd.add(1, 'days');
			}
			
			oEventData.start = oStart;
			oEventData.end = oEnd;

			if (iPeriod)
			{
				sDate = this.repeatEndDom().datepicker('getDate');
				iUnixDate = sDate ? moment(sDate).unix() : null;
				iInterval = this.repeatInterval();

				if (iPeriod === Enums.CalendarRepeatPeriod.Daily && iAlways === Enums.CalendarAlways.Disable)
				{
					oEventData.rrule = {
						byDays: [],
						count: null,
						end: 2,
						interval: 1,
						period: iPeriod,
						until: iUnixDate,
						weekNum: null
					};
				}
				else if (iPeriod === Enums.CalendarRepeatPeriod.Weekly && iAlways === Enums.CalendarAlways.Disable)
				{
					this.setDayOfWeek();

					oEventData.rrule = {
						byDays: this.getDays(),
						count: null,
						end: 2,
						interval: iInterval,
						period: iPeriod,
						until: iUnixDate,
						weekNum: null
					};
				}
				else if (iPeriod === Enums.CalendarRepeatPeriod.Monthly)
				{
					oEventData.rrule = {
						byDays: [],
						count: null,
						end: 0,
						interval: 1,
						period: iPeriod,
						until: null,
						weekNum: null
					};
				}
				else if (iPeriod === Enums.CalendarRepeatPeriod.Yearly)
				{
					oEventData.rrule = {
						byDays: [],
						count: null,
						end: 0,
						interval: 1,
						period: iPeriod,
						until: null,
						weekNum: null
					};
				}
				else if (iPeriod === Enums.CalendarRepeatPeriod.Daily && iAlways === Enums.CalendarAlways.Enable)
				{
					oEventData.rrule = {
						byDays: [],
						count: null,
						end: 3,
						interval: 1,
						period: iPeriod,
						until: iUnixDate,
						weekNum: null
					};
				}
				else if (iPeriod === Enums.CalendarRepeatPeriod.Weekly && iAlways === Enums.CalendarAlways.Enable)
				{
					this.setDayOfWeek();

					oEventData.rrule = {
						byDays: this.getDays(),
						count: null,
						end: 3,
						interval: iInterval,
						period: iPeriod,
						until: iUnixDate,
						weekNum: null
					};
				}
			}

			this.callbackSave(oEventData);
		}

		this.closePopup();
	}
};

CEditEventPopup.prototype.onEscHandler = function ()
{
	if (this.dateEdit())
	{
		this.dateEdit(false);
	}
	else
	{
		this.closePopup();
	}
};

CEditEventPopup.prototype.onClose = function ()
{
	this.hideAll();
	this.cleanAll();
};

CEditEventPopup.prototype.hideAll = function ()
{
	this.dateEdit(false);
	this.repeatEdit(false);
	this.guestsEdit(false);
};

CEditEventPopup.prototype.cleanAll = function ()
{
	if (this.isTask())
	{
		this.withDate(false);
	}
	else
	{
		this.withDate(true);
	}
	this.isTask(false);
	this.subject('');
	this.description('');
	this.location('');
	this.isRepeat(false);
	this.allDay(false);
	this.repeatPeriod(Enums.CalendarRepeatPeriod.None);
	this.repeatInterval(1);
	this.repeatCount(null);
	this.repeatWeekNum(null);
	this.startDate('');
	this.startTime('');
	this.endDate('');
	this.endTime('');
	this.repeatEndDate('');
	this.displayedAlarms([]);
	this.weekMO(false);
	this.weekTU(false);
	this.weekWE(false);
	this.weekTH(false);
	this.weekFR(false);
	this.weekSA(false);
	this.weekSU(false);
	this.attendees([]);
	this.always(1);
	this.selectedCalendarId('');

	this.attendees([]);
};

CEditEventPopup.prototype.onDeleteClick = function ()
{
	if (this.callbackDelete)
	{
		var
			oEventData = {
				calendarId: this.selectedCalendarId(),
				id: this.id(),
				uid: this.uid(),
				recurrenceId: this.recurrenceId(),
				allEvents:  this.allEvents(),
				subject: this.subject(),
				title: CalendarUtils.getTitleForEvent(this.subject(), this.description()),
				start: moment(this.getDateTime(this.startDom(), this.startTime())),
				end: moment(this.getDateTime(this.endDom(), this.endTime())),
				allDay: this.allDay(),
				location: this.location(),
				description: this.description()
			}
		;

		this.callbackDelete(oEventData);
	}
	this.closePopup();
};

/**
 * @param {Object} oModel
 * @param {Object} oEv
 */
CEditEventPopup.prototype.showDates = function (oModel, oEv)
{
	oEv.stopPropagation();
	this.dateEdit(!this.dateEdit());
};

CEditEventPopup.prototype.showGuests = function ()
{
	if (this.attendees().length > 0)
	{
		var
			sConfirm = TextUtils.i18n('CALENDARWEBCLIENT/CONFIRM_REMOVE_ALL_ATTENDEES'),
			fAction = _.bind(function (bResult) {
				if (bResult)
				{
					this.guestsEdit(false);
					this.guestEmailFocus(false);
					this.attendees([]);
				}
			}, this)
		;

		Popups.showPopup(ConfirmPopup, [sConfirm, fAction]);

	}
	else
	{
		this.guestsEdit(!this.guestsEdit());
		this.guestEmailFocus(!this.guestEmailFocus());
	}
};

CEditEventPopup.prototype.onAddGuestClick = function ()
{
	var
		oGuestAutocompleteItem = this.guestAutocompleteItem(),
		sGuestAutocomplete = this.guestAutocomplete(),
		oItem = oGuestAutocompleteItem || {name: '', email: sGuestAutocomplete},
		bIsInvited = _.any(this.attendees(), function (oEl) {
			return oEl.email === oItem.email;
		})
	;

	if (oItem.email === '')
	{
		Screens.showError(TextUtils.i18n('CALENDARWEBCLIENT/ERROR_EMAIL_BLANK'));
	}
	else if (oItem.email === this.owner())
	{
		this.recivedAnim(true);
	}
	else if (bIsInvited)
	{
		this.recivedAnim(true);
	}
	else
	{
		this.attendees.push(
			{
				status: 0,
				name: oItem.name,
				email: oItem.email
			}
		);
	}

	this.whomAnimate(oItem.email);
	this.guestAutocomplete('');

	this.guestEmailFocus(true);
};

/**
 * @param {Array} aAlarms
 */
CEditEventPopup.prototype.populateAlarms = function (aAlarms)
{
	if (aAlarms)
	{
		this.alarmOptions(this.getDisplayedAlarms(_.union(this.defaultAlarms(), aAlarms)));
		this.displayedAlarms(this.getDisplayedAlarms(aAlarms));
	}
	else
	{
		this.alarmOptions(this.getDisplayedAlarms(this.defaultAlarms()));
	}
};

/**
 * @param {Array} aMinutes
 */
CEditEventPopup.prototype.getDisplayedAlarms = function (aMinutes)
{
	var aDisplayedAlarms = [];

	if (aMinutes)
	{
		_.each(aMinutes, function (iMinutes, iIdx) {
			var
				koAlarm = this['alarm' + iMinutes] = ko.observable(iMinutes),
				sText = ''
			;
			
			koAlarm.subscribe(function () {
				//alarm observable value not actual
				this.disableAlarms();
				this.modified = true;
			}, this);

			if (iMinutes > 0 && iMinutes < 60)
			{
				sText = (TextUtils.i18n('COREWEBCLIENT/LABEL_MINUTES_PLURAL', {'COUNT': iMinutes}, null, iMinutes));
			}
			else if (iMinutes >= 60 && iMinutes < 1440)
			{
				sText = (TextUtils.i18n('CALENDARWEBCLIENT/LABEL_HOURS_PLURAL', {'COUNT': iMinutes / 60}, null, iMinutes / 60));
			}
			else if (iMinutes >= 1440 && iMinutes < 10080)
			{
				sText = (TextUtils.i18n('CALENDARWEBCLIENT/LABEL_DAYS_PLURAL', {'COUNT': iMinutes / 1440}, null, iMinutes / 1440));
			}
			else
			{
				sText = (TextUtils.i18n('CALENDARWEBCLIENT/LABEL_WEEKS_PLURAL', {'COUNT': iMinutes / 10080}, null, iMinutes / 10080));
			}

			aDisplayedAlarms.push({
				'value': iMinutes,
				'alarm': koAlarm,
				'text': sText,
				'isDisabled': false
			});

		}, this);
	}

	return _.sortBy(aDisplayedAlarms, function(oAlarm){ return oAlarm.value; });
};

CEditEventPopup.prototype.getDisplayedPeriods = function ()
{
	return [
		{
			label: TextUtils.i18n('CALENDARWEBCLIENT/LABEL_REPEAT_NEVER'),
			value: 0
		},
		{
			label: TextUtils.i18n('CALENDARWEBCLIENT/LABEL_REPEAT_DAILY'),
			value: 1
		},
		{
			label: TextUtils.i18n('CALENDARWEBCLIENT/LABEL_REPEAT_WEEKLY'),
			value: 2
		},
		{
			label: TextUtils.i18n('CALENDARWEBCLIENT/LABEL_REPEAT_MONTHLY'),
			value: 3
		},
		{
			label: TextUtils.i18n('CALENDARWEBCLIENT/LABEL_REPEAT_YEARLY'),
			value: 4
		}
	];
};

/**
 * @param {Array} aDisplayedAlarms
 */
CEditEventPopup.prototype.getAlarmsArray = function (aDisplayedAlarms)
{
	var aAlarms = [];

	_.each(aDisplayedAlarms, function (oAlarm, iIdx) {
		aAlarms.push(oAlarm.alarm());
	}, this);

	return _.sortBy(aAlarms, function (num) {return -num;});
};

CEditEventPopup.prototype.addFirstAlarm = function ()
{
	if (!this.displayedAlarms().length)
	{
		this.displayedAlarms(this.getDisplayedAlarms([this.alarmOptions()[0].value]));
	}
	else
	{
		var
			sConfirm = TextUtils.i18n('CALENDARWEBCLIENT/CONFIRM_REMOVE_ALL_ALARMS'),
			fAction = _.bind(function (bResult) {
				if (bResult)
				{
					this.displayedAlarms.removeAll();
				}
			}, this)
		;

		Popups.showPopup(ConfirmPopup, [sConfirm, fAction]);
	}
};

CEditEventPopup.prototype.addAlarm = function ()
{
	var
		oDisplayedAlarm,
		aSortedAlarms,
		iMinutes = 0
	;

	aSortedAlarms = _.sortBy(this.displayedAlarms(), function (oAlarm) {return oAlarm.alarm();});

	_.each(aSortedAlarms, function (oAlarm) {

		var nAlarmMinutes = oAlarm.alarm();

		if (nAlarmMinutes !== 5 && iMinutes <= 5)
		{
			iMinutes = 5;
		}
		else if (nAlarmMinutes !== 10 && iMinutes <= 10)
		{
			iMinutes = 10;
		}
		else if (nAlarmMinutes !== 15 && iMinutes <= 15)
		{
			iMinutes = 15;
		}
		else if (nAlarmMinutes !== 30 && iMinutes <= 30)
		{
			iMinutes = 30;
		}
		else if (nAlarmMinutes !== 1440 && iMinutes <= 1440)
		{
			iMinutes = 1440;
		}
	});

	oDisplayedAlarm = this.getDisplayedAlarms([iMinutes])[0];

	this['alarm' + iMinutes] = ko.observable(iMinutes);
	this.displayedAlarms.push(oDisplayedAlarm);
};

/**
 * @param {Object} oItem
 */
CEditEventPopup.prototype.removeAlarm = function (oItem)
{
	this.displayedAlarms.remove(oItem);
};

/**
 * @param {Object} oItem
 */
CEditEventPopup.prototype.removeGuest = function (oItem)
{
	this.attendees.remove(oItem);
};

CEditEventPopup.prototype.disableAlarms = function ()
{
	_.each(this.alarmOptions(), function (oAlarm, iIdx) {
		oAlarm.isDisabled = _.any(this.displayedAlarms(), function (oItem) {
			return oItem.alarm() === oAlarm.value;
		});
	}, this);

	this.alarmOptions.valueHasMutated();
};

/**
 * @param {object} oRequest
 * @param {function} fResponse
 */
CEditEventPopup.prototype.autocompleteCallback = function (oRequest, fResponse)
{
	var fAutocompleteCallback = ModulesManager.run('ContactsWebclient', 'getSuggestionsAutocompleteCallback', ['all', this.owner()]);
	
	if (_.isFunction(fAutocompleteCallback))
	{
		this.guestAutocompleteItem(null);
		fAutocompleteCallback(oRequest, fResponse);
	}
};

/**
 * @param {Object} oRepeatRule
 */
CEditEventPopup.prototype.repeatRuleParse = function (oRepeatRule)
{
	var allEvents = this.allEvents();

	this.repeatEndDom().datepicker('option', 'minDate', this.getDateTime(this.endDom()));

	if(oRepeatRule && allEvents === Enums.CalendarEditRecurrenceEvent.AllEvents)
	{
		if (oRepeatRule.until)
		{
			this.repeatEndDom().datepicker('setDate', new Date(oRepeatRule.until * 1000));
		}

		if (oRepeatRule.byDays.length)
		{
			_.each(oRepeatRule.byDays, function (sItem) {
				this['week' + sItem](true);
			}, this);
		}
		this.repeatPeriod(oRepeatRule.period);
		this.repeatInterval(oRepeatRule.interval);
		this.repeatCount(oRepeatRule.count);
		this.repeatWeekNum(oRepeatRule.weekNum);
		this.always(oRepeatRule.end === 3 ? 1 : 0);
	}
};

CEditEventPopup.prototype.getDays = function ()
{
	var aDays = [];

	if (this.weekMO()) {aDays.push('MO');}
	if (this.weekTU()) {aDays.push('TU');}
	if (this.weekWE()) {aDays.push('WE');}
	if (this.weekTH()) {aDays.push('TH');}
	if (this.weekFR()) {aDays.push('FR');}
	if (this.weekSA()) {aDays.push('SA');}
	if (this.weekSU()) {aDays.push('SU');}

	return aDays;
};

CEditEventPopup.prototype.onMainPanelClick = function ()
{
	if (this.dateEdit())
	{
		this.dateEdit(false);
	}
};

/**
 * @param {string} sDate
 */
CEditEventPopup.prototype.getDateWithoutYearIfMonthWord = function (sDate)
{
	var
		aDate = sDate.split(' '),
		oNowMoment = moment(),
		oNowYear = oNowMoment.format('YYYY')
	;
	
	if (aDate.length === 3 && oNowYear === aDate[2])
	{
		return aDate[0] + ' ' + aDate[1];
	}
	return sDate;
};

/**
 * @param {Object} oMomentDate
 * @param {boolean} bChangeInDatepicker
 */
CEditEventPopup.prototype.setStartDate = function (oMomentDate, bChangeInDatepicker)
{
	if (bChangeInDatepicker)
	{
		this.startDom().datepicker('setDate', oMomentDate.toDate());
	}
	this.startDate(this.getDateWithoutYearIfMonthWord($(this.startDom()).val()));
	
	this.yearlyDayText(TextUtils.i18n('CALENDARWEBCLIENT/LABEL_REPEAT_YEARLY_DAYMONTH', {'DAYMONTH': oMomentDate.format(this.getDateMonthFormat())}));
	this.monthlyDayText(TextUtils.i18n('CALENDARWEBCLIENT/LABEL_REPEAT_MONTHLY_DAY', {'DAY': oMomentDate.format('DD')}));
};

CEditEventPopup.prototype.selectStartDate = function ()
{
	if (!this.lockSelectStartEndDate() && this.startDate() && this.endDate())
	{
		this.lockSelectStartEndDate(true);
		
		var
			oStartDate = this.getDateTime(this.startDom(), this.startTime()),
			oStartMomentDate = moment(oStartDate),
			
			oEndDate = this.getDateTime(this.endDom(), this.endTime()),
			oEndMomentDate = moment(oEndDate)
		;
		
		if (Types.isNumber(this.iDiffInMinutes))
		{
			oEndMomentDate = oStartMomentDate.clone().add(this.iDiffInMinutes, 'minutes');
			oEndDate = oEndMomentDate.toDate();
			this.setEndDate(oEndMomentDate, true);
			this.endTime(oEndMomentDate.format(this.timeFormatMoment));
		}
		
		if (oEndMomentDate.diff(oStartMomentDate, 'minutes') < 0)
		{
			this.setEndDate(oStartMomentDate, true);
			this.endTime(oStartMomentDate.format(this.timeFormatMoment));
		}

		this.isEvOneDay(oEndMomentDate.diff(oStartMomentDate, 'days') === 0);
		this.isEvOneTime(oEndMomentDate.diff(oStartMomentDate, 'minutes') === 0);
		
		this.setStartDate(oStartMomentDate, false);
		this.startTime(oStartMomentDate.format(this.timeFormatMoment));
		
		this.lockSelectStartEndDate(false);
	}
};

/**
 * @return {string}
 */
CEditEventPopup.prototype.getDateMonthFormat = function ()
{
	var sDateMonthFormat = this.dateFormatMoment.slice(0,-5);
	
	if ($.inArray(sDateMonthFormat, ['MM/DD', 'DD/MM', 'DD MMMM']) === -1)
	{
		sDateMonthFormat = 'MM/DD';
	}
	
	return sDateMonthFormat;
};

/**
 * @param {Object} oMomentDate
 * @param {boolean} bChangeInDatepicker
 */
CEditEventPopup.prototype.setEndDate = function (oMomentDate, bChangeInDatepicker)
{
	if (bChangeInDatepicker)
	{
		this.endDom().datepicker('setDate', oMomentDate.toDate());
	}
	this.endDate(this.getDateWithoutYearIfMonthWord($(this.endDom()).val()));
};

CEditEventPopup.prototype.selectEndDate = function ()
{
	if (!this.lockSelectStartEndDate() && this.endDate() && this.startDate())
	{
		this.lockSelectStartEndDate(true);
		
		var
			oStartDate = this.getDateTime(this.startDom(), this.startTime()),
			oStartMomentDate = moment(oStartDate),
			
			oEndDate = this.getDateTime(this.endDom(), this.endTime()),
			oEndMomentDate = moment(oEndDate)
		;
		
		this.iDiffInMinutes = oEndMomentDate.diff(oStartMomentDate, 'minutes');
		
		if (this.iDiffInMinutes < 0)
		{
			this.setStartDate(oEndMomentDate, true);
			this.startTime(oEndMomentDate.format(this.timeFormatMoment));
			this.iDiffInMinutes = 0;
		}

		this.isEvOneDay(oEndMomentDate.diff(oStartMomentDate, 'days') === 0);
		this.isEvOneTime(oEndMomentDate.diff(oStartMomentDate, 'minutes') === 0);

		this.setEndDate(oEndMomentDate, false);
		this.endTime(oEndMomentDate.format(this.timeFormatMoment));
		this.repeatEndDom().datepicker('option', 'minDate', oEndDate);

		if (!this.isRepeat())
		{
			this.repeatEndDom().datepicker('setDate', oEndMomentDate.add(7, 'days').toDate());
		}
		
		this.lockSelectStartEndDate(false);
	}
};

/**
 * @param {Object} oInput
 * @param {string} sTime
 * @return {Date}
 */
CEditEventPopup.prototype.getDateTime = function (oInput, sTime)
{
	sTime = sTime ? moment(sTime, this.timeFormatMoment).format('HH:mm') : '';
	
	var
		oDate = oInput.datepicker('getDate'),
		aTime = sTime ? sTime.split(':') : []
	;
	
	//in some cases aTime is a current time (it happens only once after page loading), in this case oDate is null, so code falls. 
	// the checking if oDate is not null is necessary
	if (aTime.length === 2 && oDate !== null) 
	{
		oDate.setHours(aTime[0]);
		oDate.setMinutes(aTime[1]);
	}

	return oDate;
};

CEditEventPopup.prototype.setActualTime = function ()
{
	if (!this.lockSelectStartEndDate() && this.endDate() && this.startDate())
	{
		this.lockSelectStartEndDate(true);
		
		var
			oNowMomentDate = moment(),
			sNowTime = oNowMomentDate.format(this.timeFormatMoment),
			
			oStartDate = this.getDateTime(this.startDom(), sNowTime),
			oStartMomentDate = moment(oStartDate),
			
			oEndDate = this.getDateTime(this.endDom(), sNowTime),
			oEndMomentDate = moment(oEndDate)
		;
		
		if (oStartMomentDate.minutes() > 30)
		{
			oStartMomentDate.add((60 - oStartMomentDate.minutes()), 'minutes');
			oEndMomentDate.add((90 - oEndMomentDate.minutes()), 'minutes');
		}
		else
		{
			oStartMomentDate.add((30 - oStartMomentDate.minutes()), 'minutes');
			oEndMomentDate.add((60 - oEndMomentDate.minutes()), 'minutes');
		}
		
		this.iDiffInMinutes = oEndMomentDate.diff(oStartMomentDate, 'minutes');
		
		this.setStartDate(oStartMomentDate, true);
		this.startTime(oStartMomentDate.format(this.timeFormatMoment));
		
		this.setEndDate(oEndMomentDate, true);
		this.endTime(oEndMomentDate.format(this.timeFormatMoment));
		
		this.lockSelectStartEndDate(false);
	}
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CEditEventPopup.prototype.onSetAppointmentActionResponse = function (oResponse, oRequest)
{
	if (!oResponse.Result)
	{
		Api.showErrorByCode(oResponse, TextUtils.i18n('COREWEBCLIENT/ERROR_UNKNOWN'));
	}
};

/**
 * @param {string} sDecision
 */
CEditEventPopup.prototype.setAppointmentAction = function (sDecision)
{
	var
		iDecision = Enums.IcalConfigInt.NeedsAction,
		aAttendees = this.attendees(),
		sEmail = App.getAttendee ?	App.getAttendee(this.attendees()) :	'',
		oAttendee = _.find(this.attendees(), function(oAttendee){
			return oAttendee.email === sEmail; 
		}, this),
		oCalendar = this.calendars.getCalendarById(this.selectedCalendarId()),
		oParameters = {
			'AppointmentAction': sDecision,
			'CalendarId': this.selectedCalendarId(),
			'EventId': this.uid(),
			'Attendee': sEmail
		}
	;

	if (oAttendee)
	{
		switch (sDecision)
		{
			case Enums.IcalConfig.Accepted:
				iDecision = Enums.IcalConfigInt.Accepted;
				CalendarCache.markIcalAccepted(this.uid());
				break;
			case Enums.IcalConfig.Tentative:
				iDecision = Enums.IcalConfigInt.Tentative;
				CalendarCache.markIcalTentative(this.uid());
				break;
			case Enums.IcalConfig.Declined:
				iDecision = Enums.IcalConfigInt.Declined;
				CalendarCache.markIcalNonexistent(this.uid());
				break;
		}
		Ajax.send('SetAppointmentAction', oParameters, this.onSetAppointmentActionResponse, this, 'CalendarMeetingsPlugin');

		oAttendee.status = iDecision;
		this.attendees([]);
		this.attendees(aAttendees);
		this.setCurrentAttenderStatus(oAttendee.email, this.attendees());
		if (sDecision === Enums.IcalConfig.Declined && oCalendar && 
				this.callbackAttendeeActionDecline && $.isFunction(this.callbackAttendeeActionDecline))
		{
			this.callbackAttendeeActionDecline(oCalendar,  this.id());
			this.closePopup();
		}
	}
};

/**
 * @param {boolean} bShared
 * @param {boolean} bEditable
 * @param {boolean} bMyEvent
 */
CEditEventPopup.prototype.editableSwitch = function (bShared, bEditable, bMyEvent)
{
	this.isEditable(bShared && bEditable || bMyEvent);
	this.isEditableReminders(bEditable);
};

/**
 * @param {string} sCurrentEmail
 * @param {Array} aAttendees
 */
CEditEventPopup.prototype.setCurrentAttenderStatus = function (sCurrentEmail, aAttendees)
{
	var oCurrentAttender = _.find(aAttendees, function(oAttender){ 
		return oAttender.email === sCurrentEmail; 
	});

	this.attenderStatus(oCurrentAttender ? oCurrentAttender.status : 0);
};

CEditEventPopup.prototype.getAttenderTextStatus = function (sStatus)
{
	switch (sStatus)
	{
		case 0:
			sStatus = TextUtils.i18n('CALENDARWEBCLIENT/LABEL_ATTENDER_STATUS_PENDING');
			break;
		case 1:
			sStatus = TextUtils.i18n('CALENDARWEBCLIENT/LABEL_ATTENDER_STATUS_ACCEPTED');
			break;
		case 2:
			sStatus = TextUtils.i18n('CALENDARWEBCLIENT/LABEL_ATTENDER_STATUS_DECLINED');
			break;
		case 3:
			sStatus = TextUtils.i18n('CALENDARWEBCLIENT/LABEL_ATTENDER_STATUS_TENTATIVE');
			break;
	}
	return sStatus;
};

CEditEventPopup.prototype.setDayOfWeek = function ()
{
	if (this.repeatPeriod() === Enums.CalendarRepeatPeriod.Weekly && !this.getDays().length)
	{
		var iDayOfWeek = this.getDateTime(this.startDom()).getUTCDay();
		
		switch (iDayOfWeek)
		{
			case 0:
				this.weekMO(true);
				break;
			case 1:
				this.weekTU(true);
				break;
			case 2:
				this.weekWE(true);
				break;
			case 3:
				this.weekTH(true);
				break;
			case 4:
				this.weekFR(true);
				break;
			case 5:
				this.weekSA(true);
				break;
			case 6:
				this.weekSU(true);
				break;
		}
	}
};

CEditEventPopup.prototype.switchTask = function (isTask)
{
	this.isTask(isTask);
}

module.exports = new CEditEventPopup();


/***/ }),

/***/ "7WqE":
/*!***************************************************************!*\
  !*** ./modules/CalendarWebclient/js/models/CCalendarModel.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	moment = __webpack_require__(/*! moment */ "wd/R"),
	
	Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "AFLV"),
	UrlUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Url.js */ "ZP6a"),
	
	App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
	Storage = __webpack_require__(/*! modules/CoreWebclient/js/Storage.js */ "gcBV"),
	
	CalendarUtils = __webpack_require__(/*! modules/CalendarWebclient/js/utils/Calendar.js */ "aM42"),
	Settings = __webpack_require__(/*! modules/CalendarWebclient/js/Settings.js */ "tqo6")
;

/**
 * @constructor
 */
function CCalendarModel()
{
	this.id = 0;
	this.sSyncToken = '';
	this.name = ko.observable('');
	this.description = ko.observable('');
	this.owner = ko.observable('');
	this.isDefault = false;
	this.isShared =  ko.observable(false);
	this.isSharedToAll = ko.observable(false);
	this.sharedToAllAccess = Enums.CalendarAccess.Read;
	this.isPublic = ko.observable(false);
	this.url = ko.observable('');
	this.davUrl = ko.observable('');
	this.exportUrl = ko.observable('');
	this.pubUrl = ko.observable('');
	this.shares = ko.observableArray([]);
	this.events = ko.observableArray([]);
	this.eventsCount = ko.computed(function() {
		return this.events().length;
	}, this);
	this.access = ko.observable(Enums.CalendarAccess.Write);
	
	this.color = ko.observable('');
	this.color.subscribe(function(){
		
		this.events(_.map(this.events(), function (oEvent) {
			oEvent.backgroundColor = oEvent.borderColor = this.color();
			return oEvent;
		}, this));
		
		this.name.valueHasMutated();

	}, this);
	
	this.active = ko.observable(true);
	
	this.startDateTime = 0;
	this.endDateTime = 0;
	this.canShare = ko.computed(function () {
			return (!this.isShared()
				|| (this.isShared()
					&& this.access() === Enums.CalendarAccess.Write
					&& this.shares().length !== 0)
				|| this.isOwner());
		}, this
	);
	this.bAllowShare = Settings.AllowShare;
	this.bAllowAppointments = Settings.AllowAppointments;
}

/**
 * @param {string} sColor
 * @returns {string}
 */
CCalendarModel.prototype.parseCssColor = function (sColor)
{
	var sCssColor = Types.pString(sColor);
	
	if (sCssColor.length > 7)
	{
		sCssColor = sCssColor.substr(0, 7);
	}
	else if (sCssColor.length > 4 && sCssColor.length < 7)
	{
		sCssColor = sCssColor.substr(0, 4);
	}
	
	if (sCssColor.length === 4)
	{
		sCssColor = sCssColor[0] + sCssColor[1] + sCssColor[1] + sCssColor[2] + sCssColor[2] + sCssColor[3] + sCssColor[3];
	}
	
	if (!sCssColor.match(/^#[A-Fa-f0-9]{6}$/i))
	{
		sCssColor = '#f09650';
	}
	
	return sCssColor;
};

/**
 * @param {Object} oData
 */
CCalendarModel.prototype.parse = function (oData)
{
	this.id = Types.pString(oData.Id);
	this.sSyncToken = oData.SyncToken;
	this.name(Types.pString(oData.Name));
	this.description(Types.pString(oData.Description));
	this.owner(Types.pString(oData.Owner));
	this.active(Storage.hasData(this.id) ? Storage.getData(this.id) : true);
	this.isDefault = !!oData.IsDefault;
	this.isShared(!!oData.Shared);
	this.isSharedToAll(!!oData.SharedToAll);
	this.sharedToAllAccess = oData.SharedToAllAccess;
	this.isPublic(!!oData.IsPublic);
	this.access(oData.Access);

	this.color(this.parseCssColor(oData.Color));
	this.url(Types.pString(oData.Url));
	this.exportUrl(UrlUtils.getAppPath() + '?calendar-download/' + Types.pString(oData.ExportHash));
	this.pubUrl(UrlUtils.getAppPath() + '?calendar-pub=' + Types.pString(oData.PubHash));
	this.shares(oData.Shares || []);
	
	_.each(oData.Events, function (oEvent) {
		this.addEvent(oEvent);
	}, this);
};

/**
 * @param {Object} oEvent
 */
CCalendarModel.prototype.updateEvent = function (oEvent)
{
	var bResult = false;
	if (oEvent)
	{
		this.removeEvent(oEvent.id);
		this.addEvent(oEvent);
	}
	
	return bResult;
};

/**
 * @param {Object} oEvent
 */
CCalendarModel.prototype.addEvent = function (oEvent)
{
	if (oEvent && !this.eventExists(oEvent.id))
	{
		this.events.push(this.parseEvent(oEvent));
	}
};

/**
 * @param {string} sId
 */
CCalendarModel.prototype.getEvent = function (sId)
{
	return _.find(this.events(), function (oEvent) { 
		return oEvent.id === sId;
	}, this);
};

/**
 * @param {string} sId
 * 
 * @return {boolean}
 */
CCalendarModel.prototype.eventExists = function (sId)
{
	return !!this.getEvent(sId);
};

/**
 * @param {Object} start
 * @param {Object} end
 */
CCalendarModel.prototype.getEvents = function (start, end)
{
	var aResult = _.filter(this.events(), function(oEvent){ 
		var 
			iStart = start.unix(),
			iEnd = end.unix(),
			iEventStart = moment.utc(oEvent.start).unix(),
			iEventEnd = moment.utc(oEvent.end).unix()
		;
		return iEventStart >= iStart && iEventEnd <= iEnd ||
				iEventStart <= iStart && iEventEnd >= iEnd ||
				iEventStart >= iStart && iEventStart <= iEnd ||
				iEventEnd <= iEnd && iEventEnd >= iStart 
		;
	}, this);
	
	return aResult || [];
};

/**
 * @param {string} sId
 */
CCalendarModel.prototype.removeEvent = function (sId)
{
	this.events(_.filter(this.events(), function(oEvent){ 
		return oEvent.id !== sId;
	}, this));
};

/**
 * @param {string} sUid
 * @param {boolean=} bSkipExcluded = false
 */
CCalendarModel.prototype.removeEventByUid = function (sUid, bSkipExcluded)
{
	this.events(_.filter(this.events(), function(oEvent){ 
		return (oEvent.uid !== sUid && (!bSkipExcluded || !oEvent.excluded));
	}, this));
};

CCalendarModel.prototype.removeEvents = function ()
{
	this.events([]);
};

/**
 * @param {Array} aEventIds
 * @param {number} start
 * @param {number} end
 */
CCalendarModel.prototype.expungeEvents = function (aEventIds, start, end, type)
{
	var aEventRemoveIds = [];
	_.each(this.getEvents(moment.unix(start), moment.unix(end)), function(oEvent) {
		if (!_.include(aEventIds, oEvent.id) && oEvent.type === type)
		{
			aEventRemoveIds.push(oEvent.id);
		}
	}, this);
	this.events(_.filter(this.events(), function(oEvent){
		return !_.include(aEventRemoveIds, oEvent.id);
	},this));
};

/**
 * @return {boolean}
 */
CCalendarModel.prototype.isEditable = function ()
{
	return this.access() !== Enums.CalendarAccess.Read;
};

/**
 * @return {boolean}
 */
CCalendarModel.prototype.isOwner = function ()
{
	return App.getUserPublicId() === this.owner();
};

CCalendarModel.prototype.parseEvent = function (oEvent)
{
	oEvent.title = CalendarUtils.getTitleForEvent(oEvent.subject, oEvent.description);
	oEvent.editable = oEvent.appointment ? false : true;
	oEvent.backgroundColor = oEvent.borderColor = this.color();
	if (!_.isArray(oEvent.className))
	{
		var className = oEvent.className;
		oEvent.className = [className];
	}
	if (this.access() === Enums.CalendarAccess.Read)
	{
		oEvent.className.push('fc-event-readonly');
		oEvent.editable = false;
	}
	else
	{
		oEvent.className = _.filter(oEvent.className, function(sItem){ 
			return sItem !== 'fc-event-readonly'; 
		});
	}
	if (oEvent.rrule && !oEvent.excluded)
	{
		oEvent.className.push('fc-event-repeat');
	}
	else
	{
		oEvent.className = _.filter(oEvent.className, function(sItem){ 
			return sItem !== 'fc-event-repeat'; 
		});		
	}
	if (Types.isNonEmptyArray(oEvent.attendees) && this.bAllowAppointments)
	{
		oEvent.className.push('fc-event-appointment');
	}
	else
	{
		oEvent.className = _.filter(oEvent.className, function(sItem){ 
			return sItem !== 'fc-event-appointment'; 
		});		
	}
	return oEvent;
};

CCalendarModel.prototype.reloadEvents = function ()
{
	this.events(_.map(this.events(), function (oEvent) {
		return this.parseEvent(oEvent);
	}, this));
};

module.exports = CCalendarModel;


/***/ }),

/***/ "Ig+v":
/*!***********************************************************!*\
  !*** ./modules/CoreWebclient/js/views/CHeaderItemView.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	
	Routing = __webpack_require__(/*! modules/CoreWebclient/js/Routing.js */ "QaF5")
;

function CHeaderItemView(sLinkText)
{
	this.sName = '';
	
	this.visible = ko.observable(true);
	this.baseHash = ko.observable('');
	this.hash = ko.observable('');
	this.linkText = ko.observable(sLinkText);
	this.isCurrent = ko.observable(false);
	
	this.recivedAnim = ko.observable(false).extend({'autoResetToFalse': 500});
	this.unseenCount = ko.observable(0);
	
	this.allowChangeTitle = ko.observable(false); // allows to change favicon and browser title when browser is inactive
	this.inactiveTitle = ko.observable('');
	
	this.excludedHashes = ko.observableArray([]);
}

CHeaderItemView.prototype.ViewTemplate = 'CoreWebclient_HeaderItemView';

CHeaderItemView.prototype.setName = function (sName)
{
	this.sName = sName.toLowerCase();
	if (this.baseHash() === '')
	{
		this.hash(Routing.buildHashFromArray([sName.toLowerCase()]));
		this.baseHash(this.hash());
	}
	else
	{
		this.hash(this.baseHash());
	}
};

module.exports = CHeaderItemView;


/***/ }),

/***/ "KA8O":
/*!**********************************************!*\
  !*** ./modules/CalendarWebclient/js/Ajax.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "o0Bx"),
	
	Settings = __webpack_require__(/*! modules/CalendarWebclient/js/Settings.js */ "tqo6")
;

Ajax.registerAbortRequestHandler(Settings.ServerModuleName, function (oRequest, oOpenedRequest) {
	switch (oRequest.Method)
	{
		case 'UpdateEvent':
			var
				oParameters = oRequest.Parameters,
				oOpenedParameters = oOpenedRequest.Parameters
			;
			return	oOpenedRequest.Method === 'UpdateEvent' && 
					oOpenedParameters.calendarId === oParameters.calendarId && 
					oOpenedParameters.uid === oParameters.uid;
		case 'GetCalendars':
			return oOpenedRequest.Method === 'GetCalendars';
		case 'GetEvents':
			return oOpenedRequest.Method === 'GetEvents';
	}
	
	return false;
});

module.exports = {
	send: function (sMethod, oParameters, fResponseHandler, oContext, sServerModuleName) {
		Ajax.send(
			sServerModuleName ? sServerModuleName : Settings.ServerModuleName,
			sMethod,
			oParameters,
			fResponseHandler,
			oContext
		);
	}
};


/***/ }),

/***/ "PMX0":
/*!****************************************************!*\
  !*** ./modules/CoreWebclient/js/utils/Calendar.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	moment = __webpack_require__(/*! moment */ "wd/R"),

	CalendarUtils = {}
;

/**
 * Generates a list of time to display in create/edit event popup.
 * 
 * @param {string} sTimeFormatMoment
 * @returns {Array}
 */
CalendarUtils.getTimeListStepHalfHour = function (sTimeFormatMoment)
{
	var aTimeList = [
		'00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30',
		'05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
		'10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
		'15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
		'20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
	];
	
	return _.map(aTimeList, function (sTime) {
		var
			oMoment = moment(sTime, 'HH:mm'),
			sText = oMoment.format(sTimeFormatMoment)
		;
		return {text: sText, value: sText};
	});
};

/**
 * @param {string} sDateFormat
 * 
 * @return string
 */
CalendarUtils.getDateFormatForDatePicker = function (sDateFormat)
{
	var sDatePickerDateFormat = 'mm/dd/yy';
	
	switch (sDateFormat)
	{
		case 'MM/DD/YYYY':
			sDatePickerDateFormat = 'mm/dd/yy';
			break;
		case 'DD/MM/YYYY':
			sDatePickerDateFormat = 'dd/mm/yy';
			break;
		case 'DD Month YYYY':
			sDatePickerDateFormat = 'dd MM yy';
			break;
	}
	
	return sDatePickerDateFormat;
};

module.exports = CalendarUtils;


/***/ }),

/***/ "XdVW":
/*!*******************************************************************!*\
  !*** ./modules/CalendarWebclient/js/models/CCalendarListModel.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	
	Storage = __webpack_require__(/*! modules/CoreWebclient/js/Storage.js */ "gcBV"),
	
	CCalendarModel = __webpack_require__(/*! modules/CalendarWebclient/js/models/CCalendarModel.js */ "7WqE")
;

/**
 * @param {Object} oParameters
 * @constructor
 */
function CCalendarListModel(oParameters)
{
	this.parentOnCalendarActiveChange = oParameters.onCalendarActiveChange;
	this.parentOnCalendarCollectionChange = oParameters.onCalendarCollectionChange;
	
	this.defaultCal = ko.observable(null);
	this.currentCal = ko.observable(null);
	
	this.collection = ko.observableArray([]);
	this.collection.subscribe(function () {
		this.pickCurrentCalendar(this.defaultCal());
		
		if (this.parentOnCalendarCollectionChange)
		{
			this.parentOnCalendarCollectionChange();
		}
	}, this);
	this.count = ko.computed(function () {
		return this.collection().length;
	}, this);
	
	this.own = ko.computed(function () {
		var 
			calendars = _.filter(this.collection(), 
				function(oItem){ return (!oItem.isShared()); 
			})
		;
		return calendars;
	}, this);
	this.ownCount = ko.computed(function () {
		return this.own().length;
	}, this);
	this.shared = ko.computed(function () {
		var 
			calendars = _.filter(this.collection(), 
				function(oItem){ return (oItem.isShared() && !oItem.isSharedToAll()); 
			})
		;
		return calendars;
	}, this);
	this.sharedCount = ko.computed(function () {
		return this.shared().length;
	}, this);
	this.sharedToAll = ko.computed(function () {
		var 
			calendars = _.filter(this.collection(), 
				function(oItem){ return (oItem.isShared() && oItem.isSharedToAll()); 
			})
		;
		return calendars;
	}, this);
	this.sharedToAllCount = ko.computed(function () {
		return this.sharedToAll().length;
	}, this);
	this.ids = ko.computed(function () {
		return _.map(this.collection(), function (oCalendar){
			return oCalendar.id;
		}, this);
	}, this);
}

/**
 * @param {Object=} oPickCalendar
 */
CCalendarListModel.prototype.pickCurrentCalendar = function (oPickCalendar)
{
	var
		oFirstActiveCal = _.find(this.collection(), function (oCalendar) {
			return oCalendar.active() && oCalendar.isEditable();
		}, this)
	;
	
	if (!this.currentCal() || !this.currentCal().active())
	{
		if (oPickCalendar && oPickCalendar.active() && oPickCalendar.isEditable())
		{
			this.currentCal(oPickCalendar);
		}
		else if (this.defaultCal() && (this.defaultCal().active() && this.defaultCal().isEditable() || !oFirstActiveCal))
		{
			this.currentCal(this.defaultCal());
		}
		else if (oFirstActiveCal)
		{
			this.currentCal(oFirstActiveCal);
		}
	}
};

/**
 * @param {string} sCalendarId
 */
CCalendarListModel.prototype.getCalendarById = function (sCalendarId)
{
	return _.find(this.collection(), function(oCalendar) {
		return oCalendar.id === sCalendarId;
	}, this);
};

/**
 * @param {Object=} oStart
 * @param {Object=} oEnd
 * @return {Array}
 */
CCalendarListModel.prototype.getEvents = function (oStart, oEnd)
{
	var
		aCalendarsEvents = [],
		aCalendarEvents = []
	;
	
	_.each(this.collection(), function (oCalendar) {
		if (oCalendar && oCalendar.active())
		{
			if (oStart && oEnd)
			{
				aCalendarEvents = oCalendar.getEvents(oStart, oEnd);
			}
			else
			{
				aCalendarEvents = oCalendar.events();
			}
			aCalendarsEvents = _.union(aCalendarsEvents, aCalendarEvents);
		}
	}, this);

	return aCalendarsEvents;
};

/**
 * @param {Object} oCalendarData
 * 
 * @return {Object}
 */
CCalendarListModel.prototype.parseCalendar = function (oCalendarData)
{
	var	oCalendar = new CCalendarModel();
	oCalendar.parse(oCalendarData);
	
	return oCalendar;
};
	
/**
 * @param {Object} oCalendarData
 * 
 * @return {Object}
 */
CCalendarListModel.prototype.parseAndAddCalendar = function (oCalendarData)
{
	var
		mIndex = 0,
		oClientCalendar = null,
		oCalendar = this.parseCalendar(oCalendarData)
	;
	
	oCalendar.active.subscribe(function (value) {
		this.parentOnCalendarActiveChange(oCalendar);
		var oPickCalendar = oCalendar.active() ? oCalendar : this.defaultCal();
		this.pickCurrentCalendar(oPickCalendar);
		Storage.setData(oCalendar.id, value);
	}, this);
	
	if (oCalendar.isDefault)
	{
		this.defaultCal(oCalendar);
	}
	
	mIndex = this.calendarExists(oCalendar.id);
	if (mIndex || mIndex === 0)
	{
		oClientCalendar = this.getCalendarById(oCalendar.id);
		oCalendar.events(oClientCalendar.events());
		this.collection.splice(mIndex, 1, oCalendar);
		
	}
	else
	{
		this.collection.push(oCalendar);
	}
	
	//this.sort();
	
	return oCalendar;
};

/**
 * @param {string|number} sId
 * 
 * @return {?}
 */
CCalendarListModel.prototype.calendarExists = function (sId)
{
	var iIndex = _.indexOf(_.map(this.collection(), function(oItem){return oItem.id;}), sId);
	
	return (iIndex < 0) ? false : iIndex;
};

/**
 * @param {string} sId
 */
CCalendarListModel.prototype.removeCalendar = function (sId)
{
	this.collection(_.filter(this.collection(), function(oCalendar) {
		return oCalendar.id !== sId;
	}, this));
};


CCalendarListModel.prototype.clearCollection = function ()
{
	this.collection.removeAll();
};

CCalendarListModel.prototype.getColors = function ()
{
	return _.map(this.collection(), function (oCalendar) {
		return oCalendar.color().toLowerCase();
	}, this);
};

/**
 * @param {string} sId
 */
CCalendarListModel.prototype.setDefault = function (sId)
{
	_.each(this.collection(), function(oCalendar) {
		if (oCalendar.id !== sId)
		{
			oCalendar.isDefault = true;
			this.defaultCal(oCalendar);
		}
		else
		{
			oCalendar.isDefault = false;
		}
	}, this);
};

CCalendarListModel.prototype.sort = function ()
{
	var collection = _.sortBy(this.collection(), function(oCalendar){return oCalendar.name();});
	this.collection(_.sortBy(collection, function(oCalendar){return oCalendar.isShared();}));
};

/**
 * @param {Array} aIds
 */
CCalendarListModel.prototype.expunge = function (aIds)
{
	this.collection(_.filter(this.collection(), function(oCalendar) {
		return _.include(aIds, oCalendar.id);
	}, this));
};

module.exports = CCalendarListModel;


/***/ }),

/***/ "aM42":
/*!********************************************************!*\
  !*** ./modules/CalendarWebclient/js/utils/Calendar.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	$ = __webpack_require__(/*! jquery */ "EVdn"),
	moment = __webpack_require__(/*! moment */ "wd/R"),

	CalendarUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Calendar.js */ "PMX0"),

	Settings = __webpack_require__(/*! modules/CalendarWebclient/js/Settings.js */ "tqo6")
;

/**
 * Generates a list of time to display in calendar settings.
 * 
 * @param {string} sTimeFormatMoment
 * @returns {Array}
 */
CalendarUtils.getTimeListStepHour = function (sTimeFormatMoment)
{
	var aTimeList = [
		'01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00',
		'11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
		'21:00', '22:00', '23:00', '00:00'
	];
	
	return _.map(aTimeList, function (sTime) {
		var
			oMoment = moment(sTime, 'HH:mm'),
			sText = oMoment.format(sTimeFormatMoment),
			sValue = oMoment.format('H')
		;
		if (sTime === '00:00')
		{
			sValue = '24';
		}
		return {text: sText, value: sValue};
	});
};

/**
 * @param {string} sSubject
 * @param {string} sDescription
 * 
 * @return {string}
 */
CalendarUtils.getTitleForEvent = function (sSubject, sDescription)
{
	if (Settings.AddDescriptionToTitle)
	{
		return $.trim((sSubject + ' ' + sDescription).replace(/[\n\r]/g, ' '));
	}
	else
	{
		var
			sTitle = sSubject ? $.trim(sSubject.replace(/[\n\r]/, ' ')) : '',
			iFirstSpacePos = sTitle.indexOf(' ', 180)
		;

		if (iFirstSpacePos >= 0)
		{
			sTitle = sTitle.substring(0, iFirstSpacePos) + '...';
		}

		if (sTitle.length > 200)
		{
			sTitle = sTitle.substring(0, 200) + '...';
		}

		return sTitle;
	}
};

module.exports = CalendarUtils;


/***/ }),

/***/ "bvYb":
/*!*************************************!*\
  !*** ./modules/Tasks/js/manager.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (oAppData) {
	var
		App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
		ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "OgeD"),
		
		sModuleName = 'tasks'
	;
	
	if (App.isUserNormalOrTenant() && ModulesManager.isModuleEnabled('CalendarWebclient'))
	{
		var
			TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
			HeaderItemView = null
		;

		return {
			/**
			 * Returns list of functions that are return module screens.
			 * 
			 * @returns {Object}
			 */
			getScreens: function ()
			{
				var oScreens = {};
				
				oScreens[sModuleName] = function () {
					return __webpack_require__(/*! modules/Tasks/js/views/MainView.js */ "tbLT");
				};
				
				return oScreens;
			},
			
			/**
			 * Returns object of header item view of sales module.
			 * 
			 * @returns {Object}
			 */
			getHeaderItem: function () {
				if (HeaderItemView === null)
				{
					var CHeaderItemView = __webpack_require__(/*! modules/CoreWebclient/js/views/CHeaderItemView.js */ "Ig+v");
					HeaderItemView = new CHeaderItemView(TextUtils.i18n('TASKS/ACTION_SHOW_TASKS'));
				}

				return {
					item: HeaderItemView,
					name: sModuleName
				};
			}
		};
	}
	
	return null;
};


/***/ }),

/***/ "fIp0":
/*!*************************************************************!*\
  !*** ./modules/CoreWebclient/js/views/CPageSwitcherView.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	$ = __webpack_require__(/*! jquery */ "EVdn"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	
	Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "Yjhd"),
	
	App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5")
;

/**
 * @constructor
 * @param {number} iCount
 * @param {number} iPerPage
 */
function CPageSwitcherView(iCount, iPerPage)
{
	this.bShown = false;
	
	this.currentPage = ko.observable(1);
	this.count = ko.observable(iCount);
	this.perPage = ko.observable(iPerPage);
	this.firstPage = ko.observable(1);
	this.lastPage = ko.observable(1);

	this.pagesCount = ko.computed(function () {
		var iCount = this.perPage() > 0 ? Math.ceil(this.count() / this.perPage()) : 0;
		return (iCount > 0) ? iCount : 1;
	}, this);

	ko.computed(function () {

		var
			iAllLimit = 20,
			iLimit = 4,
			iPagesCount = this.pagesCount(),
			iCurrentPage = this.currentPage(),
			iStart = iCurrentPage,
			iEnd = iCurrentPage
		;

		if (iPagesCount > 1)
		{
			while (true)
			{
				iAllLimit--;
				
				if (1 < iStart)
				{
					iStart--;
					iLimit--;
				}

				if (0 === iLimit)
				{
					break;
				}

				if (iPagesCount > iEnd)
				{
					iEnd++;
					iLimit--;
				}

				if (0 === iLimit)
				{
					break;
				}

				if (0 === iAllLimit)
				{
					break;
				}
			}
		}

		this.firstPage(iStart);
		this.lastPage(iEnd);
		
	}, this);

	this.visibleFirst = ko.computed(function () {
		return (this.firstPage() > 1);
	}, this);

	this.visibleLast = ko.computed(function () {
		return (this.lastPage() < this.pagesCount());
	}, this);

	this.clickPage = _.bind(this.clickPage, this);

	this.pages = ko.computed(function () {
		var
			iIndex = this.firstPage(),
			aPages = []
		;

		if (this.firstPage() < this.lastPage())
		{
			for (; iIndex <= this.lastPage(); iIndex++)
			{
				aPages.push({
					number: iIndex,
					current: (iIndex === this.currentPage()),
					clickFunc: this.clickPage
				});
			}
		}

		return aPages;
	}, this);
	
	if (!App.isMobile())
	{
		this.hotKeysBind();
	}
}

CPageSwitcherView.prototype.ViewTemplate = 'CoreWebclient_PageSwitcherView';

CPageSwitcherView.prototype.hotKeysBind = function ()
{
	$(document).on('keydown', $.proxy(function(ev) {
		if (this.bShown && !Utils.isTextFieldFocused())
		{
			var sKey = ev.keyCode;
			if (ev.ctrlKey && sKey === Enums.Key.Left)
			{
				this.clickPreviousPage();
			}
			else if (ev.ctrlKey && sKey === Enums.Key.Right)
			{
				this.clickNextPage();
			}
		}
	},this));
};

CPageSwitcherView.prototype.hide = function ()
{
	this.bShown = false;
};

CPageSwitcherView.prototype.show = function ()
{
	this.bShown = true;
};

CPageSwitcherView.prototype.clear = function ()
{
	this.currentPage(1);
	this.count(0);
};

/**
 * @param {number} iCount
 */
CPageSwitcherView.prototype.setCount = function (iCount)
{
	this.count(iCount);
	if (this.currentPage() > this.pagesCount())
	{
		this.currentPage(this.pagesCount());
	}
};

/**
 * @param {number} iPage
 * @param {number} iPerPage
 */
CPageSwitcherView.prototype.setPage = function (iPage, iPerPage)
{
	this.perPage(iPerPage);
	if (iPage > this.pagesCount())
	{
		this.currentPage(this.pagesCount());
	}
	else
	{
		this.currentPage(iPage);
	}
};

/**
 * @param {Object} oPage
 */
CPageSwitcherView.prototype.clickPage = function (oPage)
{
	var iPage = oPage.number;
	if (iPage < 1)
	{
		iPage = 1;
	}
	if (iPage > this.pagesCount())
	{
		iPage = this.pagesCount();
	}
	this.currentPage(iPage);
};

CPageSwitcherView.prototype.clickFirstPage = function ()
{
	this.currentPage(1);
};

CPageSwitcherView.prototype.clickPreviousPage = function ()
{
	var iPrevPage = this.currentPage() - 1;
	if (iPrevPage < 1)
	{
		iPrevPage = 1;
	}
	this.currentPage(iPrevPage);
};

CPageSwitcherView.prototype.clickNextPage = function ()
{
	var iNextPage = this.currentPage() + 1;
	if (iNextPage > this.pagesCount())
	{
		iNextPage = this.pagesCount();
	}
	this.currentPage(iNextPage);
};

CPageSwitcherView.prototype.clickLastPage = function ()
{
	this.currentPage(this.pagesCount());
};

module.exports = CPageSwitcherView;


/***/ }),

/***/ "gcGb":
/*!***********************************************!*\
  !*** ./modules/CalendarWebclient/js/Cache.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	_ = __webpack_require__(/*! underscore */ "F/us"),
	
	App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
	
	Ajax = __webpack_require__(/*! modules/CalendarWebclient/js/Ajax.js */ "KA8O")
;

/**
 * @constructor
 */
function CCalendarCache()
{
	// uses only for ical-attachments
	this.calendars = ko.observableArray([]);
	this.calendarsLoadingStarted = ko.observable(false);
	
	this.icalAttachments = [];
	
	this.recivedAnim = ko.observable(false).extend({'autoResetToFalse': 500});
	
	this.calendarSettingsChanged = ko.observable(false);
	this.calendarChanged = ko.observable(false);
}

/**
 * @param {Object} oIcal
 */
CCalendarCache.prototype.addIcal = function (oIcal)
{
	_.each(this.icalAttachments, function (oIcalItem) {
		if (oIcalItem.uid() === oIcal.uid())
		{
			if (oIcal.sSequence >= oIcalItem.sSequence)
			{
				oIcalItem.lastModification(false);
			}
			else
			{
				oIcal.lastModification(false);
			}
		}
	});
	this.icalAttachments.push(oIcal);
	if (this.calendars().length === 0)
	{
		this.requestCalendarList();
	}
};

/**
 * @param {string} sFile
 */
CCalendarCache.prototype.getIcal = function (sFile)
{
	return _.find(this.icalAttachments, function (oIcal) {
		return (sFile === oIcal.file());
	});
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CCalendarCache.prototype.onGetCalendarsResponse = function (oResponse, oRequest)
{
	if (oResponse && oResponse.Result && oResponse.Result.Calendars)
	{
		var
			sCurrentEmail = App.currentAccountEmail ? App.currentAccountEmail() : '',
			aEditableCalendars = _.filter(oResponse.Result.Calendars, function (oCalendar) {
				return oCalendar.Owner === sCurrentEmail ||
					oCalendar.Access === Enums.CalendarAccess.Full ||
					oCalendar.Access === Enums.CalendarAccess.Write;
			})
		;
		this.calendars(_.map(aEditableCalendars, function (oCalendar) {
			return {'name': oCalendar.Name + ' <' + oCalendar.Owner + '>', 'id': oCalendar.Id};
		}));
	}
	
	this.calendarsLoadingStarted(false);
};

CCalendarCache.prototype.requestCalendarList = function ()
{
	if (!this.calendarsLoadingStarted())
	{
		Ajax.send('GetCalendars', null, this.onGetCalendarsResponse, this);
		
		this.calendarsLoadingStarted(true);
	}
};

/**
 * @param {string} sFile
 * @param {string} sType
 * @param {string} sCancelDecision
 * @param {string} sReplyDecision
 * @param {string} sCalendarId
 * @param {string} sSelectedCalendar
 */
CCalendarCache.prototype.markIcalTypeByFile = function (sFile, sType, sCancelDecision, sReplyDecision,
														sCalendarId, sSelectedCalendar)
{
	_.each(this.icalAttachments, function (oIcal) {
		if (sFile === oIcal.file())
		{
			oIcal.type(sType);
			oIcal.cancelDecision(sCancelDecision);
			oIcal.replyDecision(sReplyDecision);
			oIcal.calendarId(sCalendarId);
			oIcal.selectedCalendarId(sSelectedCalendar);
		}
	});
};

/**
 * @param {string} sUid
 */
CCalendarCache.prototype.markIcalNonexistent = function (sUid)
{
	_.each(this.icalAttachments, function (oIcal) {
		if (sUid === oIcal.uid())
		{
			oIcal.markNeededAction();
		}
	});
};

/**
 * @param {string} sUid
 */
CCalendarCache.prototype.markIcalNotSaved = function (sUid)
{
	_.each(this.icalAttachments, function (oIcal) {
		if (sUid === oIcal.uid())
		{
			oIcal.markNotSaved();
		}
	});
};

/**
 * @param {string} sUid
 */
CCalendarCache.prototype.markIcalTentative = function (sUid)
{
	_.each(this.icalAttachments, function (oIcal) {
		if (sUid === oIcal.uid())
		{
			oIcal.markTentative();
		}
	});
};

/**
 * @param {string} sUid
 */
CCalendarCache.prototype.markIcalAccepted = function (sUid)
{
	_.each(this.icalAttachments, function (oIcal) {
		if (sUid === oIcal.uid())
		{
			oIcal.markAccepted();
		}
	});
};

module.exports = new CCalendarCache();

/***/ }),

/***/ "kwPS":
/*!***********************************************!*\
  !*** ./modules/CoreWebclient/js/CSelector.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	$ = __webpack_require__(/*! jquery */ "EVdn"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	
	Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "AFLV"),
	Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "Yjhd"),
	
	App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
	Browser = __webpack_require__(/*! modules/CoreWebclient/js/Browser.js */ "HLSX"),
	Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "76Kh")
;

/**
 * @param {Function} list (knockout)
 * @param {Function=} fSelectCallback
 * @param {Function=} fDeleteCallback
 * @param {Function=} fDblClickCallback
 * @param {Function=} fEnterCallback
 * @param {Function=} multiplyLineFactor (knockout)
 * @param {boolean=} bResetCheckedOnClick = false
 * @param {boolean=} bCheckOnSelect = false
 * @param {boolean=} bUnselectOnCtrl = false
 * @param {boolean=} bDisableMultiplySelection = false
 * @param {boolean=} bChangeOnSelect = true
 * @constructor
 */
function CSelector(list, fSelectCallback, fDeleteCallback, fDblClickCallback, fEnterCallback, multiplyLineFactor,
	bResetCheckedOnClick, bCheckOnSelect, bUnselectOnCtrl, bDisableMultiplySelection, bChangeOnSelect)
{
	this.fSelectCallback = fSelectCallback || function() {};
	this.fDeleteCallback = fDeleteCallback || function() {};
	this.fDblClickCallback = (!App.isMobile() && fDblClickCallback) ? fDblClickCallback : function() {};
	this.fEnterCallback = fEnterCallback || function() {};
	this.bResetCheckedOnClick = !!bResetCheckedOnClick;
	this.bCheckOnSelect = !!bCheckOnSelect;
	this.bUnselectOnCtrl = !!bUnselectOnCtrl;
	this.bDisableMultiplySelection = !!bDisableMultiplySelection;
	this.bChangeOnSelect = (typeof bChangeOnSelect === 'undefined') ? true : !!bChangeOnSelect;
	
	this.useKeyboardKeys = ko.observable(false);

	this.list = ko.observableArray([]);

	if (list && list['subscribe'])
	{
		list['subscribe'](function (mValue) {
			this.list(mValue);
		}, this);
	}
	
	this.multiplyLineFactor = multiplyLineFactor;
	
	this.oLast = null;
	this.oListScope = null;
	this.oScrollScope = null;

	this.iTimer = 0;
	this.iFactor = 1;

	this.KeyUp = Enums.Key.Up;
	this.KeyDown = Enums.Key.Down;
	this.KeyLeft = Enums.Key.Up;
	this.KeyRight = Enums.Key.Down;

	if (this.multiplyLineFactor)
	{
		if (this.multiplyLineFactor.subscribe)
		{
			this.multiplyLineFactor.subscribe(function (iValue) {
				this.iFactor = 0 < iValue ? iValue : 1;
			}, this);
		}
		else
		{
			this.iFactor = Types.pInt(this.multiplyLineFactor);
		}

		this.KeyUp = Enums.Key.Up;
		this.KeyDown = Enums.Key.Down;
		this.KeyLeft = Enums.Key.Left;
		this.KeyRight = Enums.Key.Right;

		if ($('html').hasClass('rtl'))
		{
			this.KeyLeft = Enums.Key.Right;
			this.KeyRight = Enums.Key.Left;
		}
	}

	this.sActionSelector = '';
	this.sSelectableSelector = '';
	this.sCheckboxSelector = '';

	var self = this;

	// reading returns a list of checked items.
	// recording (bool) puts all checked, or unchecked.
	this.listChecked = ko.computed({
		'read': function () {
			var aList = _.filter(this.list(), function (oItem) {
				var
					bC = oItem && oItem.checked && oItem.checked(),
					bS = oItem && oItem.selected && oItem.selected()
				;

				return bC || (self.bCheckOnSelect && bS);
			});

			return aList;
		},
		'write': function (bValue) {
			bValue = !!bValue;
			_.each(this.list(), function (oItem) {
				oItem.checked(bValue);
			});
			this.list.valueHasMutated();
		},
		'owner': this
	});

	this.checkAll = ko.computed({
		'read': function () {
			return 0 < this.listChecked().length;
		},

		'write': function (bValue) {
			this.listChecked(!!bValue);
		},
		'owner': this
	});

	this.selectorHook = ko.observable(null);

	this.selectorHook.subscribe(function () {
		var oPrev = this.selectorHook();
		if (oPrev && _.isFunction(oPrev.selected))
		{
			oPrev.selected(false);
		}
	}, this, 'beforeChange');

	this.selectorHook.subscribe(function (oGroup) {
		if (oGroup)
		{
			oGroup.selected(true);
		}
	}, this);

	this.itemSelected = ko.computed({

		'read': this.selectorHook,

		'write': function (oItemToSelect) {

			this.selectorHook(oItemToSelect);

			if (oItemToSelect)
			{
				self.scrollToSelected();
				this.oLast = oItemToSelect;
			}
		},
		'owner': this
	});

	this.list.subscribe(function (aList) {
		if (_.isArray(aList))
		{
			var	oSelected = this.itemSelected();
			if (oSelected)
			{
				if (!_.find(aList, function (oItem) {
					return oSelected === oItem;
				}))
				{
					this.itemSelected(null);
				}
			}
		}
		else
		{
			this.itemSelected(null);
		}
	}, this);

	this.listCheckedOrSelected = ko.computed({
		'read': function () {
			var
				oSelected = this.itemSelected(),
				aChecked = this.listChecked()
			;
			return 0 < aChecked.length ? aChecked : (oSelected ? [oSelected] : []);
		},
		'write': function (bValue) {
			if (!bValue)
			{
				this.itemSelected(null);
				this.listChecked(false);
			}
			else
			{
				this.listChecked(true);
			}
		},
		'owner': this
	});

	this.listCheckedAndSelected = ko.computed({
		'read': function () {
			var
				aResult = [],
				oSelected = this.itemSelected(),
				aChecked = this.listChecked()
			;

			if (aChecked)
			{
				aResult = aChecked.slice(0);
			}

			if (oSelected && _.indexOf(aChecked, oSelected) === -1)
			{
				aResult.push(oSelected);
			}

			return aResult;
		},
		'write': function (bValue) {
			if (!bValue)
			{
				this.itemSelected(null);
				this.listChecked(false);
			}
			else
			{
				this.listChecked(true);
			}
		},
		'owner': this
	});

	this.isIncompleteChecked = ko.computed(function () {
		var
			iM = this.list().length,
			iC = this.listChecked().length
		;
		return 0 < iM && 0 < iC && iM > iC;
	}, this);

	this.onKeydownBound = _.bind(this.onKeydown, this);
}

CSelector.prototype.iTimer = 0;
CSelector.prototype.bResetCheckedOnClick = false;
CSelector.prototype.bCheckOnSelect = false;
CSelector.prototype.bUnselectOnCtrl = false;
CSelector.prototype.bDisableMultiplySelection = false;

CSelector.prototype.getLastOrSelected = function ()
{
	var
		iCheckedCount = 0,
		oLastSelected = null
	;
	
	_.each(this.list(), function (oItem) {
		if (oItem.checked())
		{
			iCheckedCount++;
		}

		if (oItem.selected())
		{
			oLastSelected = oItem;
		}
	});

	return 0 === iCheckedCount && oLastSelected ? oLastSelected : this.oLast;
};

/**
 * @param {string} sActionSelector css-selector for the active for pressing regions of the list
 * @param {string} sSelectableSelector css-selector to the item that was selected
 * @param {string} sCheckboxSelector css-selector to the element that checkbox in the list
 * @param {*} oListScope
 * @param {*} oScrollScope
 */
CSelector.prototype.initOnApplyBindings = function (sActionSelector, sSelectableSelector, sCheckboxSelector, oListScope, oScrollScope)
{
	$(document).on('keydown', this.onKeydownBound);

	this.oListScope = oListScope;
	this.oScrollScope = oScrollScope;
	this.sActionSelector = sActionSelector;
	this.sSelectableSelector = sSelectableSelector;
	this.sCheckboxSelector = sCheckboxSelector;

	var
		self = this,

		fEventClickFunction = function (oLast, oItem, oEvent) {

			var
				iIndex = 0,
				iLength = 0,
				oListItem = null,
				bChangeRange = false,
				bIsInRange = false,
				aList = [],
				bChecked = false
			;

			oItem = oItem ? oItem : null;
			if (oEvent && oEvent.shiftKey)
			{
				if (null !== oItem && null !== oLast && oItem !== oLast)
				{
					aList = self.list();
					bChecked = oItem.checked();

					for (iIndex = 0, iLength = aList.length; iIndex < iLength; iIndex++)
					{
						oListItem = aList[iIndex];

						bChangeRange = false;
						if (oListItem === oLast || oListItem === oItem)
						{
							bChangeRange = true;
						}

						if (bChangeRange)
						{
							bIsInRange = !bIsInRange;
						}

						if (bIsInRange || bChangeRange)
						{
							oListItem.checked(bChecked);
						}
					}
				}
			}

			if (oItem)
			{
				self.oLast = oItem;
			}
		}
	;

	$(this.oListScope).on('dblclick', sActionSelector, function (oEvent) {
		var oItem = ko.dataFor(this);
		if (oItem && oEvent && !oEvent.ctrlKey && !oEvent.altKey && !oEvent.shiftKey)
		{
			self.onDblClick(oItem);
		}
	});

	if (Browser.mobileDevice)
	{
		$(this.oListScope).on('touchstart', sActionSelector, function (e) {

			if (!e)
			{
				return;
			}

			var
				t2 = e.timeStamp,
				t1 = $(this).data('lastTouch') || t2,
				dt = t2 - t1,
				fingers = e.originalEvent && e.originalEvent.touches ? e.originalEvent.touches.length : 0
			;

			$(this).data('lastTouch', t2);
			if (!dt || dt > 250 || fingers > 1)
			{
				return;
			}

			e.preventDefault();
			$(this).trigger('dblclick');
		});
	}

	$(this.oListScope).on('click', sActionSelector, function (oEvent) {

		var
			bClick = true,
			oSelected = null,
			oLast = self.getLastOrSelected(),
			oItem = ko.dataFor(this)
		;

		if (oItem && oEvent)
		{
			if (oEvent.shiftKey)
			{
				bClick = false;
				if (!self.bDisableMultiplySelection)
				{
					if (null === self.oLast)
					{
						self.oLast = oItem;
					}


					oItem.checked(!oItem.checked());
					fEventClickFunction(oLast, oItem, oEvent);
				}
			}
			else if (oEvent.ctrlKey)
			{
				bClick = false;
				if (!self.bDisableMultiplySelection)
				{
					self.oLast = oItem;
					oSelected = self.itemSelected();
					if (oSelected && !oSelected.checked() && !oItem.checked())
					{
						oSelected.checked(true);
					}

					if (self.bUnselectOnCtrl && oItem === self.itemSelected())
					{
						oItem.checked(!oItem.selected());
						self.itemSelected(null);
					}
					else
					{
						oItem.checked(!oItem.checked());
					}
				}
			}

			if (bClick)
			{
				self.selectionFunc(oItem);
			}
		}
	});

	$(this.oListScope).on('click', sCheckboxSelector, function (oEvent) {

		var oItem = ko.dataFor(this);
		if (oItem && oEvent && !self.bDisableMultiplySelection)
		{
			if (oEvent.shiftKey)
			{
				if (null === self.oLast)
				{
					self.oLast = oItem;
				}

				fEventClickFunction(self.getLastOrSelected(), oItem, oEvent);
			}
			else
			{
				self.oLast = oItem;
			}
		}

		if (oEvent && oEvent.stopPropagation)
		{
			oEvent.stopPropagation();
		}
	});

	$(this.oListScope).on('dblclick', sCheckboxSelector, function (oEvent) {
		if (oEvent && oEvent.stopPropagation)
		{
			oEvent.stopPropagation();
		}
	});
};

/**
 * @param {Object} oSelected
 * @param {number} iEventKeyCode
 * 
 * @return {Object}
 */
CSelector.prototype.getResultSelection = function (oSelected, iEventKeyCode)
{
	var
		self = this,
		bStop = false,
		bNext = false,
		oResult = null,
		iPageStep = this.iFactor,
		bMultiply = !!this.multiplyLineFactor,
		iIndex = 0,
		iLen = 0,
		aList = []
	;

	if (!oSelected && -1 < $.inArray(iEventKeyCode, [this.KeyUp, this.KeyDown, this.KeyLeft, this.KeyRight,
		Enums.Key.PageUp, Enums.Key.PageDown, Enums.Key.Home, Enums.Key.End]))
	{
		aList = this.list();
		if (aList && 0 < aList.length)
		{
			if (-1 < $.inArray(iEventKeyCode, [this.KeyDown, this.KeyRight, Enums.Key.PageUp, Enums.Key.Home]))
			{
				oResult = aList[0];
			}
			else if (-1 < $.inArray(iEventKeyCode, [this.KeyUp, this.KeyLeft, Enums.Key.PageDown, Enums.Key.End]))
			{
				oResult = aList[aList.length - 1];
			}
		}
	}
	else if (oSelected)
	{
		aList = this.list();
		iLen = aList ? aList.length : 0;

		if (0 < iLen)
		{
			if (
				Enums.Key.Home === iEventKeyCode || Enums.Key.PageUp === iEventKeyCode ||
				Enums.Key.End === iEventKeyCode || Enums.Key.PageDown === iEventKeyCode ||
				(bMultiply && (Enums.Key.Left === iEventKeyCode || Enums.Key.Right === iEventKeyCode)) ||
				(!bMultiply && (Enums.Key.Up === iEventKeyCode || Enums.Key.Down === iEventKeyCode))
			)
			{
				_.each(aList, function (oItem) {
					if (!bStop)
					{
						switch (iEventKeyCode) {
							case self.KeyUp:
							case self.KeyLeft:
								if (oSelected === oItem)
								{
									bStop = true;
								}
								else
								{
									oResult = oItem;
								}
								break;
							case Enums.Key.Home:
							case Enums.Key.PageUp:
								oResult = oItem;
								bStop = true;
								break;
							case self.KeyDown:
							case self.KeyRight:
								if (bNext)
								{
									oResult = oItem;
									bStop = true;
								}
								else if (oSelected === oItem)
								{
									bNext = true;
								}
								break;
							case Enums.Key.End:
							case Enums.Key.PageDown:
								oResult = oItem;
								break;
						}
					}
				});
			}
			else if (bMultiply && this.KeyDown === iEventKeyCode)
			{
				for (; iIndex < iLen; iIndex++)
				{
					if (oSelected === aList[iIndex])
					{
						iIndex += iPageStep;
						if (iLen - 1 < iIndex)
						{
							iIndex -= iPageStep;
						}

						oResult = aList[iIndex];
						break;
					}
				}
			}
			else if (bMultiply && this.KeyUp === iEventKeyCode)
			{
				for (iIndex = iLen; iIndex >= 0; iIndex--)
				{
					if (oSelected === aList[iIndex])
					{
						iIndex -= iPageStep;
						if (0 > iIndex)
						{
							iIndex += iPageStep;
						}

						oResult = aList[iIndex];
						break;
					}
				}
			}
		}
	}

	return oResult;
};

/**
 * @param {Object} oResult
 * @param {Object} oSelected
 * @param {number} iEventKeyCode
 */
CSelector.prototype.shiftClickResult = function (oResult, oSelected, iEventKeyCode)
{
	if (oSelected)
	{
		var
			bMultiply = !!this.multiplyLineFactor,
			bInRange = false,
			bSelected = false
		;

		if (-1 < $.inArray(iEventKeyCode,
			bMultiply ? [Enums.Key.Left, Enums.Key.Right] : [Enums.Key.Up, Enums.Key.Down]))
		{
			oSelected.checked(!oSelected.checked());
		}
		else if (-1 < $.inArray(iEventKeyCode, bMultiply ?
			[Enums.Key.Up, Enums.Key.Down, Enums.Key.PageUp, Enums.Key.PageDown, Enums.Key.Home, Enums.Key.End] :
			[Enums.Key.Left, Enums.Key.Right, Enums.Key.PageUp, Enums.Key.PageDown, Enums.Key.Home, Enums.Key.End]
		))
		{
			bSelected = !oSelected.checked();

			_.each(this.list(), function (oItem) {
				var Add = false;
				if (oItem === oResult || oSelected === oItem)
				{
					bInRange = !bInRange;
					Add = true;
				}

				if (bInRange || Add)
				{
					oItem.checked(bSelected);
					Add = false;
				}
			});
			
			if (bMultiply && oResult && (iEventKeyCode === Enums.Key.Up || iEventKeyCode === Enums.Key.Down))
			{
				oResult.checked(!oResult.checked());
			}
		}
	}	
};

/**
 * @param {number} iEventKeyCode
 * @param {boolean} bShiftKey
 */
CSelector.prototype.clickNewSelectPosition = function (iEventKeyCode, bShiftKey)
{
	var
		oSelected = this.itemSelected(),
		oResult = this.getResultSelection(oSelected, iEventKeyCode)
	;

	if (oResult)
	{
		if (bShiftKey)
		{
			this.shiftClickResult(oResult, oSelected, iEventKeyCode);
		}
		this.selectionFunc(oResult);
	}
};

/**
 * @param {Object} oEvent
 * 
 * @return {boolean}
 */
CSelector.prototype.onKeydown = function (oEvent)
{
	var
		bResult = true,
		iCode = 0
	;

	if (this.useKeyboardKeys() && oEvent && !Utils.isTextFieldFocused() && !Popups.hasOpenedMaximizedPopups())
	{
		iCode = oEvent.keyCode;
		if (!oEvent.ctrlKey &&
			(
				this.KeyUp === iCode || this.KeyDown === iCode ||
				this.KeyLeft === iCode || this.KeyRight === iCode ||
				Enums.Key.PageUp === iCode || Enums.Key.PageDown === iCode ||
				Enums.Key.Home === iCode || Enums.Key.End === iCode
			)
		)
		{
			this.clickNewSelectPosition(iCode, oEvent.shiftKey);
			bResult = false;
		}
		else if (Enums.Key.Del === iCode && !oEvent.ctrlKey && !oEvent.shiftKey)
		{
			if (0 < this.list().length)
			{
				this.onDelete();
				bResult = false;
			}
		}
		else if (Enums.Key.Enter === iCode)
		{
			if (0 < this.list().length && !oEvent.ctrlKey)
			{
				this.onEnter(this.itemSelected());
				bResult = false;
			}
		}
		else if (oEvent.ctrlKey && !oEvent.altKey && !oEvent.shiftKey && Enums.Key.a === iCode)
		{
			this.checkAll(!(this.checkAll() && !this.isIncompleteChecked()));
			bResult = false;
		}
	}

	return bResult;
};

CSelector.prototype.onDelete = function ()
{
	this.fDeleteCallback.call(this, this.listCheckedOrSelected());
};

/**
 * @param {Object} oItem
 */
CSelector.prototype.onEnter = function (oItem)
{
	if (oItem)
	{
		this.fEnterCallback.call(this, oItem);
	}
};

/**
 * @param {Object} oItem
 */
CSelector.prototype.selectionFunc = function (oItem)
{
	if (this.bChangeOnSelect)
	{
		this.itemSelected(null);
	}
	if (this.bResetCheckedOnClick)
	{
		this.listChecked(false);
	}
	if (this.bChangeOnSelect)
	{
		this.itemSelected(oItem);
	}
	this.fSelectCallback.call(this, oItem);
};

/**
 * @param {Object} oItem
 */
CSelector.prototype.onDblClick = function (oItem)
{
	this.fDblClickCallback.call(this, oItem);
};

CSelector.prototype.koCheckAll = function ()
{
	return ko.computed({
		'read': this.checkAll,
		'write': this.checkAll,
		'owner': this
	});
};

CSelector.prototype.koCheckAllIncomplete = function ()
{
	return ko.computed({
		'read': this.isIncompleteChecked,
		'write': this.isIncompleteChecked,
		'owner': this
	});
};

/**
 * @return {boolean}
 */
CSelector.prototype.scrollToSelected = function ()
{
	if (!this.oListScope || !this.oScrollScope)
	{
		return false;
	}

	var
		iOffset = 20,
		oSelected = $(this.sSelectableSelector, this.oScrollScope),
		oPos = oSelected.position(),
		iVisibleHeight = this.oScrollScope.height(),
		iScrollTop = this.oScrollScope.scrollTop(),
		iSelectedHeight = oSelected.outerHeight(),
		bSelectedVisible = oPos && (oPos.top >= iScrollTop) && (oPos.top <= (iScrollTop + iVisibleHeight - iSelectedHeight))
	;

	if (oPos && !bSelectedVisible)
	{
		if ((oPos.top < (iScrollTop + iVisibleHeight)) && ((oPos.top + iSelectedHeight) > (iScrollTop + iVisibleHeight)))
		{
			// selected item is partially visible from below
			// make it visible at bottom with offset
			this.oScrollScope.scrollTop(oPos.top + iSelectedHeight + iOffset - iVisibleHeight);
		}
		else
		{
			// make selected item visible at top with offset
			this.oScrollScope.scrollTop(oPos.top - iOffset);
		}

		return true;
	}

	return false;
};

module.exports = CSelector;


/***/ }),

/***/ "nKlx":
/*!************************************************!*\
  !*** ./modules/CoreWebclient/js/utils/Date.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
			
	DateUtils = {}
;

DateUtils.getMonthNamesArray = function ()
{
	var
		aMonthes = TextUtils.i18n('COREWEBCLIENT/LIST_MONTH_NAMES').split(' '),
		iLen = 12,
		iIndex = aMonthes.length
	;
	
	for (; iIndex < iLen; iIndex++)
	{
		aMonthes[iIndex] = '';
	}
	
	return aMonthes;
};

/**
 * @param {number} iMonth
 * @param {number} iYear
 * 
 * @return {number}
 */
DateUtils.daysInMonth = function (iMonth, iYear)
{
	if (0 < iMonth && 13 > iMonth && 0 < iYear)
	{
		return new Date(iYear, iMonth, 0).getDate();
	}

	return 31;
};

module.exports = DateUtils;


/***/ }),

/***/ "tbLT":
/*!********************************************!*\
  !*** ./modules/Tasks/js/views/MainView.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	$ = __webpack_require__(/*! jquery */ "EVdn"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	moment = __webpack_require__(/*! moment */ "wd/R"),
    
	TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
	Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "AFLV"),
	Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "Yjhd"),
	
	Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "o0Bx"),
	Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "JFZZ"),
	CAbstractScreenView = __webpack_require__(/*! modules/CoreWebclient/js/views/CAbstractScreenView.js */ "xcwT"),
	CSelector = __webpack_require__(/*! modules/CoreWebclient/js/CSelector.js */ "kwPS"),
	CPageSwitcherView = __webpack_require__(/*! modules/CoreWebclient/js/views/CPageSwitcherView.js */ "fIp0"),
	Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "76Kh"),
	UserSettings = __webpack_require__(/*! modules/CoreWebclient/js/Settings.js */ "hPb3"),
	
	CCalendarListModel = __webpack_require__(/*! modules/CalendarWebclient/js/models/CCalendarListModel.js */ "XdVW"),
	CCalendarModel = __webpack_require__(/*! modules/CalendarWebclient/js/models/CCalendarModel.js */ "7WqE"),
	EditTaskPopup = __webpack_require__(/*! modules/CalendarWebclient/js/popups/EditEventPopup.js */ "1xZj")
;

__webpack_require__(/*! jquery-ui/ui/widgets/datepicker */ "Vn+K");

/**
 * View that is used as screen of sales module.
 * 
 * @constructor
 */
function CMainView()
{
	this.sDateFormat = UserSettings.dateFormat();
	
	this.dateFormatMoment = Utils.getDateFormatForMoment(this.sDateFormat);
	
	
	this.saveCommand = Utils.createCommand(this, this.executeSave);	
	this.removeCommand = Utils.createCommand(this, this.executeRemove);	
	this.calendars = new CCalendarListModel({
		onCalendarCollectionChange: function () {},
		onCalendarActiveChange: function () {}
	});

	CAbstractScreenView.call(this, 'Tasks');
	this.iItemsPerPage = 20;
	/**
	 * Text for displaying in browser title when sales screen is shown.
	 */
	this.browserTitle = ko.observable(TextUtils.i18n('TASKS/HEADING_BROWSER_TAB'));
	this.tasksList = ko.observableArray([]);
	this.hiddenTasksList = ko.observableArray([]);
	this.selectedItem = ko.observable(null);
	this.isSearchFocused = ko.observable(false);
	this.searchInput = ko.observable('');
	
	this.selector = new CSelector(
		this.tasksList,
		_.bind(this.viewItem, this),
        this.executeRemove,
		_.bind(this.taskClickCallback, this)
	);
	
	this.searchClick = ko.observable(false);
	this.isSearch = ko.computed(function () {
		return this.searchInput() !== '' && this.searchClick();
	}, this);
	
	this.pageSwitcherLocked = ko.observable(false);
	this.oPageSwitcher = new CPageSwitcherView(0, this.iItemsPerPage);
	this.oPageSwitcher.currentPage.subscribe(function (iCurrentpage) {
		this.currentPage(iCurrentpage);
		this.getTasks();
	}, this);
	this.currentPage = ko.observable(1);
	this.loadingList = ko.observable(false);
	this.preLoadingList = ko.observable(false);
	this.loadingList.subscribe(function (bLoading) {
		this.preLoadingList(bLoading);
	}, this);
	this.sTimeFormat = ko.computed(function () {
		return (UserSettings.timeFormat() === Enums.TimeFormat.F24) ? 'HH:mm' : 'hh:mm A';
	}, this);
	this.isEmptyList = ko.computed(function () {
		return 0 === this.tasksList().length;
	}, this);
	this.searchText = ko.observable('');
	this.showCompleted = ko.observable(false);
	this.actionCompletedText = ko.computed(function () {
		return this.showCompleted() ?  TextUtils.i18n('TASKS/ACTION_HIDE_COMPLETED') : TextUtils.i18n('TASKS/ACTION_SHOW_COMPLETED');
	}, this);	

}

_.extendOwn(CMainView.prototype, CAbstractScreenView.prototype);

CMainView.prototype.ViewTemplate = 'Tasks_MainView';
CMainView.prototype.ViewConstructorName = 'CMainView';

/**
 * Called every time when screen is shown.
 */
CMainView.prototype.onShow = function ()
{
	this.getCalendars();
};

CMainView.prototype.getCalendars = function ()
{
	this.loadingList(true);
	Ajax.send(
			'Calendar',
			'GetCalendars', 
			{
				'IsPublic': false
			}, 
			this.onGetCalendarsResponse, 
			this
	);
};

/**
 * @param {Object} oResponse
 * @param {Object} oParameters
 */
CMainView.prototype.onGetCalendarsResponse = function (oResponse, oParameters)
{
	var
		aCalendarIds = [],
		aNewCalendarIds = [],
		oCalendar = null,
		oClientCalendar = null,
		self = this
	;
	
	if (oResponse.Result)
	{
		_.each(oResponse.Result.Calendars, function (oCalendarData) {
			oCalendar = this.calendars.parseCalendar(oCalendarData);
			
			if (!oCalendar.isShared()) // TODO
			{
				aCalendarIds.push(oCalendar.id);
				oClientCalendar = this.calendars.getCalendarById(oCalendar.id);
				if (this.needsToReload || (oClientCalendar && oClientCalendar.sSyncToken) !== (oCalendar && oCalendar.sSyncToken))
				{
					oCalendar = this.calendars.parseAndAddCalendar(oCalendarData);
					if (oCalendar)
					{
						var calId = oCalendar.id;

						oCalendar.active.subscribe(function (newValue) {
							_.each(self.tasksList(), function(oItem){
								if (oItem.calendarId === calId)
								{
									oItem.visible(newValue);
								}
							});
						}, oCalendar);
						oCalendar.davUrl(Types.pString(oResponse.Result.ServerUrl));
						aNewCalendarIds.push(oCalendar.id);
					}
				}
			}
		}, this);
		
		this.calendars.expunge(aCalendarIds);

		this.getTasks(aCalendarIds);
	}
};

CMainView.prototype.getTasks = function (aNewCalendarIds)
{
	this.loadingList(true);
	Ajax.send(
		'Calendar',
		'GetTasks', 
		{
			'CalendarIds': aNewCalendarIds,
			'Completed': this.showCompleted(),
			'Search': this.searchInput()
		},
		this.onGetTasksResponse,
		this
	);
};

CMainView.prototype.prepareTask = function (oItem)
{
	var
		self = this,
		oCalendar = self.calendars.getCalendarById(oItem.calendarId)
	;
	
	oItem.visibleDate = ko.observable('');

	oItem.withDate = ko.observable(false);
	if (oItem.start && oItem.end)
	{
		oItem.withDate(true);
		oItem.start = moment(oItem.start);
		oItem.end = moment(oItem.end);

		var oMomentStart = oItem.start.clone();
		var oMomentEnd = oItem.end.clone();

		if (oMomentEnd && oItem.allDay)
		{
			oMomentEnd.subtract(1, 'days');
		}
		var isEvOneDay = oMomentEnd.diff(oMomentStart, 'days') === 0;
		var isEvOneTime = oMomentEnd.diff(oMomentStart, 'minutes') === 0;					

		var sStartDate = self.getDateWithoutYearIfMonthWord(oMomentStart.format(self.dateFormatMoment));
		var sEndDate = !isEvOneDay ? ' - ' + self.getDateWithoutYearIfMonthWord(oMomentEnd.format(self.dateFormatMoment)) : '';

		var sStartTime = !oItem.allDay ? ', ' + oMomentStart.format(this.sTimeFormat()) : '';
		var sEndTime = !oItem.allDay && !isEvOneTime ? 
			(isEvOneDay ? ' - ' : ', ')  + oMomentEnd.format(this.sTimeFormat()) : '';

		oItem.visibleDate = ko.observable(
			sStartDate +
			sStartTime +
			sEndDate +
			sEndTime
		);
	}

	oItem.selected = ko.observable(false);
	oItem.checked = ko.observable(oItem.status);
	oItem.visible = ko.observable(oCalendar.active());
	oItem.color = oCalendar.color;
	oItem.checked.subscribe(function(newValue){
		self.updateTaskStatus(oItem);
	});
	return oItem;	
};

CMainView.prototype.getTaskFromList = function (uid)
{
	return _.find(this.tasksList(), function (oItem){
		return oItem.uid === uid;
	});
};

CMainView.prototype.onGetTasksResponse = function (oResponse)
{
	var 
		oResult = oResponse.Result,
		self = this;

	if (oResult)
	{
		var
			aNewCollection = Types.isNonEmptyArray(oResult) ? _.compact(_.map(oResult, function (oItem) {
				return self.prepareTask(oItem);
			})) : [];
			
		this.tasksList(aNewCollection);
		this.sortTasksList();
		this.loadingList(false);
	}
};

CMainView.prototype.viewItem = function (oItem)
{
	this.selectedItem(oItem);
};

CMainView.prototype.onBind = function ()
{
	this.selector.initOnApplyBindings(
		'.sales_sub_list .item',
		'.sales_sub_list .selected.item',
		'.sales_sub_list .selected.item',
		$('.sales_list', this.$viewDom),
		$('.sales_list_scroll.scroll-inner', this.$viewDom)
	);
};

CMainView.prototype.searchSubmit = function ()
{
	if (this.searchInput() !== '')
	{
		this.searchText(
			TextUtils.i18n('TASKS/INFO_SEARCH_RESULT', {
				'SEARCH': this.searchInput()
			})
		);
	}
	else
	{
		this.searchText('');
	}
	
	this.searchClick(true);
	this.tasksList([]);
	this.getCalendars();
};

CMainView.prototype.onClearSearchClick = function ()
{
	// initiation empty search
	this.searchInput('');
	this.searchText('');
	this.searchClick(false);
	this.searchSubmit();
};

CMainView.prototype.createTaskInCurrentCalendar = function ()
{
	this.calendars.pickCurrentCalendar();
	this.createTaskToday(this.calendars.currentCal());
};

/**
 * @param {Object} oCalendar
 */
CMainView.prototype.createTaskToday = function (oCalendar)
{
	this.openTaskPopup(oCalendar, null, null, false);
};

/**
 * @param {Object} oCalendar
 * @param {Object} oStart
 * @param {Object} oEnd
 * @param {boolean} bAllDay
 */
CMainView.prototype.openTaskPopup = function (oCalendar, oStart, oEnd, bAllDay)
{
	if (oCalendar)
	{
		Popups.showPopup(EditTaskPopup, [{
			CallbackSave: _.bind(this.createTask, this),
			CallbackDelete: null,
			Calendars: this.calendars,
			SelectedCalendar: oCalendar ? oCalendar.id : 0,
			Start: oStart,
			End: oEnd,
			AllDay: bAllDay,            
			TimeFormat: this.sTimeFormat(),
			DateFormat: UserSettings.dateFormat(),
            Type: 'VTODO',
			IsTaskApp: true
		}]);
	}
};

/**
 * @param {Object} oEventData
 */
CMainView.prototype.getParamsFromEventData = function (oEventData)
{
	return {
		id: oEventData.id,
		uid: oEventData.uid,
		calendarId: oEventData.calendarId,
		newCalendarId: oEventData.newCalendarId || oEventData.calendarId,
		subject: oEventData.subject,
		allDay: oEventData.allDay ? 1 : 0,
		location: oEventData.location,
		description: oEventData.description,
		alarms: oEventData.alarms ? JSON.stringify(oEventData.alarms) : '[]',
		attendees: oEventData.attendees ? JSON.stringify(oEventData.attendees) : '[]',
		owner: oEventData.owner,
		recurrenceId: oEventData.recurrenceId,
		excluded: oEventData.excluded,
		allEvents: oEventData.allEvents,
		modified: oEventData.modified ? 1 : 0,
		start: oEventData.start.local().toDate(),
		end: oEventData.end.local().toDate(),
		startTS: oEventData.start.unix(),
		endTS: oEventData.end ? oEventData.end.unix() : oEventData.end.unix(),
		rrule: oEventData.rrule ? JSON.stringify(oEventData.rrule) : null,
		type: oEventData.type,
		status: oEventData.status,
		withDate: oEventData.withDate
	};
};

/**
 * @param {Object} oEventData
 */
CMainView.prototype.createTask = function (oData)
{
	var aParameters = this.getParamsFromEventData(oData);

	aParameters.calendarId = oData.newCalendarId;
    Ajax.send(
		'Calendar',
		'CreateEvent', 
        aParameters,
        this.onCreateTaskResponse,
		this
	);	
};

CMainView.prototype.sortTasksList = function ()
{
	this.tasksList.sort(function (left, right) {
		if (left.startTS !== null && right.startTS !== null) 
		{
			if (left.startTS === right.startTS) 
			{
				return 0;
			}
			return (left.startTS > right.startTS) ? 1 : -1;
		}
		else
		{
			if (left.startTS === null && right.startTS === null)
			{
				if (left.lastModified === right.lastModified) 
				{
					return 0;
				}
				return (left.lastModified > right.lastModified) ? 1 : -1;
			}
			else
			{
				if (left.startTS === null)
				{
					return 1;
				}
				if (right.startTS === null)
				{
					return -1;
				}
			}
		}
	});
}

CMainView.prototype.onCreateTaskResponse = function (oResponse)
{
	var oResult = oResponse.Result;

	if (oResult)
	{
		var oTask = this.prepareTask(oResult.Events[0]);
		this.tasksList.push(oTask);
		this.sortTasksList();
	}
	else
	{
		Api.showErrorByCode(oResponse);
	}
};

/**
 * @param {Object} oData
 */
CMainView.prototype.taskClickCallback = function (oData)
{
	var
		/**
		 * @param {number} iResult
		 */
		fCallback = _.bind(function (iResult) {
			var oParams = {
					ID: oData.id,
					Uid: oData.uid,
					RecurrenceId: oData.recurrenceId,
					Calendars: this.calendars,
					SelectedCalendar: oData.calendarId,
					AllDay: oData.allDay,
					Location: oData.location,
					Description: oData.description,
					Subject: oData.subject,
					Alarms: oData.alarms,
					Attendees: oData.attendees,
					RRule: oData.rrule,
					Excluded: false,
					Owner: oData.owner,
					Appointment: false,
					OwnerName: oData.ownerName,
					TimeFormat: this.sTimeFormat(),
					DateFormat: UserSettings.dateFormat(),
					AllEvents: iResult,
					CallbackSave: _.bind(this.updateTask, this),
					CallbackDelete: _.bind(this.executeRemove, this),
					Type: oData.type,
					Status: oData.status,
					IsTaskApp: true
				}
			;
			if (iResult !== Enums.CalendarEditRecurrenceEvent.None)
			{
				if (oData.start && oData.end)
				{
					oParams.Start = oData.start.clone();
					oParams.Start = oParams.Start.local();

					oParams.End = oData.end.clone();
					oParams.End = oParams.End.local();
				}
				Popups.showPopup(EditTaskPopup, [oParams]);
			}
		}, this)
	;

	fCallback(Enums.CalendarEditRecurrenceEvent.AllEvents);
};

/**
 * @param {Object} oEventData
 */
CMainView.prototype.updateTask = function (oData)
{
    var aParameters = this.getParamsFromEventData(oData);

    Ajax.send(
		'Calendar',
		'UpdateEvent', 
        aParameters,
		this.onUpdateTaskResponse,
		this
	);	
};

CMainView.prototype.onUpdateTaskResponse = function (oResponse, oArguments)
{
	var oResult = oResponse.Result;

	if (oResult)
	{
		var 
			uid = oResult.Events[0].uid,
			oTask = this.getTaskFromList(uid)
		;
		if(oTask)
		{
			oTask = this.prepareTask(oResult.Events[0]);
			var index = _.findIndex(this.tasksList(), function(oItem){
				return oItem.uid === uid;
			});
			if (index >= 0)
			{
				this.tasksList.splice(index, 1, oTask);
			}
			this.sortTasksList();
		}
	}
	else
	{
		Api.showErrorByCode(oResponse);
	}
};

/**
 * @param {Object} oEventData
 */
CMainView.prototype.executeRemove = function (oData)
{
	Ajax.send(
		'Calendar',
		'DeleteEvent', 
		{
			'calendarId': oData.calendarId,
			'uid': oData.uid
		},
		this.onDeleteTaskResponse,
		this
	);	
	
};

CMainView.prototype.onDeleteTaskResponse = function (oResponse, oArguments)
{
	if (oResponse.Result)
	{
		var 
			uid = oArguments.Parameters.uid,
			oTask = this.getTaskFromList(uid)
		;
		if(oTask)
		{
			this.tasksList(_.without(this.tasksList(), _.findWhere(this.tasksList(), {
				uid: uid
			})));			
		}
	}
	else
	{
		Api.showErrorByCode(oResponse);
	}
};

/**
 * @param {Object} oData
 */
CMainView.prototype.updateTaskStatus = function (oData)
{
	Ajax.send(
		'Calendar',
		'UpdateTask', 
		{
			'CalendarId': oData.calendarId,
			'TaskId': oData.uid,
			'Subject': oData.subject,
			'Status': oData.checked(),
			'WithDate': oData.withDate()
		},
		this.onUpdateTaskStatusResponse,
		this
	);	
};

CMainView.prototype.onUpdateTaskStatusResponse = function (oResponse, oArguments)
{
	if (!oResponse.Result)
	{
		Api.showErrorByCode(oResponse);
	}
};

/**
 * @param {string} sDate
 */
CMainView.prototype.getDateWithoutYearIfMonthWord = function (sDate)
{
	var
		aDate = sDate.split(' '),
		oNowMoment = moment(),
		oNowYear = oNowMoment.format('YYYY')
	;
	
	if (aDate.length === 3 && oNowYear === aDate[2])
	{
		return aDate[0] + ' ' + aDate[1];
	}
	return sDate;
};

CMainView.prototype.onShowCompletedClick = function ()
{
	this.showCompleted(!this.showCompleted());
	this.searchSubmit();
};

module.exports = new CMainView();


/***/ }),

/***/ "tqo6":
/*!**************************************************!*\
  !*** ./modules/CalendarWebclient/js/Settings.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	$ = __webpack_require__(/*! jquery */ "EVdn"),
	
	Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "AFLV")
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


/***/ })

}]);