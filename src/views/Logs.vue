<template>
  <Logs/>
</template>

<script>
import Logs from '@/components/Logs'

export default {
  title: 'Logs',
  components:
      {Logs},
  mounted() {
    this.$emit('update-title', "Logs")
  },
}
</script>
