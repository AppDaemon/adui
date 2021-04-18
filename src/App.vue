<template>
  <v-app>
    <Drawer></Drawer>
    <TopBar :title="title" :connected="connected"></TopBar>
    <v-main>
      <router-view @update-title="updateTitle"/>
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
    connected: false,
    title: "",
  }),
  methods:
      {
        updateTitle(title)
        {
          this.title = title
        }
      },
  mounted() {
    this.$AD.ad_connect()
  }
}
</script>