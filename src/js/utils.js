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

    formatArgs(args)
    {
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

    update_entity_table(entity, action, state, table) {
        if (action === "add") {
            table.push(state)
        } else if (action === "update") {
            for (let i = 0; i < table.length; i++) {
                if (table[i].entity_id === entity) {
                    table[i] = state
                }
            }
        } else if (action === "delete") {
            let index = -1
            for (let i = 0; i < table.length; i++) {
                if (table[i].entity_id === entity) {
                    index = i
                }
            }
            if (index !== -1) {
                table.splice(index, 1)
            }
        }
    }
}