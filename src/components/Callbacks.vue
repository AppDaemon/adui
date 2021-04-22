<template>
  <v-container fluid>
    <v-card flat max-width="400" class="ma-3">
      <SensorBlock :sensors="this.sensors"></SensorBlock>
    </v-card>
    <v-divider></v-divider>
    <EntityTable name="Scheduler Callbacks" :headers="scheduler_headers" :items="scheduler_callbacks"></EntityTable>
    <EntityTable name="State Callbacks" :headers="state_headers" :items="state_callbacks"></EntityTable>
    <EntityTable name="Event Callbacks" :headers="event_headers" :items="event_callbacks"></EntityTable>
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
            {
              text: "Average Callbacks/s Fired",
              entity: "admin.sensor.callbacks_average_executed",
              state: {state: null}
            },
            {text: "Total Callbacks Executed", entity: "admin.sensor.callbacks_total_fired", state: {state: null}},
            {
              text: "Average Callbacks/s Executed",
              entity: "admin.sensor.callbacks_average_fired",
              state: {state: null}
            },
          ],
      scheduler_headers:
          [
            {text: "App", value: "app"},
            {text: "Execution Time", value: "execution", formatter: this.$UTILS.formatDate},
            {text: "Repeat", value: "repeat"},
            {text: "Callback", value: "callback"},
            {text: "Fired", value: "fired"},
            {text: "Executed", value: "executed"},
            {text: "Pinned", value: "pinned", icon:
                  {
                    true: {icon: "mdi-check", color: "black"},
                    false: {icon: "", color: "black"},
                  }
            },
            {text: "Thread", value: "thread"},
            {text: "Kwargs", value: "kwargs", formatter: this.$UTILS.formatArgs},
          ],
      scheduler_callbacks: [],
      state_headers:
          [
            {text: "App", value: "app"},
            {text: "Last Executed", value: "last_executed", formatter: this.$UTILS.formatDate},
            {text: "Entity", value: "entity"},
            {text: "Callback", value: "callback"},
            {text: "Fired", value: "fired"},
            {text: "Executed", value: "executed"},
            {text: "Pinned", value: "pinned", icon:
                  {
                    true: {icon: "mdi-check", color: "black"},
                    false: {icon: "", color: "black"},
                  }
            },
            {text: "Thread", value: "thread"},
            {text: "Kwargs", value: "kwargs", formatter: this.$UTILS.formatArgs},
          ],
      state_callbacks: [],
      event_headers:
          [
            {text: "App", value: "app"},
            {text: "Last Executed", value: "last_executed", formatter: this.$UTILS.formatDate},
            {text: "Event Name", value: "event"},
            {text: "Callback", value: "callback"},
            {text: "Fired", value: "fired"},
            {text: "Executed", value: "executed"},
            {text: "Pinned", value: "pinned", icon:
                  {
                    true: {icon: "mdi-check", color: "black"},
                    false: {icon: "", color: "black"},
                  }
            },
            {text: "Thread", value: "thread"},
            {text: "Kwargs", value: "kwargs", formatter: this.$UTILS.formatArgs},

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
    scheduler_copy_function(state, table_entry) {
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
    state_copy_function(state, table_entry) {
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
    event_copy_function(state, table_entry) {
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
