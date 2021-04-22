<template>
  <v-card flat>
    <v-card-title v-if="name" >{{name}}</v-card-title>
  <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="10"
      dense
      :search="search"
  >
    <template v-slot:top>
      <v-text-field
          class="mx-4"
          prepend-icon="mdi-magnify"
          label="Search"
          v-model="search"
      ></v-text-field>
    </template>
    <template v-for="(header, index) in headers.filter((header) =>
    header.hasOwnProperty('formatter') || header.hasOwnProperty('icon'))"
              v-slot:[`item.${header.value}`]="{ header, value }">
      <span v-bind:key="index" v-if="header.hasOwnProperty('formatter')">
        {{ header.formatter(value) }}
      </span>
      <span v-bind:key="index" v-else-if="header.hasOwnProperty('icon')">
      <v-icon :color="header.icon[value].color" v-bind:key="index">{{ header.icon[value].icon }}</v-icon>
      </span>
    </template>
    <!--  <template v-for="(header, index) in headers.filter((header) => header.hasOwnProperty('icon'))"
               v-slot:[`item.${header.value}`]="{ header, value }">
       <v-icon :color="header.icon[value].color" v-bind:key="index">{{ header.icon[value].icon }}</v-icon>
     </template>-->
  </v-data-table>
    </v-card>
</template>

<script>

export default {
  name: 'EntityTable',
  data: function () {
    return {
      search: ""
    }
  },
  props: {
    name: String,
    headers: Array,
    items: Array
  },
}
</script>