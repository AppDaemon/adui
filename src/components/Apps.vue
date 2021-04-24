<template>
  <v-container fluid>
      <EntityTable :headers="app_headers" :items="apps"></EntityTable>
  </v-container>
</template>

<script>
import EntityTable from "@/components/EntityTable";

export default {
  name: 'Apps',
  components: {EntityTable},
  title: "Apps",
  data: function () {
    return {
      app_headers:
          [
            {text: "Name", value: "name"},
            {text: "State", value: "state", width: "15%", formatter: (cb) => {return this.$UTILS.formatFixedLen(cb,30)}},
            {text: "Callback (Instance)", value: "instance_callbacks"},
            {text: "Callback (Lifetime)", value: "total_callbacks"},
            {text: "Arguments", value: "args", args: 1},
          ],
      apps: [],
      subs: []
    }
  },
  mounted() {
    this.subs.push(this.$SUBS.add_sub("state", "admin.app", (entity, action, state) => {
      this.$UTILS.update_entity_table(entity, action, state, this.apps, this.copy_function)
    }))
  },
  beforeDestroy() {
    this.$SUBS.remove_subs(this.subs)
  },
  methods: {
    copy_function(state, table_entry)
    {
      table_entry.entity_id = state.entity_id
      table_entry.name = state.attributes.args.class
      table_entry.state = state.state
      table_entry.instance_callbacks = state.attributes.instancecallbacks
      table_entry.total_callbacks = state.attributes.totalcallbacks
      table_entry.args = state.attributes.args
      return(table_entry)
    }
  }
}
</script>
