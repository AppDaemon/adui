import Stream from './stream.js'

export default class AD {
    constructor() {
        this.host = "prod.sanctuary.home"
        this.port = 5151
        this.connected = false
    }

    on_connection_change(callback) {
        this.connected_callback = callback
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
        this.connected_callback(this.connected)
    }

    on_message() {
        //console.log("message")
    }

    got_initial_state(data) {

        console.log(data)

        this.connected = true
        this.connected_callback(this.connected)

    }

    got_event(data) {
        console.log(data)
    }

    got_state_update(data) {
        console.log(data)
    }
}