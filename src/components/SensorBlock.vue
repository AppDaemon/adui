<template>
  <v-data-iterator
      :items="sensors"
      item-key="name"
      :items-per-page="4"
      hide-default-footer
      class="mx-auto"
  >
    <template v-slot:default="{ items }">
      <v-row>
        <v-col v-for="(sensor, index) in items" v-bind:key="index">
          <v-card outlined min-height="50">
            <v-card-text class="black--text">
              <span class="font-weight-bold">{{ sensor.text }}:</span>
              {{ sensor.hasOwnProperty('formatter') ? sensor.formatter(sensor.state.state) : sensor.state.state }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-data-iterator>
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