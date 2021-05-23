<template>
  <v-container fluid>
    <v-data-iterator
        :items="items"
        sort-by="dash"
        disable-pagination
        hide-default-footer
    >
      <template v-slot:default="props">
        <v-row>
          <v-col
              v-for="item in props.items"
              :key="item.dash"
              cols="12"
              sm="12"
              md="6"
              lg="4"
          >
            <v-card :href="item.link" width="500">
              <v-card-title
                  class="headline"
                  v-text="item.dash"
              ></v-card-title>
              <v-spacer></v-spacer>
              <HTMLThumb :url="item.link"/>
            </v-card>

          </v-col>
        </v-row>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<script>
import HTMLThumb from "@/components/HTMLThumb";

export default {
  name: "Dashboards",
  mounted() {
    if (this.$SUBS.connected === false) {
      this.subs.push(this.$SUBS.add_sub("connect", null, this.connected))
    } else {
      this.$SUBS.stream.list_dashes(this.got_dashes)
    }
  },
  components:
      {
        HTMLThumb
      },
  data: function () {
    return {
      headers:
          [
            {text: "Dashboard", value: "dash"},
            {text: "Link", value: "link"},
          ],
      items: [],
      subs: [],
    }
  },
  beforeDestroy() {
    this.$SUBS.remove_subs(this.subs)
  },

  methods:
      {
        connected() {
          this.$SUBS.stream.list_dashes(this.got_dashes)
        },
        got_dashes(dashes) {
          if (dashes.data.dash_list !== null) {
            Object.keys(dashes.data.dash_list).forEach(dash => {
                  this.items.push({dash: dash, link: dashes.data.dash_list[dash]})
                }
            )
          }

        }
      }
}

</script>
