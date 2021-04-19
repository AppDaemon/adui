<template>
  <v-tabs v-model="tab" grow>
    <v-tab href="#apps">Apps</v-tab>
    <v-tab href="#entities">Entities</v-tab>
    <v-tab href="#threads">Threads</v-tab>
    <v-tab href="#callbacks">Callbacks</v-tab>
    <v-tabs-items :value="tab">
      <v-tab-item value="apps">
        <Apps></Apps>
      </v-tab-item>
      <v-tab-item value="entities">
        Entities
      </v-tab-item>
      <v-tab-item value="threads">
        <Threads></Threads>
      </v-tab-item>
      <v-tab-item value="callbacks">
        Callbacks
      </v-tab-item>
    </v-tabs-items>
  </v-tabs>

</template>

<script>
import Threads from "../components/Threads";
import Apps from "../components/Apps";

export default {
  title: 'State',
  components: {
    Threads,
    Apps
  },
  mounted()
  {
        this.$emit('update-title', "State")
  },
  computed: {
    tab: {
      set(tab) {
        this.$router.replace({query: {...this.$route.query, tab}})
      },
      get() {
        return this.$route.query.tab
      }
    }
  },
}
</script>

