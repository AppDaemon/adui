<template>
  <v-app-bar
      app
      color="indigo"
      dark
      height="50"
  >
    <v-toolbar-title>AppDaemon</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <!--

          <v-btn icon>
            <v-icon>mdi-heart</v-icon>
          </v-btn>

          <v-btn icon>
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
    -->

    <v-menu
        left
        bottom
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
            icon
            v-bind="attrs"
            v-on="on"
        >
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
            v-for="entry in menu"
            :key="entry.option"
            @click="entry.callback"
        >
          <v-list-item-title>{{ entry.option }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
export default {
  name: 'TopBar',
  data: () => ({
    menu: [
      {option: "Logout", callback: logout},
    ]
  }),
  methods: {}
}

function logout() {
  console.log("Logout")
}

</script>