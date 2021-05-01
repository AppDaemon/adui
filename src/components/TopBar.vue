<template>
  <div>
    <v-app-bar
        app
        color="indigo"
        dark
        height="50"
    >
      <v-row align="center">
        <v-col>
          <v-layout justify-start>
            <v-toolbar-title>AppDaemon {{ version }}</v-toolbar-title>
          </v-layout>
        </v-col>
        <v-col justify="center">
          <v-layout justify-center>
            <v-card-title>
              {{ title }}
            </v-card-title>
          </v-layout>
        </v-col>
        <v-col>
          <v-layout justify-end>
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
          </v-layout>
        </v-col>
      </v-row>
    </v-app-bar>
    <v-dialog
        v-model="about"
        persistent
        max-width="600px"
    >
      <v-card>
        <v-card-title class="headline grey lighten-2">
          <span>About AppDaemon</span>
        </v-card-title>
        <v-container>
          <v-row>
            <v-col cols="4">
              <v-img height="50" width="50" src="appdaemon.png" class="ma-5"></v-img>
            </v-col>
            <v-col cols="8">
              <v-card-title class="black--text">
                AppDaemon
              </v-card-title>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-card-text class="black--text">
                Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a
                  href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> is licensed by <a
                  href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC
                3.0
                BY</a>
              </v-card-text>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="blue darken-1"
              text
              @click="about = false"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'TopBar',
  data: function () {
    return {
      about: false,
      connected: false,
      version: "",
      menu: [
        {option: "Logout", callback: this.logout},
        {option: "About", callback: this.show_about},
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
    logout() {
      this.$SUBS.logout()
    },
    show_about() {
      this.about = true
    }
  }
}
</script>