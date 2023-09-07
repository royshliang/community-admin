<template>
    <div class="wrap">
        <!-- <div class="left" style="visibility:hidden;">
            <DayPilotNavigator id="nav" :config="navigatorConfig" ref="navigator" />
        </div> -->
        <div class="content">
            <DayPilotCalendar id="dp" :config="calendarConfig" ref="calendar" />
        </div>
    </div>
</template>

<script>
    import {ref, onMounted, reactive} from 'vue';
    import { DayPilot, DayPilotCalendar, DayPilotNavigator } from '@daypilot/daypilot-lite-vue'

    export default {
        name: 'ResourceCalendar',

        components: {
            DayPilotCalendar,
            DayPilotNavigator
        },
    
        setup() {
            const calendar = ref(null);
            //const navigator = ref(null);

            // const navigatorConfig = {
            //     showMonths: 3,
            //     skipMonths: 3,
            //     selectMode: "Day",
            //     startDate: "2023-08-01",
            //     selectionDay: "2023-08-01",
            //     onTimeRangeSelected: args => {
            //         calendarConfig.startDate = args.day;
            //     }
            // };
            const calendarConfig = reactive({
                viewType: "Resources",
                startDate: "2023-08-01",
                // startTime: 8,
                // endTime: 22,
                // dayBeginsHour: 10,
                // dayEndshour: 22,
                //heightSpec: "BusinessHoursNoScroll",
                // businessHoursNoScroll: true,
                businessBeginsHour: 11,
                businessEndsHour: 22,
                timeRangeSelectedHandling: "Enabled",
                onTimeRangeSelected: async (args) => {
                    await createEvent(args.start, args.end, args.resource);
                    debugger;
                    calendar.value.control.clearSelection();
                },
                onEventClick: (args) => {
                    debugger;
                    editEvent(args.e);
                },
                eventDeleteHandling: "Disabled",
                onEventMoved: (args) => {
                    debugger;
                    console.log("Event moved", args.e);
                },
                onEventResized: (args) => {
                    console.log("Event resized", args.e);
                },
            });

            // ----- private methods ----- //
            const loadEvents = () => {
                // placeholder for an HTTP call
                const events = [
                    {
                      id: 1,
                      start: "2023-08-01T10:00:00",
                      end: "2023-08-01T11:00:00",
                      resource: "R3",
                      text: "Event 1",
                      barColor: "#6aa84f",
                    },
                    {
                      id: 2,
                      start: "2023-08-01T13:00:00",
                      end: "2023-08-01T16:00:00",
                      resource: "R3",
                      text: "Event 2",
                      barColor: "#f1c232",
                    },
                    {
                      id: 3,
                      start: "2023-08-01T13:30:00",
                      end: "2023-08-01T16:30:00",
                      resource: "R2",
                      text: "Event 3",
                      barColor: "#cc4125",
                    },
                    {
                      id: 4,
                      start: "2023-08-01T10:30:00",
                      end: "2023-08-01T12:30:00",
                      resource: "R2",
                      text: "Event 4",
                    },
                    {
                      id: 5,
                      start: "2023-08-10T10:30:00",
                      end: "2023-08-10T12:30:00",
                      resource: "R2",
                      text: "Event 5",
                    },
                    {
                      id: 6,
                      start: "2023-08-18T10:30:00",
                      end: "2023-08-18T12:30:00",
                      resource: "R2",
                      text: "Event 6",
                    },
                    {
                      id: 7,
                      start: "2023-08-19T10:30:00",
                      end: "2023-08-19T12:30:00",
                      resource: "R2",
                      text: "Event 7",
                    },
                ];
                calendar.value.control.update({events});
                //navigator.value.control.update({events});
            };
            const loadResources = () => {
                const columns = [
                    {name: "Monday", id: "R1"},
                    {name: "Tuesday", id: "R2"},
                    {name: "Wednesday", id: "R3"},
                    {name: "Thursday", id: "R4"},
                    {name: "Friday", id: "R5"},
                    {name: "Saturday", id: "R6"},
                ];
                calendar.value.control.update({columns});
            };
            const editEvent = async (e) => {
                const form = [
                    {name: "Text", id: "text"},
                    {name: "Start", id: "start", type: "datetime", disabled: true},
                    {name: "End", id: "end", type: "datetime", disabled: true},
                    {name: "Resource", id: "resource", type: "select", options: calendar.value.control.columns.list}
                ];
                const data = e.data;
                const modal = await DayPilot.Modal.form(form, data);
                if (modal.canceled) {
                  return;
                }

                calendar.value.control.events.update(modal.result);
            };
            const createEvent = async (start, end, resource) => {
              const form = [
                {name: "Text", id: "text"},
                {name: "Start", id: "start", type: "datetime", disabled: true},
                {name: "End", id: "end", type: "datetime", disabled: true},
                {name: "Resource", id: "resource", type: "select", options: calendar.value.control.columns.list}
              ];
              const data = {
                start,
                end,
                resource,
                id: DayPilot.guid()
              };
              const modal = await DayPilot.Modal.form(form, data);
              debugger;
              if (modal.canceled) {
                return;
              }

              const e = modal.result;
              calendar.value.control.events.add(e);
            };

            onMounted(() => {
                loadResources();
                loadEvents();
            });

            return {
                //navigatorConfig,
                calendarConfig,
                calendar,
                //navigator,
                loadEvents,
                loadResources,
                editEvent,
                createEvent
            };
        },
    }
</script>

<style>
    .wrap {
      display: flex;
    }

    .left {
      margin-right: 10px;
    }

    .content {
      flex-grow: 1;
    }

    .navigator_default_busy.navigator_default_cell {
      border-bottom: 4px solid #ee4f2ecc;
      box-sizing: border-box;
    }
</style>
