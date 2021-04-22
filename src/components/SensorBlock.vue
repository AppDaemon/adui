<template>
  <v-simple-table>
    <tr v-for="(sensor, index) in sensors" v-bind:key="index">
      <th class="text-left font-weight-bold text-sm-body-2">{{ sensor.text }}</th>
      <td class="text-sm-body-2">
        {{ sensor.hasOwnProperty('formatter') ? sensor.formatter(sensor.state.state) : sensor.state.state }}
      </td>
    </tr>
  </v-simple-table>
</template>

<script>
export default {
  name: 'SensorBlock',
  mounted() {
  },
  beforeDestroy() {
  },
  props:
      {
        sensors: Array,
        name: String
      },
  methods: {
    formatDate(date) {
      return this.$UTILS.formatDate(date)
    },
  }
}
</script>