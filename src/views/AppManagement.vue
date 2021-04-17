<template>
  <h1>App Management</h1>
</template>

<script>
export default {
  title: 'App Management',
  mounted() {
    this.$emit('update-title', "App Management")
  }
}
</script>

