<template>
  <Events/>
</template>

<script>

import Events from "@/components/Events";

export default {
  title: 'Events',
  components: {Events},
  mounted() {
    this.$emit('update-title', "Events")
  },
}
</script>
