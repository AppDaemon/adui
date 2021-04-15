<template>
  <v-app-bar
      app
      color="indigo"
      dark
      height="50"
  >
    <v-toolbar-title>AppDaemon</v-toolbar-title>
    <v-spacer></v-spacer>

    <template v-if="connected">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on">mdi-lan-connect</v-icon>
        </template>
        <span>Connected</span>
      </v-tooltip>
    </template>
    <template v-else>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on">mdi-lan-disconnect</v-icon>
        </template>
        <span>Disconnected</span>
      </v-tooltip>
    </template>

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
    connected: false,
    menu: [
      {option: "Logout", callback: logout},
    ]
  }),
  mounted() {
    this.$AD.add_sub("connect", null, this.connect_change)
  },
  methods: {
    connect_change(connected) {
      this.connected = connected
    },
  }
}

function logout() {
  console.log("Logout")
}

</script>