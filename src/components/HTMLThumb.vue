<template>
  <v-container>
    <div class="thumbnail-container">
      <div class="thumbnail">
        <iframe :src="url"></iframe>
      </div>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "HTMLThumb",
  props:
      {
        url: String
      }
}
</script>

<style scoped>

.thumbnail iframe {
  border: 0;
  width: 2048px;
  height: 1536px;
}

.thumbnail-container {
  width: calc(2048px * 0.1);
  height: calc(1536px * 0.1);
  display: inline-block;
  overflow: hidden;
  position: relative;
}

.thumbnail {
  position: relative;
  -ms-zoom: 0.1;
  -moz-transform: scale(0.1);
  -moz-transform-origin: 0 0;
  -o-transform: scale(0.1);
  -o-transform-origin: 0 0;
  -webkit-transform: scale(0.1);
  -webkit-transform-origin: 0 0;
}

.thumbnail:after {
  content: "";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>