export default class Utils {
    formatDate(date) {
        let thisdate = ""
        if (date !== "never") {
            let dt = new Date(date)
            thisdate = dt.toLocaleString()
        } else {
            thisdate = date
        }
        return (thisdate)
    }

    formatFixedLen(field, len) {
        let sfield = String(field)
        let result = ""
        if (sfield.length <= len) {
            result = sfield + " ".repeat(len - sfield.length)
        } else {
            result = sfield.substring(0, len)
        }

        return result
    }

    formatArgs(args) {
        let result = ""
        Object.keys(args).forEach((arg) => {
            result += "|" + arg + "=" + args[arg]
        })
        result += "|"
        return result
    }

    update_sensor_block(entity, action, state, table) {
        for (let i = 0; i < table.length; i++) {
            if (table[i].entity === entity) {
                table[i].state = state
            }
        }
    }

    update_entity_table(fqentity, action, state, table, copy_function) {
        // Incoming entity is fully qualified, table entry is not
        let s = fqentity.split(".")
        let ns = s[0]
        let entity = s[1] + "." + s[2]
        if (action === "add") {
            table.push(copy_function(ns, state, {}))
        } else if (action === "update") {
            for (let i = 0; i < table.length; i++) {
                if (table[i].entity_id === entity) {
                    copy_function(ns, state, table[i])
                    break;
                }
            }
        } else if (action === "delete") {
            let index = -1
            for (let i = 0; i < table.length; i++) {
                if (table[i].entity_id === entity) {
                    index = i
                    break
                }
            }
            if (index !== -1) {
                table.splice(index, 1)
            }
        }
    }
}