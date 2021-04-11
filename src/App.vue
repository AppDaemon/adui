<template>
  <v-app>
    <v-navigation-drawer
        app
        :mini-variant="mini"
    >
      <v-list height="50">
        <v-list-item>
          <v-list-item-icon @click.stop="mini = !mini">
            <v-icon>mdi-menu</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>AppDaemon Menu</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>

      <v-list>
        <v-list-item
            v-for="item in items"
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

    <v-app-bar
        app
        color="indigo"
        dark
        height="50"
    >
      <v-toolbar-title>AppDaemon</v-toolbar-title>
    </v-app-bar>


    <v-main>
      <router-view/>
    </v-main>
    <v-footer
        color="indigo"
        app
    >
      <span class="white--text">&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    mini: true,
    items: [
      {title: 'Admin UI', icon: 'mdi-chemical-weapon', nav: "/"},
      {title: 'Dashboards', icon: 'mdi-tablet-dashboard', nav: "/dashboards"},
      {title: 'App Management', icon: 'mdi-apps', nav: "/appmanagement"},
      {title: 'Sequences', icon: 'mdi-step-forward-2', nav: "/sequences"},
      {title: 'Rules', icon: 'mdi-ruler-square-compass', nav: "/rules"},
    ],
  }),
  mounted() {
    //alert(this.$AD.fred)
  }
}
</script>