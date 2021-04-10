<template>
  <v-app>
    <v-navigation-drawer
        v-model="drawer"
        app
        temporary
    >
        <v-list-item>
          <v-list-item-title>
            AppDaemon Menu
          </v-list-item-title>
        </v-list-item>
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
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
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
    drawer: null,
    items: [
          { title: 'Admin UI', icon: 'mdi-chemical-weapon', nav: "/" },
          { title: 'Dashboards', icon: 'mdi-tablet-dashboard' , nav: "/dashboards"},
          { title: 'App Management', icon: 'mdi-apps' , nav: "/appmanagement"},
          { title: 'Sequences', icon: 'mdi-step-forward-2' , nav: "/sequences"},
          { title: 'Rules', icon: 'mdi-ruler-square-compass' , nav: "/rules"},
        ],
  })
}
</script>