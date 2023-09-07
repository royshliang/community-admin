<template>
    <DayPilotMonth id="dp" :config="config" :events="events" ref="month" />
  </template>
  
  <script setup>
    import { DayPilot, DayPilotMonth, Modal } from '@daypilot/daypilot-lite-vue'
    import { ref, onMounted, computed } from 'vue';
  
    const month = ref(null)
    const config = ref({
        startDate: new Date().toJSON().split("T")[0],
        eventDeleteHandling: "Update",
  
        onEventMoved: (args) => {
            console.log("Event moved: " + args.e.text());
        },
        onEventResized: (args) => {
            console.log("Event resized: " + args.e.text());
        },
        onEventClicked: async (args) => {
            debugger;
            const form = [
                {name: "Text", id: "text"},
                {name: "Birthday", id: "birthday", dateFormat: "hh:mm:ss"}
            ];
            const modal = await DayPilot.Modal.form(form, args.e.data);
            if (modal.canceled) {
                return;
            }
            this.month.events.update(modal.result);
        },
        onEventDeleted: (args) => {
            console.log("Event resized: " + args.e.text());
        },
        onTimeRangeSelected: async args => {
            debugger;
            // const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");
            // const dp = args.control;
  
            var locations = [
                {name: "Science", id: "helsinki"},
                {name: "Design", id: "berlin"},
                {name: "Architecture", id: "bratislava"},
                {name: "Bucharest", id: "bucharest"},
            ]
            const form = [
                {name: "Text", id: "text"},
                {name: "Time", id: "time", dateFormat: "hh:mm:ss"},
                {name: "Subject", id: "subject", options: locations}      
            ]
  
            const modal = await DayPilot.Modal.form(form, {});
            debugger;
            if (modal.canceled) {
                return;
            }
  
            dp.clearSelection();
                    
            if (modal.canceled) { return; }
            debugger;
            dp.events.add({
                start: args.start,
                end: args.end,
                id: DayPilot.guid(),
                text: modal.result
            });
        },
        onBeforeEventRender: args => {
            args.data.barColor = this.colors[args.data.type];
            if (args.data.locked) {
                args.data.cssClass = "event-locked";
                args.data.text += " (locked)";
            
                args.data.moveDisabled = true;
                args.data.resizeDisabled = true;
                args.data.clickDisabled = true;
                args.data.deleteDisabled = true;
            }
        },
        contextMenu: new DayPilot.Menu({
            items: [
                {text: "Edit...", onClick: args => this.editEvent(args.source) },
                {text: "Delete", symbol: "daypilot.svg#x-4", onClick: args => this.deleteEvent(args.source) },
                {text: "Lock", symbol: "daypilot.svg#padlock", onClick: args => this.lockEvent(args.source) },
                {text: "-"},
                {text: "Duplicate", onClick: args => this.duplicateEvent(args.source) },
                {text: "Postpone", symbol: "daypilot.svg#minichevron-right-4", onClick: args => this.postponeEvent(args.source) },
                {text: "-"},
                {text: "Type", items: [
                        { text: "Event", icon: "icon icon-blue", onClick: args => this.updateEventType(args.source, "event")},
                        { text: "Task", icon: "icon icon-green", onClick: args => this.updateEventType(args.source, "task")},
                        { text: "Reminder", icon: "icon icon-yellow", onClick: args => this.updateEventType(args.source, "reminder")},
                        { text: "Holiday", icon: "icon icon-red", onClick: args => this.updateEventType(args.source, "holiday")},
                    ]
                }
            ],
            onShow: args => {
                const e = args.source;
                const locked = e.data.locked;
          
                // update the lock/unlock text
                args.menu.items[2].text = locked ? "Unlock" : "Lock";
          
                // disable actions for locked
                args.menu.items[0].disabled = locked;
                args.menu.items[1].disabled = locked;
                args.menu.items[5].disabled = locked;
                args.menu.items[7].disabled = locked;
            }
        })
    })
    const colors = computed(() => {
        return {
            "event": "#3c78d8",
            "task": "#6aa84f",
            "reminder": "#f1c232",
            "holiday": "#cc0000",
        }
    })
  
    async function editEvent(e) {
        const form = [
          {name: "Text", id: "text"}
        ];
  
        const modal = await DayPilot.Modal.form(form, e.data);
        if (modal.canceled) {
          return;
        }
  
        this.month.events.update(modal.result);
    }
    async function deleteEvent(e) {
        const modal = await DayPilot.Modal.confirm("Do you really want to delete this event?");
        if (modal.canceled) {
          return;
        }
        this.month.events.remove(e);
    }
    function duplicateEvent(e) {
        const newEvent = {
          ...e.data,
          id: DayPilot.guid()
        };
        this.month.events.add(newEvent);
    }
    function postponeEvent(e) {
        e.data.start = e.start().addDays(1);
        e.data.end = e.end().addDays(1);
        this.month.events.update(e);
    }
    function updateEventType(e, type) {
        e.data.type = type;
        this.month.events.update(e);
    }
    function lockEvent(e) {
        e.data.locked = !e.data.locked;
        this.month.events.update(e);
    }
    function loadEvents() {
        const events = [
          {
            id: 1,
            start: "2022-10-04T00:00:00",
            end: "2022-10-05T00:00:00",
            text: "Event 1",
            type: "event",
            allDay: true
          },
          {
            id: 2,
            start: "2022-10-05T00:00:00",
            end: "2022-10-06T00:00:00",
            text: "Reminder",
            type: "reminder"
          },
          {
            id: 3,
            start: "2022-10-05T00:00:00",
            end: "2022-10-06T00:00:00",
            text: "Task 1",
            type: "task"
          },
          {
            id: 4,
            start: "2022-10-10T00:00:00",
            end: "2022-10-11T00:00:00",
            text: "Holiday",
            type: "holiday",
            locked: true
          },
        ];
    }
  
    onMounted(() => {
        loadEvents();
    })
  </script>