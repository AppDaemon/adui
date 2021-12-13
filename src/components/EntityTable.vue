<template>
  <v-container fluid>
    <!--    <v-card-title v-if="name">{{ name }}</v-card-title>-->
    <v-data-table
        :headers="headers"
        :items="filteredItems"
        :items-per-page="100"
        dense
        :search="search"
        :sort-by="headers[0].value"
        hide-default-footer
        disable-pagination
    >
      <template v-slot:top>
        <v-container>
          <v-row>
            <v-col>
              <v-select v-if="filterTitle"
                        :label="filterTitle"
                        :items="filterKeys"
                        v-model="filterValue"
              ></v-select>
            </v-col>
            <v-col>
              <v-card-title class="justify-center">{{ name }}</v-card-title>
            </v-col>
            <v-col>
              <v-text-field
                  prepend-icon="mdi-magnify"
                  label="Search"
                  v-model="search"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </template>
      <template v-for="(header, index) in headers.filter((header) =>
    header.hasOwnProperty('formatter') ||
    header.hasOwnProperty('icon') ||
    header.hasOwnProperty('args') ||
    header.text === 'Name'
    )"
                v-slot:[`item.${header.value}`]="{ header, value }">
      <span v-bind:key="index" v-if="header.hasOwnProperty('formatter')">
        {{ header.formatter(value) }}
      </span>
      <span v-bind:key="index" v-if="header.text === 'Name'">
        <a v-if="value.match('^sequence\.')" v-on:click="run_sequence(value)">{{ value }}</a>
        <span v-else>{{ value }}</span>
      </span>
        <span v-bind:key="index" v-else-if="header.hasOwnProperty('icon')">
      <v-icon :color="header.icon[value].color" v-bind:key="index">{{ header.icon[value].icon }}</v-icon>
      </span>
        <span v-bind:key="index" v-else-if="header.hasOwnProperty('args')">
        <Args :title="header.text" :args="value"/>
      </span>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import Args from "@/components/Args";

export default {
  name: 'EntityTable',
  data: function () {
    return {
      search: "",
      filterValue: this.filterDefault
    }
  },
  components:
      {
        Args,
      },
  props: {
    name: String,
    headers: Array,
    items: Array,
    filterKeys: Array,
    filterTitle: String,
    filterDefault: String
  },
  computed: {
    filteredItems() {
      return this.items.filter((i) => {
        return !this.filterValue || (i.ns === this.filterValue);
      })
    }
  },
  methods: {
    run_sequence(seq) {
      let service = "sequence/run"
      let namespace = "rules"
      let args = {
        namespace: "default",
        entity_id: seq
      }
      this.$SUBS.stream.call_service(service, namespace, args)
    }
  }
}
</script>