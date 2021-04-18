<template>
  <v-container fluid>
    <v-card outlined>
      <v-card flat max-width="400" class="ma-1">
        <v-simple-table>
          <tr v-for="(sensor, index) in sensors" v-bind:key="index">
            <th class="text-left font-weight-bold text-sm-body-2">{{ sensor.text }}</th>
            <td class="text-sm-body-2">{{ sensor.state.state }}</td>
          </tr>
        </v-simple-table>
      </v-card>
    </v-card>
    <v-divider></v-divider>
    <v-card outlined>
      <v-data-table
          :headers="thread_headers"
          :items="threads"
          :items-per-page="10"
          class="elevation-1">
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'Threads',
  title: "Threads",
  data: () => ({
    sensors:
        [
          {text: "Current Busy", entity: "admin.sensor.threads_current_busy", state: {state: null}},
          {text: "Maximum Busy", entity: "admin.sensor.threads_max_busy", state: {state: null}},
          {text: "Maximum Busy Time", entity: "admin.sensor.threads_max_busy_time", state: {state: null}, time: true},
          {text: "Last Update", entity: "admin.sensor.threads_last_action_time", state: {state: null}, time: true},
        ],
    thread_headers:
        [
          {text: "ID", value: "entity_id"},
          {text: "Queue Size", value: "attributes.q"},
          {text: "Callback", value: "state"},
          {text: "Last Active", value: "attributes.time_called"},
          {text: "Alive", value: "attributes.is_alive"},
          {text: "Pinned Apps", value: "attributes.pinned_apps"},
        ],
    threads: [],
    subs: []
  }),
  mounted() {
    for (let i = 0; i < this.sensors.length; i++) {
      this.subs.push(this.$AD.add_sub("state", this.sensors[i].entity, this.sensor_change))
    }
    this.subs.push(this.$AD.add_sub("state", "admin.thread", this.thread_change))
  },
  beforeDestroy() {
    this.$AD.remove_subs(this.subs)
  },
  methods: {
    formatDate(date) {
      let dt = new Date(date)
      return (dt.toLocaleString())
    },
    sensor_change(entity, action, state) {
      for (let i = 0; i < this.sensors.length; i++) {
        if (this.sensors[i].entity === entity) {
          if ("time" in this.sensors[i] && this.sensors[i].time === true) {
            state.state = this.formatDate(state.state)
          }
          this.sensors[i].state = state
        }
      }
    },
    thread_change(entity, action, state) {
      console.log(state)
      if (state.attributes.time_called !== "never") {
        state.attributes.time_called = this.formatDate(state.attributes.time_called)
      }
      if (action === "add") {
        this.threads.push(state)
      } else if (action === "update") {
        for (let i = 0; i < this.threads.length; i++) {
          if (this.threads[i].entity_id === entity) {
            this.threads[i] = state
          }
        }
      } else if (action === "delete") {
        let index = -1
        for (let i = 0; i < this.threads.length; i++) {
          if (this.threads[i].entity_id === entity) {
            index = i
          }
        }
        if (index !== -1) {
          this.threads.splice(index, 1)
        }
      }
    },
  }
}

</script>