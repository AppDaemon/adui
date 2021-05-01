<template>
  <v-container fluid>
    <v-data-table
        :headers="headers"
        :items="filteredItems"
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
      <template v-slot:item.time_received="{ item }">
        {{ item.time_received.toLocaleString() }}
      </template>
      <template v-slot:top>
        <v-container>
          <v-row>
            <v-col>
              <v-select
                  label="Namespace"
                  :items="ns"
                  v-model="filterValue"
              ></v-select>
            </v-col>
            <v-spacer></v-spacer>
            <v-col>
              <v-text-field
                  prepend-icon="mdi-magnify"
                  label="Search"
                  v-model="search"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
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
            {text: "Time Received", value: "time_received", width: "15%"},
            {text: "Event Data", value: "data"},
          ],
      items: [],
      subs: [],
      ns: [],
      filterValue: "admin"
    }
  },
  mounted() {
    // Subscribe to events namespace additions
    this.ns = this.$SUBS.get_namespaces()
    this.subs.push(this.$SUBS.add_sub("event", "*", this.process_event))
    // Subscribe to any namespace additions
    this.subs.push(this.$SUBS.add_sub("namespace", "*", this.process_namespace))

  },
  beforeDestroy() {
    this.$SUBS.remove_subs(this.subs)
  },
  computed: {
    filteredItems() {
      return this.items.filter((i) => {
        return !this.filterValue || (i.namespace === this.filterValue);
      })
    }
  },
  methods: {
    process_event(data) {
      if (this.items.length >= this.$SUBS.MAX_EVENTS) {
        this.items.pop()
      }
      this.items.unshift(data)
    },
    process_namespace(ns, action) {
      if (action === "add") {
        this.ns.push(ns)
      }
    },

  }
}
</script>
