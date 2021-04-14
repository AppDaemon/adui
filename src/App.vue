<template>
  <v-app>
    <Drawer></Drawer>
    <TopBar :connected="connected"></TopBar>
    <v-main>
      <router-view/>
    </v-main>
    <Footer></Footer>
  </v-app>
</template>

<script>
import Footer from './components/Footer';
import TopBar from './components/TopBar';
import Drawer from './components/Drawer';

export default {
  name: "adui",
  components: {
    Footer,
    TopBar,
    Drawer
  },
  data: () => ({
    connected: false
  }),
  mounted() {
    this.$AD.on_connection_change(this.connect_change)
    this.$AD.ad_connect()
  },
  methods: {
    connect_change(connected) {
      this.connected = connected
    },
  }
}
</script>