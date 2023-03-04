<template>
  <v-container fluid>
      <EntityTable name="Plugins" :headers="plugin_headers" :items="plugins"></EntityTable>
  </v-container>
</template>

<script>
import EntityTable from "@/components/EntityTable";

export default {
  name: 'Plugins',
  components: {EntityTable},
  title: "Plugins",
  data: function () {
    return {
      plugin_headers:
          [
            {text: "Name", value: "entity_id", width: "15%"},
            {text: "State", value: "state", width: "15%", formatter: (cb) => {return this.$UTILS.formatFixedLen(cb,30)}},
            {text: "Requests Sent/s", value: "requests_sent_ps", width: "10%"},
            {text: "Updates Recv/s", value: "updates_recv_ps", width: "10%"},
            {text: "Bytes Sent", value: "bytes_sent_ps", width: "10%"},
            {text: "Bytes Recv", value: "bytes_recv_ps", width: "10%"},
          ],
      plugins: [],
      subs: []
    }
  },
  mounted() {
    this.subs.push(this.$SUBS.add_sub("state", "admin.plugin", (entity, action, state) => {
      this.$UTILS.update_entity_table(entity, action, state, this.plugins, this.copy_function)
    }))
  },
  beforeDestroy() {
    this.$SUBS.remove_subs(this.subs)
  },
  methods: {
    copy_function(ns, state, table_entry)
    {
      table_entry.entity_id = state.entity_id
      table_entry.state = state.state
      table_entry.requests_sent_ps = state.attributes.requests_sent_ps
      table_entry.updates_recv_ps = state.attributes.updates_recv_ps
      table_entry.bytes_sent_ps = this.$UTILS.intToString(state.attributes.bytes_sent_ps)
      table_entry.bytes_recv_ps = this.$UTILS.intToString(state.attributes.bytes_recv_ps)
      return(table_entry)
    }
  }
}
</script>
