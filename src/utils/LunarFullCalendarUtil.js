/**
 * LunarFullCalendar
 * */

import { getRefPromise } from '@/utils/JEditableTableUtil'

/* View type of calendar */
const calendarViewType = {
  month: 'month', // MonthView
  basicWeek: 'basicWeek',  // Base week view
  basicDay: 'basicDay',//  Base sky view
  agendaWeek: 'agendaWeek', // Weekly Agenda View
  agendaDay: 'agendaDay', // Agenda day view
}

/* Defining the default view */
const defaultView = calendarViewType.month

/* Define the calendar default configuration */
const defaultSettings = {
  locale: 'zh-cn',

  buttonText: {
    today: 'Today',
    month: 'Month',
    week: 'Week',
    day: 'Day'
  },
  // Head arrangement
  header: {
    left: 'prev,next, today',
    center: 'title',
    right: 'hide, custom, month,agendaWeek,agendaDay'
  },
  //Click on today's list chart
  eventLimitClick: 'day',
  // Hide events beyond
  eventLimit: true,
  // Set the start date of each week to Sunday
  firstDay: 0,
  // Default display view
  defaultView,
  timeFormat: 'H:mm',
  axisFormat: 'H:mm',
  // Whether to display all-day in the Agenda view
  allDaySlot: true,
  // The all-day text is displayed in the Agenda view
  allDayText: '全天',
  // Time zone is local by default
  timezone: 'local',
  // Week view and day view on the left side of the time display
  slotLabelFormat: 'HH:mm',
  // Set the threshold for the next day
  nextDayThreshold: '00:00:00',
}

/** Some enhancements are provided */
const CalendarMixins = {
  data() {
    return {
      calenderCurrentViewType: defaultView
    }
  },
  methods: {

    getCalendarConfigEventHandler() {
      return {
        // Handles the View Changed event
        viewRender: (view, element) => {
          let { type } = view

          let lastViewType = this.calenderCurrentViewType
          this.calenderCurrentViewType = type

          if (typeof this.handleViewRender === 'function') {
            this.handleViewRender(type, view, element)
          }

          if (lastViewType !== this.calenderCurrentViewType && typeof this.handleViewChanged === 'function') {
            this.handleViewChanged(type, view, element)
          }

        },
      }
    },

    /** Get LunarFullCalendar instance, ref = baseCalendar */
    getCalendar(fn) {
      return getRefPromise(this, 'baseCalendar').then(fn)
    },

    calendarEmit(name, data) {
      this.getCalendar(ref => ref.$emit(name, data))
    },

    /** Force reloading of all events (schedules)*/
    calendarReloadEvents() {
      this.calendarEmit('reload-events')
    }
  }
}

export { defaultSettings, calendarViewType, CalendarMixins }