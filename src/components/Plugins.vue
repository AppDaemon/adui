<template>
  <v-container fluid>
      <EntityTable :headers="plugin_headers" :items="plugins"></EntityTable>
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
            {text: "Callbacks (Instance)", value: "instance_callbacks", width: "10%"},
            {text: "Callbacks (Lifetime)", value: "total_callbacks", width: "10%"},
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
      table_entry.instance_callbacks = state.attributes.instancecallbacks
      table_entry.total_callbacks = state.attributes.totalcallbacks
      return(table_entry)
    }
  }
}
</script>
