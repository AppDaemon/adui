import Stream from './stream.js'
import uuid from 'uuid/v4'

export default class AD {
    constructor() {
        this.host = "prod.sanctuary.home"
        this.port = 5151
        this.connected = false
        this.subs = []
        this.state = []
        this.namespace = []
    }

    add_sub(type, spec, callback) {
        var handle = uuid()
        this.subs[handle] = {type: type, spec: spec, callback: callback}

        if (type === "state") {
            // Send initial value if we have it
            // Iterate all NS values and call process_callback

            Object.keys(this.state).forEach((ns) => {
                Object.keys(this.state[ns]).forEach((entity) => {
                    this.process_callback([this.subs[handle]], "state", "add", this.fqentity(ns, entity), this.state[ns][entity])
                })
            })
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

    process_callback(subs, type, operation, entity, data) {
        Object.keys(subs).forEach((key) => {
            let sub = subs[key]
            if (sub.type === type) {
                if (type === "connect" || type === "namespace") {
                    // simple match is enough
                    this.subs[key].callback(entity, operation, data)
                } else if (type === "state") {
                    // need to check spec
                    let spec = sub.spec.split(".")
                    let ent = entity.split(".")

                    let match = true
                    for (let i = 0; i < spec.length; i++) {
                        if (spec[i] !== ent[i]) {
                            match = false
                        }
                    }
                    if (match) {
                        subs[key].callback(entity, operation, data)
                    }
                }
            }
        })
    }

    ad_connect() {
        //console.log("Connecting")
        let creds = ''
        this.stream = new Stream("ws", location.protocol, this.host, this.port, "Admin Client", creds, this.on_connect.bind(this), this.on_message.bind(this), this.on_disconnect.bind(this));
    }

    on_connect() {

        //console.log("connect")

        // Grab state

        this.stream.get_state('*', '*', this.got_initial_state.bind(this));

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
        console.log(data)
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