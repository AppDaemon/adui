<template>
  <div>
    <v-container>
    <span v-if="argcount === 0">
      None
    </span>
      <span v-else>
      {{ arg_format(args) }}
    </span>
      <span v-if="argcount > args_shown">
      &nbsp;
      <v-btn @click="args_dialog = true" x-small elevation="0">...</v-btn>
      &nbsp;}
    </span>
    </v-container>
    <div class="text-center">
      <v-dialog
          v-model="args_dialog"
          width="90%"
      >
        <v-card>
          <v-card-title class="grey lighten-2">
            {{ title }}
          </v-card-title>
          <v-card-text class="black--text text-pre">
            <br>
            {{ JSON.stringify(args, null, 4) }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="primary"
                text
                @click="args_dialog = false"
            >
              OK
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Args',
  data: () => ({
    args_shown: 2,
    args_dialog: false,
  }),
  props:
      [
        "args",
        "title"
      ],
  mounted() {
  },
  computed:
      {
        argcount: function () {
          if (Array.isArray(this.args))
          {
            return this.args.length
          }
          else {
            return Object.keys(this.args).length
          }
        }
      },
  methods: {
    arg_format(args) {
      let items = []
      let startchar = ""
      let endchar = ""
      if (Array.isArray(args))
      {
        startchar = "["
        endchar = "]"
        for (let i=0;i<args.length;i++)
        {
          items.push('"' + args[i] + '"')
        }
      }
      else if (typeof args === "object")
      {
        startchar = "{"
        endchar = "}"
        for (const key in args)
        {
          items.push('"' + key + '": "' + args[key] + '"')
        }
      }
      else
      {
        console.log("Unknown type in arg_format()")
        return "Error"
      }
      let result = startchar
      let incomplete = false
      for (let i=0;i<items.length;i++) {
        if (i === this.args_shown) {
          incomplete = true
          break
        }
        if (i > 0) {
          result += ", "
        }
        result += items[i]
      }
      if (!incomplete) {
        result += endchar
      }
      return result
    }
  }
}
</script>
