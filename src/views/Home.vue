<template>
  <Home/>
</template>

<script>
import Home from "@/components/Home"

export default {
  title: 'Home',
  components:
      {Home},
  mounted() {
    this.$emit('update-title', "Home")
  },

}
</script>

