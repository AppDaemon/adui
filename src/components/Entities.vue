<template>
  <v-container fluid>
    <EntityTable
        filterTitle="Namespace"
        filterDefault="admin"
        :filterKeys="ns"
        :headers="entity_headers"
        :items="entities"></EntityTable
    >
  </v-container>
</template>

<script>
import EntityTable from "@/components/EntityTable";

export default {
  name: 'Entities',
  components: {EntityTable},
  title: "Entities",
  data: function () {
    return {
      ns: [],
      search: "",

      entity_headers:
          [
            {text: "Name", value: "entity_id"},
            {
              text: "State", value: "state", width: "15%", formatter: (cb) => {
                return this.$UTILS.formatFixedLen(cb, 30)
              }
            },
            {text: "Last Changed", value: "last_changed", formatter: this.$UTILS.formatDate},
            {text: "Attributes", value: "attributes", args: 1},
          ],
      entities: [],
      subs: []
    }
  },
  mounted() {
    this.subs.push(this.$SUBS.add_sub("namespace", "*", this.process_namespace))
    /*this.subs.push(this.$SUBS.add_sub("state", "*", (entity, action, state) => {
      this.$UTILS.update_entity_table(entity, action, state, this.entities, this.copy_function)*/
  },
  beforeDestroy() {
    this.$SUBS.remove_subs(this.subs)
  },
  methods: {
    process_namespace(ns, action) {
      if (action === "add") {
        this.ns.push(ns)
        this.subs.push(this.$SUBS.add_sub("state", ns, (entity, action, state) => {
          this.$UTILS.update_entity_table(entity, action, state, this.entities, this.copy_function)
        }))
      }
    },
    copy_function(ns, state, table_entry) {
      table_entry.entity_id = state.entity_id
      table_entry.ns = ns
      table_entry.state = state.state
      table_entry.last_changed = state.last_changed
      table_entry.attributes = state.attributes
      return (table_entry)
    }
  }
}
</script>
