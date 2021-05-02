import Stream from './stream.js'
import uuid from 'uuid/v4'

export default class Subscriptions {

    constructor() {
        this.host = ""
        this.port = 0
        this.connected = false
        this.subs = []
        this.state = []
        this.namespace = []
        this.events = []
        this.lognames = []
        this.logs = []
        this.log_list = []
        this.max_events = 1000
        this.max_logs = 1000
    }

    get MAX_EVENTS() {
        return this.max_events
    }

    get MAX_LOGS() {
        return this.max_logs
    }

    get_namespaces() {
        return this.namespace
    }

    get_log_list() {
        return this.log_list
    }

    set_host(host, port) {
        this.host = host
        this.port = port
    }

    add_sub(type, spec, callback, copy_function) {
        var handle = uuid()
        this.subs[handle] = {type: type, spec: spec, callback: callback, copyfunction: copy_function}

        if (type === "state") {
            // Send initial value if we have it
            // Iterate all NS values and call process_callback

            Object.keys(this.state).forEach((ns) => {
                Object.keys(this.state[ns]).forEach((entity) => {
                    this.process_callback([this.subs[handle]], "state", "add", this.fqentity(ns, entity), this.state[ns][entity])
                })
            })
        }
        if (type === "event") {
            // Send all events we have
            for (let i = this.events.length - 1; i >= 0; i--) {
                this.process_callback([this.subs[handle]], "event", "", "", this.events[i])
            }
        }
        if (type === "log") {
            // Send all logs we have
            for (let i = this.logs.length - 1; i >= 0; i--) {
                this.process_callback([this.subs[handle]], "log", "update", "", this.logs[i])
            }
        }
        return handle
    }

    remove_subs(subs) {
        for (let i = 0; i < subs.length; i++) {
            if (subs[i] in this.subs) {
                delete this.subs[subs[i]]
            } else {
                console.log("Handle not found: " + subs[i])
            }
        }
    }

    fqentity(ns, entity) {
        return ns + "." + entity
    }

    logout() {
        delete localStorage.ad_creds
        this.subs = []
        this.ad_connect(this.need_logon, '')
    }


    process_callback(subs, type, operation, entity, data) {
        Object.keys(subs).forEach((key) => {
            let sub = subs[key]
            if (sub.type === type) {
                if (type === "connect" || type === "namespace") {
                    // simple match is enough
                    this.subs[key].callback(entity, operation, data)
                } else if (type === "state") {
                    // need to check spec
                    let match = true
                    if (sub.spec !== "*") {
                        let spec = sub.spec.split(".")
                        let ent = entity.split(".")

                        match = true
                        for (let i = 0; i < spec.length; i++) {
                            if (spec[i] !== ent[i]) {
                                match = false
                            }
                        }
                    }
                    if (match) {
                        subs[key].callback(entity, operation, data, sub.copyfunction)
                    }
                } else if (type === "log") {
                    subs[key].callback(operation, data)

                } else if (type === "event") {
                    subs[key].callback(data)
                }
            }
        })
    }

    ad_connect(need_logon, creds) {

        this.need_logon = need_logon
        let mycreds = ''
        if (creds !== null) {
            localStorage.ad_creds = creds
            mycreds = creds
        } else {
            if (localStorage.ad_creds) {
                mycreds = localStorage.ad_creds
            }
        }
        this.stream = new Stream("ws", location.protocol, this.host, this.port, "Admin Client", mycreds, this.on_connect.bind(this), this.on_message.bind(this), this.on_disconnect.bind(this), this.on_error.bind(this), need_logon);
    }

    on_error(error) {
        console.log(error)
    }

    on_connect() {

        // Grab state

        this.stream.get_state('*', '*', this.got_initial_state.bind(this));

        // Grab recent logfiles

        this.stream.get_logs(this.got_logs.bind(this), 1000)

        // subscribe to all events

        this.stream.listen_event('*', '*', this.got_event.bind(this));

        // Subscribe to all state changes

        this.stream.listen_state('*', '*', this.got_state_update.bind(this))

    }

    on_disconnect() {
        this.connected = false
        this.process_callback(this.subs, "connect", null, null, this.connected)
    }

    on_message() {
        //console.log("message")
    }

    got_logs(data) {
        // Store locally in flattened array

        Object.keys(data.data).forEach((log) => {
            let current_log = []
            this.log_list.push(log)
            this.process_callback(this.subs, "log", "add", log)
            for (let i = 0; i < data.data[log].lines.length; i++) {
                let log_entry = {log: log, line: data.data[log].lines[i]}
                if (current_log.length >= this.max_logs) {
                    current_log.pop()
                }
                current_log.unshift(log_entry)
            }
            this.logs = this.logs.concat(current_log)
        })
        for (let i = 0; i < this.logs.length; i++) {
            this.process_callback(this.subs, "log", "update", "", this.logs[i])
        }

    }

    got_initial_state(data) {

        // Process add callback for anything that is already listening

        Object.keys(data.data).forEach((ns) => {
            this.namespace.push(ns)
            this.process_callback(this.subs, "namespace", "add", ns)
            Object.keys(data.data[ns]).forEach((entity) => {
                this.process_callback(this.subs, "state", "add", this.fqentity(ns, entity), data.data[ns][entity])
            })
        })

        // Save local copy

        this.state = data.data

        this.connected = true
        this.process_callback(this.subs, "connect", null, null, this.connected)
    }

    got_event(data) {
        let ns = data.data.namespace
        let entity = data.data.data.entity_id
        let state = data.data.data.state
        let fqentity = ns + "." + entity
        data.data.time_received = new Date

        if (data.data.event_type === "__AD_ENTITY_ADDED") {

            // Add Local Copy
            this.state[ns][entity] = state

            // Call Subs

            this.process_callback(this.subs, "state", "add", fqentity, state)

        } else if (data.data.event_type === "__AD_ENTITY_REMOVED") {
            // Remove Local Copy

            delete this.state[ns][entity]

            // Call Subs

            this.process_callback(this.subs, "state", "remove", fqentity, state)

        } else if (data.data.event_type === "__AD_LOG_EVENT") {
            let log_entry = {log: data.data.data.log_type, line: data.data.data.formatted_message}
            if (this.logs.length >= this.max_logs) {
                this.logs.pop()
            }
            this.logs.unshift(log_entry)
            this.process_callback(this.subs, "log", "update", "", log_entry)
        } else {
            if (this.events.length >= this.max_events) {
                this.events.pop()
            }
            this.events.unshift(data.data)

            this.process_callback(this.subs, "event", "", "", data.data)
        }
    }

    got_state_update(data) {
        let ns = data.data.namespace
        let entity = data.data.data.entity_id
        let state = data.data.data.new_state

        // Update local copy

        this.state[ns][entity] = state
        let fqentity = ns + "." + entity
        this.process_callback(this.subs, "state", "update", fqentity, state)
    }
}