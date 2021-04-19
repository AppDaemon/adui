<template>
  <v-container fluid>
    <v-card flat>
      <EntityTable :headers="app_headers" :items="apps"></EntityTable>
    </v-card>
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
      search: "",
      app_headers:
          [
            {text: "Name", value: "entity_id"},
            {text: "State", value: "state"},
            {text: "Callback (Instance)", value: "attributes.instancecallbacks"},
            {text: "Callback (Lifetime)", value: "attributes.totalcallbacks"},
            {text: "Arguments", value: "attributes.args", formatter: this.$UTILS.formatArgs},
          ],
      apps: [],
      subs: []
    }
  },
  mounted() {
    this.subs.push(this.$SUBS.add_sub("state", "admin.app", (entity, action, state) => {
      this.$UTILS.update_entity_table(entity, action, state, this.apps)
    }))
  },
  beforeDestroy() {
    this.$SUBS.remove_subs(this.subs)
  },
  methods: {
  }
}
</script>
