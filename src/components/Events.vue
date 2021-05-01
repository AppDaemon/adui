<template>
  <v-container fluid>
    <v-data-table
        :headers="headers"
        :items="items"
        disable-pagination
        fixed-header
        hide-default-footer
        disable-sort
        dense
        :search="search"
    >
      <template v-slot:item.data="{ item }">
        <json-viewer :value="JSON.stringify(item)"></json-viewer>
      </template>
      <template v-slot:item.data.metadata.time_fired="{ item }">
        {{new Date(item.data.metadata.time_fired).toLocaleString()}}
      </template>
            <template v-slot:top>
        <v-layout>
          <v-row>
            <v-spacer></v-spacer>
            <v-col>
              <v-text-field
                  prepend-icon="mdi-magnify"
                  label="Search"
                  v-model="search"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-layout>
      </template>

    </v-data-table>
  </v-container>
</template>


<script>
import JsonViewer from 'vue-json-viewer'

export default {
  name: 'Events',
  components: {JsonViewer},
  title: "Events",
  data: function () {
    return {
      search: null,
      headers:
      [
          {text: "Event Type", value: "event_type", width: "10%"},
          {text: "Namespace", value: "namespace", width: "10%"},
          {text: "Time Fired", value: "data.metadata.time_fired", width: "15%"},
          {text: "Event Data", value: "data"},
      ],
      items: [],
      subs: []
    }
  },
  mounted() {
    // Subscribe to events namespace additions
    this.subs.push(this.$SUBS.add_sub("event", "*", this.process_event))
  },
  beforeDestroy() {
    this.$SUBS.remove_subs(this.subs)
  },
  methods: {
    process_event(data) {
      if (this.items.length >= 1000)
      {
        this.items.pop()
      }
      this.items.unshift(data)
    },
  }
}
</script>
