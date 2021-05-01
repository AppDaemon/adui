<template>
  <v-navigation-drawer
      app
      :mini-variant="mini"
  >
    <v-card flat height="50">
      <v-list-item>
        <v-list-item-icon @click.stop="mini = !mini">
          <v-icon>mdi-menu</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>MENU</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-card>
    <v-divider></v-divider>
    <v-list>
      <v-list-item
          v-for="item in this.$TABS"
          :key="item.title"
          :to="item.nav"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'Sidebar',
  data: function () {
    return {
      mini: true,
      items: []
    }
  },
  methods: {}
}

</script>