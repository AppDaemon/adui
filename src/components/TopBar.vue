<template>
  <v-app-bar
      app
      color="indigo"
      dark
      height="50"
  >
    <v-toolbar-title>AppDaemon {{ version }}</v-toolbar-title>
    <v-spacer></v-spacer>
    {{ title }}
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
  data: function () {
    return {
      connected: false,
      version: "",
      menu: [
        {option: "Logout", callback: this.logout},
      ],
      subs: []
    }
  },
  props:
      {
        title: String
      },
  mounted() {
    // Subscribe to some stuff
    this.subs.push(this.$SUBS.add_sub("connect", null, this.connect_change))
    this.subs.push(this.$SUBS.add_sub("state", "admin.sensor.appdaemon_version", this.version_change))
  },
  beforeDestroy() {
    this.$SUBS.remove_subs(this.subs)
  },
  methods: {
    connect_change(entity, action, connected) {
      this.connected = connected
    },
    version_change(entity, action, state) {
      this.version = "v" + state.state
    },
    logout()
    {
      this.$SUBS.logout()
    }
  }
}
</script>