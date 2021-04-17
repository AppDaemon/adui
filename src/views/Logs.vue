<template>
  <h1>Logs</h1>
</template>

<script>
export default {
  title: 'Logs',
    mounted()
  {
        this.$emit('update-title', "Logs")
  },
}
</script>
