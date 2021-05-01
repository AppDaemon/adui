<template>
  <v-container>
    <v-card
        color="white"
        flat
    >
      <div class="d-flex flex-no-wrap justify-space-between">
        <v-avatar
            class="ma-3"
            size="75"
            tile
        >
          <v-img src="appdaemon.png"></v-img>
        </v-avatar>
        <div>
          <v-card-title
              class="headline text--black">
            AppDaemon
          </v-card-title>
          <v-card-subtitle>Sandboxed python Apps for Home Automation</v-card-subtitle>
        </div>
      </div>
    </v-card>
    <v-divider></v-divider>
    <div class="py-5">
      <v-list>
        <v-list-item
            v-for="item in this.$TABS"
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
    </div>
  </v-container>
</template>

<script>
export default {
  name: "Home"
}
</script>
