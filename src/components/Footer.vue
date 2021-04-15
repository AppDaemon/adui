<template>
  <v-footer
      height="50"
      color="indigo"
      padless
      app
  >
    <v-row
        justify="center"
        no-gutters
    >
      <v-card color="indigo" flat>
        <v-card-text>
          Booted: {{ booted }} |
          Uptime: {{ uptime }}
        </v-card-text>
      </v-card>
      <v-spacer></v-spacer>
      <v-btn
          v-for="icon in icons"
          :key="icon.name"
          color="white"
          text
          rounded
          class="my-2"
      >

        <a :href="icon.url" :target="icon.target">
          <v-icon color="white" size="24px">{{ icon.name }}</v-icon>
        </a>
      </v-btn>
    </v-row>
  </v-footer>
</template>

<script>
export default {
  name: 'Footer',
  data: () => ({
    booted: "",
    uptime: "",
    icons: [
      {name: 'mdi-github', url: 'https://github.com/AppDaemon', target: "_blank"},
      {name: 'mdi-text-box', url: 'https://appdaemon.readthedocs.io/en/latest/', target: "_blank"},
      {name: 'mdi-discord', url: 'https://discord.gg/sgSr79jW5x', target: "_blank"},
      {name: 'mdi-forum', url: 'https://community.home-assistant.io/c/third-party/appdaemon/21', target: "_blank"},
    ],
  }),
  mounted() {
    // Subscribe to some stuff
    this.$AD.add_sub("state", "admin.sensor.appdaemon_booted", this.booted_change)
    this.$AD.add_sub("state", "admin.sensor.appdaemon_uptime", this.uptime_change)
  },
  methods: {
    booted_change(entity, action, state) {
      this.booted = new Date(state.state).toLocaleString()
    },
    uptime_change(entity, action, state) {
      this.uptime = state.state
    },
  }
}
</script>

<style>
.v-card__text {
  color: white!important;
}
</style>