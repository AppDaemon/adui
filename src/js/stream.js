import ReconnectingWebSocket from 'reconnecting-websocket';

export default class Stream {

    constructor(transport, protocol, domain, port, client_name, creds, on_connect, on_message, on_disconnect, on_error, need_logon) {

        this.client_name = client_name;
        this.on_connect = on_connect;
        this.on_message = on_message;
        this.on_disconnect = on_disconnect;
        this.on_error = on_error;
        this.need_logon = need_logon
        this.creds = creds
        this.outstanding_requests = {};

        let prot = ""
        if (transport === "ws") {
            if (protocol === 'https:') {
                prot = "wss:";
            } else {
                prot = "ws:"
            }
        } else {
            prot = protocol
        }

        let stream_url = prot + '//' + domain + ':' + port + "/stream";

        if (transport === "ws") {
            this.stream = new WSStream(stream_url, this.ad_on_connect.bind(this), this.ad_on_message.bind(this), this.ad_on_disconnect.bind(this), this.ad_on_error.bind(this))
        } else {
            alert("Unknown transport", transport)
        }
    }

    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    ad_on_connect() {
        var data =
            {
                client_name: this.client_name
            };

        if (this.creds !== '') {
            data['cookie'] = this.creds
        }

        var request =
            {
                request_type: "hello",
                data: data
            };

        this.send(request);
    }

    ad_on_error(error) {
        this.on_error(error)
    }

    ad_on_disconnect() {
        this.on_disconnect()
    }

    send(request, callback) {
        let id = this.uuidv4();
        request["request_id"] = id;

        this.outstanding_requests[id] = {callback: callback, request: request};
        this.stream.send(request);

        return id
    }

    ad_on_message(data) {
        if ("response_success" in data && data.response_success === false) {
            if (data.response_error.includes("authorization failed")) {
                this.need_logon()
            } else {
                console.log("Error in stream: " + data.response_error, data)
            }
        } else {
            if ("response_type" in data) {
                if (data.response_type === "listen_state" || data.response_type === "listen_event") {
                    // Ignore it - we don't want to delete the registration
                } else if (data.response_type === "state_changed" || data.response_type === "event") {
                    // Call the function but don't delete the registration
                    let id = data.response_id;
                    if (id in this.outstanding_requests) {
                        let callback = this.outstanding_requests[id].callback;
                        if (callback !== undefined) {
                            callback(data)
                        }
                    }
                } else if (data.response_type === "hello") {
                    let id = data.response_id;
                    delete this.outstanding_requests[id];
                    this.on_connect(data)
                } else {
                    // This is a response to a one off request, dispatch it to the requester
                    if ("response_id" in data) {
                        let id = data.response_id;
                        if (id in this.outstanding_requests) {
                            let callback = this.outstanding_requests[id].callback;
                            delete this.outstanding_requests[id];
                            if (callback !== undefined) {
                                callback(data)
                            }
                        } else {
                            // No callback was specified so just drop it
                            console.log("Dropping specific callback", data)
                        }
                    } else {
                        // No specific callback, so send to generic callback if we have one
                        if (this.on_message !== undefined) {
                            this.on_message(data)
                        } else {
                            // Nothing to do so drop response
                            console.log("Dropping non-specific callback", data)
                        }
                    }
                }
            } else {
                console.log("Unknown response type", data)
            }
        }
    }

    listen_state(namespace, entity, callback) {
        let request = {
            request_type: "listen_state",
            data: {
                namespace: namespace,
                entity_id: entity
            }
        };

        return this.send(request, callback)
    }

    listen_event(namespace, event, callback) {
        var request = {
            request_type: "listen_event",
            data: {
                namespace: namespace,
                event: event
            }
        };

        return this.send(request, callback)
    }

    cancel_listen_state(handle) {
        console.log(handle)
    }

    cancel_listen_event(handle) {
        console.log(handle)
    }

    get_state(namespace, entity, callback) {
        var request = {
            request_type: "get_state",
            data: {}
        };

        if (namespace !== "*") {
            request.data.namespace = namespace
        }

        if (entity !== "*") {
            request.data.entity_id = entity
        }
        this.send(request, callback)
    }

    call_service(service, namespace, args, callback) {
        args["__name"] = "stream"
        let request = {
            request_type: "call_service",
            data: {
                namespace: namespace,
                service: service,
                data: args
            }
        };

        this.send(request, callback)
    }

    get_logs(callback) {
        var request = {
            request_type: "get_logs",
            data: {}
        };

        this.send(request, callback)
    }
}

class WSStream {
    constructor(stream, on_connect, on_message, on_disconnect, on_error) {

        this.on_connect = on_connect;
        this.on_message = on_message;
        this.on_disconnect = on_disconnect;
        this.on_error = on_error;

        this.webSocket = new ReconnectingWebSocket(stream);

        this.webSocket.onopen = this.ws_on_connect.bind(this);
        this.webSocket.onmessage = this.ws_on_message.bind(this);
        this.webSocket.onclose = this.ws_on_disconnect.bind(this);
        this.webSocket.onerror = this.ws_on_error.bind(this);
    }

    send(data) {
        this.webSocket.send(JSON.stringify(data));
    }

    disconnect()
    {
        this.webSocket.close()
    }

    ws_on_connect() {
        this.on_connect()
    }

    ws_on_message(wsevent) {
        var data = JSON.parse(wsevent.data);
        this.on_message(data)
    }

    ws_on_disconnect() {
        this.on_disconnect()
    }

    ws_on_error(error) {
        console.log(error)
        this.on_error(error)
    }

}
