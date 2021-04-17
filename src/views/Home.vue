<template>
  <h1>Home</h1>
</template>

<script>
export default {
  title: 'Home',
  mounted() {
    this.$emit('update-title', "Home")
  },

}
</script>

