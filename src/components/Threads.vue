<template>
  <v-container fluid>
    <SensorBlock class="py-5" :sensors="this.sensors"></SensorBlock>
    <v-divider></v-divider>
    <EntityTable name="Threads" :headers="thread_headers" :items="threads"></EntityTable>
  </v-container>
</template>

<script>
import SensorBlock from "@/components/SensorBlock";
import EntityTable from "@/components/EntityTable";

export default {
  name: 'Threads',
  components: {EntityTable, SensorBlock},
  title: "Threads",
  data: function () {
    return {
      search: "",
      sensors:
          [
            {text: "Current Busy", entity: "admin.sensor.threads_current_busy", state: {state: null}},
            {text: "Max Busy", entity: "admin.sensor.threads_max_busy", state: {state: null}},
            {
              text: "Max Busy Time",
              entity: "admin.sensor.threads_max_busy_time",
              state: {state: null},
              formatter: this.$UTILS.formatDate
            },
            {
              text: "Last Update",
              entity: "admin.sensor.threads_last_action_time",
              state: {state: null},
              formatter: this.$UTILS.formatDate
            },
          ],
      thread_headers:
          [
            {text: "ID", value: "entity_id", width: "10%"},
            {text: "Queue Size", value: "qsize", width: "10%"},
            {
              text: "Callback", value: "callback", width: "15%", formatter: (cb) => {
                return this.$UTILS.formatFixedLen(cb, 30)
              }
            },
            {text: "Last Active", value: "time_called", width: "15%", formatter: this.$UTILS.formatDate},
            {
              text: "Alive", value: "is_alive", width: "10%", icon:
                  {
                    true: {icon: "mdi-checkbox-blank-circle", color: "green"},
                    false: {icon: "mdi-checkbox-blank-circle-outline", color: "red"},
                  }
            },
            {text: "Pinned Apps", value: "pinned_apps", args: 1},
          ],
      threads: [],
      subs: []
    }
  },
  mounted() {
    for (let i = 0; i < this.sensors.length; i++) {
      this.subs.push(this.$SUBS.add_sub("state", this.sensors[i].entity, (entity, action, state) => {
        this.$UTILS.update_sensor_block(entity, action, state, this.sensors)
      }))
    }
    this.subs.push(this.$SUBS.add_sub("state", "admin.thread", (entity, action, state) => {
      this.$UTILS.update_entity_table(entity, action, state, this.threads, this.copy_function)
    }))
  },
  beforeDestroy() {
    this.$SUBS.remove_subs(this.subs)
  },
  methods: {
    copy_function(ns, state, table_entry) {
      table_entry.entity_id = state.entity_id
      table_entry.qsize = state.attributes.q
      table_entry.callback = state.state
      table_entry.time_called = state.attributes.time_called
      table_entry.is_alive = state.attributes.is_alive
      table_entry.pinned_apps = state.attributes.pinned_apps
      return (table_entry)
    }

  }
}
</script>