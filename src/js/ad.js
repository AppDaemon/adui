import Stream from './stream.js'

export default class AD {
    constructor() {
        this.host = "prod.sanctuary.home"
        this.port = 5151
        this.connected = false
    }

    ad_connect() {
        console.log("Connecting")
        let creds = ''
        this.stream = new Stream("ws", location.protocol, this.host, this.port, "Admin Client", creds, this.on_connect, this.on_message, this.on_disconnect);
        this.stream.parent = this
    }

    on_connect() {

        console.log("Connected")

        // Grab state

        console.log(this)
        this.get_state('*', '*', this.parent.got_initial_state);

        // subscribe to all events

        this.listen_event('*', '*', this.parent.got_event);

        // Subscribe to all state changes

        this.listen_state('*', '*', this.parent.got_state_update)
    }

    on_disconnect() {
        console.log("disconnect")
    }

    on_message() {
        console.log("message")
    }

    got_initial_state(data)
    {
        console.log(data)
    }

    got_event(data)
    {
        console.log(data)
    }

    got_state_update(data)
    {
        console.log(data)
    }
}