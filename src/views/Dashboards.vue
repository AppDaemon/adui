<template>
  <Dashboards/>
</template>

<script>
import Dashboards from "@/components/Dashboards";

export default {
  components: {Dashboards},
  title: 'Dashboards',
  mounted() {
    this.$emit('update-title', "Dashboards")
  },
}
</script>
