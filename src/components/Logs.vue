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
      <template v-slot:top>
        <v-container>
          <v-row>
            <v-col>
              <v-select
                  label="Log"
                  :items="log_names"
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

export default {
  name: 'Logs',
  title: "Logs",
  data: function () {
    return {
      search: null,
      headers:
          [
            {text: "Log Entry", value: "line"},
          ],
      items: [],
      subs: [],
      logs: [],
      log_names: [],
      filterValue: "main_log"
    }
  },
  mounted() {
    // Get list of logs
    this.log_names = this.$SUBS.get_log_list()
    // Subscribe to log events
    this.subs.push(this.$SUBS.add_sub("log", "*", this.process_log))

  },
  beforeDestroy() {
    this.$SUBS.remove_subs(this.subs)
  },
  computed: {
    filteredItems() {
      return this.items.filter((i) => {
        return !this.filterValue || (i.log === this.filterValue);
      })
    }
  },
  methods: {
    process_log(action, data) {
      //console.log(action, data)
      if (action === "update") {
        if (this.items.length >= (this.$SUBS.MAX_LOGS * this.log_names.length)) {
          this.items.pop()
        }
        this.items.unshift(data)
      }
    },
  }
}
</script>
