<template>
  <v-container fluid>
    <Drawer></Drawer>
    <TopBar :title="title" :connected="connected"></TopBar>
    <v-main>
        <router-view @update-title="updateTitle"/>
    </v-main>
    <Footer></Footer>
    <v-dialog
        v-model="dialog"
        persistent
        max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Enter Password</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field
                v-on:keyup.enter="logon_done()"
                label="Password"
                :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="() => (value = !value)"
                :type="value ? 'password' : 'text'"
                required
                v-model="password"
            ></v-text-field>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="blue darken-1"
              text
              @click="logon_done()"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import Footer from './Footer';
import TopBar from './TopBar';
import Drawer from './Drawer';
import bcrypt from 'bcryptjs'

export default {
  name: "adui",
  components: {
    Footer,
    TopBar,
    Drawer
  },
  data: function () {
    return {
      connected: false,
      title: "",
      dialog: false,
      password: "",
      value: String
    }
  },
  methods:
      {
        updateTitle(title) {
          this.title = title
        },
        need_logon() {
          this.password = ""
          this.dialog = true
        },
        logon_done() {
          this.dialog = false
          let creds = this.encryptPassword(this.password)
          this.$SUBS.ad_connect(this.need_logon.bind(this), creds)
        },
        encryptPassword(password) {
          const salt = bcrypt.genSaltSync(10)
          return bcrypt.hashSync(password, salt)
        },
      },
  mounted() {
    let host = window.location.hostname
    let port = window.location.port
    let uri = window.location.search.substring(1);
    let params = new URLSearchParams(uri);
    if (params.get("host") !== null && (params.get("port") !== null)) {
      host = params.get("host")
      port = params.get("port")
    }
    this.$SUBS.set_host(host, port)
    this.$SUBS.ad_connect(this.need_logon.bind(this), null)
  }
}
</script>