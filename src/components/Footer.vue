<template>
  <v-footer
    color="indigo"
    padless
  >
    <v-row
      justify="center"
      no-gutters
    >
      <v-btn
        v-for="link in links"
        :key="link.title"
        :href="link.link"
        target="_blank"
        color="white"
        text
        rounded
        class="my-2"
      >
        {{ link.title }}
      </v-btn>
    </v-row>
  </v-footer>
</template>

<script>
  export default {
    name: 'Footer',
    data: () => ({
      links: [
        {title: 'GitHub', link: 'https://github.com/AppDaemon'},
        {title: 'Docs', link: 'https://appdaemon.readthedocs.io/en/latest/'},
        {title: 'Forum', link: 'https://community.home-assistant.io/c/third-party/appdaemon/21'},
      ],
    }),
  }
</script>