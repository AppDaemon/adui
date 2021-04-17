<template>
  <h1>Events</h1>
</template>

<script>
export default {
  title: 'Events',
  mounted() {
    this.$emit('update-title', "Events")
  },
}
</script>
