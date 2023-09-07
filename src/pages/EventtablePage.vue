<template>
    <div class="wrap">
        <div class="left">
            <DayPilotNavigator id="nav" :config="datePickerConfig" ref="datePicker" :events="events" />
        </div>
        <div class="content">
            <DayPilotCalendar id="dp" :config="calendarConfig" ref="calendar" :events="events" />
        </div>
    </div>
</template>

<script setup>
    import { ref, reactive, onMounted } from 'vue'
    import {DayPilot, DayPilotCalendar, DayPilotNavigator} from '@daypilot/daypilot-lite-vue'

    const events = ref([])
    const calendar = ref(null)
    const datePicker = ref(null)

    const datePickerConfig = ref({
        showMonths: 3,
        skipMonths: 3,
        selectMode: "Week",
        startDate: "2022-06-01",
        selectionDay: "2022-06-06",
        onTimeRangeSelected: args => {
            calendarConfig.value.startDate = args.day
        }
    })
    const calendarConfig = ref({
        viewType: "Week",
        startDate: "2022-06-06",
        timeRangeSelectedHandling: "Enabled",
        eventDeleteHandling: "Disabled",

        onTimeRangeSelected: async (args) => {
            const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1")
            const dp = args.control
            dp.clearSelection()
            if (modal.canceled) {
              return;
            }
            dp.events.add({
                start: args.start,
                end: args.end,
                id: DayPilot.guid(),
                text: modal.result
            });
        },


        onEventMoved: () => {
            console.log("Event moved")
        },
        onEventResized: () => {
            console.log("Event resized")
        }
    })

    onMounted(() => {
      // const dayevents = [
      //   {
      //     id: 1,
      //     start: "2022-06-05T10:00:00",
      //     end: "2022-06-05T11:00:00",
      //     text: "Event 1",
      //     barColor: "#6aa84f",
      //   },
      //   {
      //     id: 2,
      //     start: "2022-06-09T13:00:00",
      //     end: "2022-06-09T16:00:00",
      //     text: "Event 2",
      //     barColor: "#f1c232",
      //   },
      //   {
      //     id: 3,
      //     start: "2022-06-10T13:30:00",
      //     end: "2022-06-10T16:30:00",
      //     text: "Event 3",
      //     barColor: "#cc4125",
      //   },
      //   {
      //     id: 4,
      //     start: "2022-06-10T10:30:00",
      //     end: "2022-06-10T12:30:00",
      //     text: "Event 4"
      //   },
      //   {
      //     id: 5,
      //     start: "2022-05-30T10:30:00",
      //     end: "2022-05-30T12:30:00",
      //     text: "Event 5"
      //   },
      //   {
      //     id: 6,
      //     start: "2022-06-14T10:30:00",
      //     end: "2022-06-14T12:30:00",
      //     text: "Event 6"
      //   },
      // ];

      // ***** must set once to empty arraym if not the DayPilotNavigator will not highlight busy days ***** //
      events.value = []
    })
</script>

<!-- cannot use scoped as the css will not be applied -->
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
    .calendar_default_event_inner {
        border-radius: 5px;
    }

    .navigator_default_busy.navigator_default_cell {
        background-color: #ee4f2e;
        border-radius: 15px;
        color: white;
    }
</style>