import Stream from './stream.js'
import uuid from 'uuid/v4'

export default class AD {
    constructor() {
        this.host = "prod.sanctuary.home"
        this.port = 5151
        this.connected = false
        this.subs = []
    }

    add_sub(type, spec, callback) {
        var handle = uuid()
        this.subs[handle] = {type: type, spec: spec, callback: callback}
        return handle
    }

    process_callback(type, operation, entity, data)
    {
        Object.keys(this.subs).forEach((key) => {
            let sub = this.subs[key]
            if (sub.type === type) {
                if (type === "connect" || type === "namespace") {
                    // simple match is enough
                    this.subs[key].callback(entity, operation, data)
                }
                else if (type === "state")
                {
                    // need to check spec
                    let spec = sub.spec.split(".")
                    let ent = entity.split(".")

                    let match=true
                    for (let i=0;i<spec.length;i++)
                    {
                        if (spec[i] !== ent[i])
                        {
                            match = false
                        }
                    }
                    if (match)
                    {
                        this.subs[key].callback(entity, operation, data)
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
        this.process_callback("connect", null, null, this.connected)
    }

    on_message() {
        //console.log("message")
    }

    got_initial_state(data) {

        // Add all the entities and namespaces

        Object.keys(data.data).forEach((ns) => {
            this.process_callback("namespace", "add", ns)
            Object.keys(data.data[ns]).forEach((entity) => {
                this.process_callback("state", "add", ns + "." + entity, data.data[ns][entity])
            })
        })

        this.connected = true
        this.process_callback("connect", null, null, this.connected)

    }

    got_event(data) {
        console.log(data)
    }

    got_state_update(data) {
        let entity = data.data.namespace + "." + data.data.data.entity_id
        let state = data.data.data.new_state
        this.process_callback("state", "update", entity, state)
    }
}