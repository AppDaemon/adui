<template>
  <v-container fluid>
    <EntityTable
        name="Entities"
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
            {text: "Name", value: "entity_id", width: "30%"},
            {
              text: "State", value: "state", width: "15%", formatter: (cb) => {
                return this.$UTILS.formatFixedLen(cb, 30)
              }
            },
            {text: "Last Changed", value: "last_changed", width: "20%", formatter: this.$UTILS.formatDate},
            {text: "Attributes", value: "attributes", args: 1},
          ],
      entities: [],
      subs: []
    }
  },
  mounted() {
    // Get all namespaces and subscribe
    let ns = this.$SUBS.get_namespaces()
    for (let i = 0; i < ns.length; i++) {
      this.subs.push(this.$SUBS.add_sub("state", ns[i], (entity, action, state) => {
        this.$UTILS.update_entity_table(entity, action, state, this.entities, this.copy_function)
      }))
      this.ns.push(ns[i])
    }
    // Subscribe to any namespace additions
    this.subs.push(this.$SUBS.add_sub("namespace", "*", this.process_namespace))
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
