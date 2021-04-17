<template>
  <v-card>
    <br>{{ sensors["admin.sensor.threads_current_busy"] }}
    <br>{{ sensors["admin.sensor.threads_max_busy"] }}
    <br>{{ sensors["admin.sensor.threads_max_busy_time"] }}
    <br>{{ sensors["admin.sensor.threads_last_action_time"] }}
  </v-card>
</template>

<script>
export default {
  name: 'Threads',
  title: "Threads",
  data: () => ({
    sensors:
        {
          "admin.sensor.threads_current_busy": 0,
          "admin.sensor.threads_max_busy": 0,
          "admin.sensor.threads_max_busy_time": "Never",
          "admin.sensor.threads_last_action_time": "Never",
        }
  }),
  mounted() {
    this.$AD.add_sub("state", this.sensors, this.sensor_change)
  },
  methods: {
    sensor_change(entity, action, state) {
      this.sensors[entity] = state.state
    },
  }
}

</script>