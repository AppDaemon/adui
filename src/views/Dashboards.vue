<template>
  <h1>Dashboards</h1>
</template>

<script>
export default {
  title: 'Dashboards',
  mounted() {
    console.log(this)
    this.$emit('update-title', "Dashboards")
  },
}
</script>
