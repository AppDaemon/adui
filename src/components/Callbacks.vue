<template>
  <v-container fluid>
    <SensorBlock class="py-5" :sensors="this.sensors"></SensorBlock>
    <v-divider></v-divider>
    <EntityTable class="py-5" name="Scheduler Callbacks" :headers="scheduler_headers" :items="scheduler_callbacks"></EntityTable>
    <v-divider></v-divider>
    <EntityTable class="py-5" name="State Callbacks" :headers="state_headers" :items="state_callbacks"></EntityTable>
    <v-divider></v-divider>
    <EntityTable class="py-5" name="Event Callbacks" :headers="event_headers" :items="event_callbacks"></EntityTable>
  </v-container>
</template>

<script>
import EntityTable from "@/components/EntityTable";
import SensorBlock from "@/components/SensorBlock";

export default {
  name: 'Callbacks',
  components: {EntityTable, SensorBlock},
  title: "Callbacks",
  data: function () {
    return {
      search: "",
      sensors:
          [
            {text: "Total Callbacks Fired", entity: "admin.sensor.callbacks_total_executed", state: {state: null}},
            {text: "Total Callbacks Executed", entity: "admin.sensor.callbacks_total_fired", state: {state: null}},
            {
              text: "Average Callbacks/s Executed",
              entity: "admin.sensor.callbacks_average_fired",
              state: {state: null}
            },
            {
              text: "Average Callbacks/s Fired",
              entity: "admin.sensor.callbacks_average_executed",
              state: {state: null}
            },
          ],
      scheduler_headers:
          [
            {text: "App", value: "app", width: "10%"},
            {text: "Execution Time", value: "execution", width: "15%", formatter: this.$UTILS.formatDate},
            {text: "Repeat", value: "repeat", width: "10%"},
            {text: "Callback", value: "callback", width: "10%"},
            {text: "Fired", value: "fired", width: "8%"},
            {text: "Executed", value: "executed", width: "8%"},
            {
              text: "Pinned", value: "pinned", width: "8%", icon:
                  {
                    true: {icon: "mdi-check", color: "black"},
                    false: {icon: "", color: "black"},
                  }
            },
            {text: "Thread", value: "thread", width: "8%"},
            {text: "Kwargs", value: "kwargs", args: 1},
          ],
      scheduler_callbacks: [],
      state_headers:
          [
            {text: "App", value: "app", width: "10%"},
            {text: "Last Executed", value: "last_executed", width: "15%", formatter: this.$UTILS.formatDate},
            {text: "Entity", value: "entity", width: "10%"},
            {text: "Callback", value: "callback", width: "10%"},
            {text: "Fired", value: "fired", width: "8%"},
            {text: "Executed", value: "executed", width: "8%"},
            {
              text: "Pinned", value: "pinned", width: "8%", icon:
                  {
                    true: {icon: "mdi-check", color: "black"},
                    false: {icon: "", color: "black"},
                  }
            },
            {text: "Thread", value: "thread", width: "8%"},
            {text: "Kwargs", value: "kwargs", args: 1},
          ],
      state_callbacks: [],
      event_headers:
          [
            {text: "App", value: "app", width: "10%"},
            {text: "Last Executed", value: "last_executed", width: "15%", formatter: this.$UTILS.formatDate},
            {text: "Event Name", value: "event", width: "10%"},
            {text: "Callback", value: "callback", width: "10%"},
            {text: "Fired", value: "fired", width: "8%"},
            {text: "Executed", value: "executed", width: "8%"},
            {
              text: "Pinned", value: "pinned", width: "8%", icon:
                  {
                    true: {icon: "mdi-check", color: "black"},
                    false: {icon: "", color: "black"},
                  }
            },
            {text: "Thread", value: "thread", width: "8%"},
            {text: "Kwargs", value: "kwargs", args: 1},
          ],
      event_callbacks: [],
      subs: []
    }
  },
  mounted() {
    for (let i = 0; i < this.sensors.length; i++) {
      this.subs.push(this.$SUBS.add_sub("state", this.sensors[i].entity, (entity, action, state) => {
        this.$UTILS.update_sensor_block(entity, action, state, this.sensors)
      }))
    }
    this.subs.push(this.$SUBS.add_sub("state", "admin.scheduler_callback", (entity, action, state) => {
      this.$UTILS.update_entity_table(entity, action, state, this.scheduler_callbacks, this.scheduler_copy_function)
    }))
    this.subs.push(this.$SUBS.add_sub("state", "admin.state_callback", (entity, action, state) => {
      this.$UTILS.update_entity_table(entity, action, state, this.state_callbacks, this.state_copy_function)
    }))
    this.subs.push(this.$SUBS.add_sub("state", "admin.event_callback", (entity, action, state) => {
      this.$UTILS.update_entity_table(entity, action, state, this.event_callbacks, this.event_copy_function)
    }))
  },
  beforeDestroy() {
    this.$SUBS.remove_subs(this.subs)
  },
  methods: {
    scheduler_copy_function(ns, state, table_entry) {
      table_entry.entity_id = state.entity_id
      table_entry.app = state.attributes.app
      table_entry.execution = state.attributes.execution_time
      table_entry.repeat = state.attributes.repeat
      table_entry.callback = state.attributes.function
      table_entry.fired = state.attributes.fired
      table_entry.executed = state.attributes.executed
      table_entry.pinned = state.attributes.pinned
      table_entry.thread = state.attributes.pinned_thread
      table_entry.kwargs = state.attributes.kwargs
      return (table_entry)
    },
    state_copy_function(ns, state, table_entry) {
      table_entry.entity_id = state.entity_id
      table_entry.app = state.attributes.app
      table_entry.last_executed = state.last_changed,
          table_entry.entity = state.attributes.listened_entity
      table_entry.callback = state.attributes.function
      table_entry.fired = state.attributes.fired
      table_entry.executed = state.attributes.executed
      table_entry.pinned = state.attributes.pinned
      table_entry.thread = state.attributes.pinned_thread
      table_entry.kwargs = state.attributes.kwargs
      return (table_entry)
    }
    ,
    event_copy_function(ns, state, table_entry) {
      table_entry.entity_id = state.entity_id
      table_entry.app = state.attributes.app
      table_entry.last_executed = state.last_changed,
          table_entry.event = state.attributes.event_name
      table_entry.callback = state.attributes.function
      table_entry.fired = state.attributes.fired
      table_entry.executed = state.attributes.executed
      table_entry.pinned = state.attributes.pinned
      table_entry.thread = state.attributes.pinned_thread
      table_entry.kwargs = state.attributes.kwargs
      return (table_entry)
    }
  },
}
</script>
