package socket

import (
	"log"
	"github.com/gorilla/websocket"
)

// FindHandler returns which Handler will be used based on what Command
type FindHandler func(string) (Handler, bool)

// Client represents information about a WebSocket connection 
// and how it will be handled once the information arrives
type Client struct {
	Send chan Command
	socket *websocket.Conn
	findHandler FindHandler
}

// NewClient Returns a instance of a Client struct, just like an constructor
func NewClient(socket *websocket.Conn, findHandler FindHandler) *Client {
	return &Client{
		socket: socket,
		Send: make(chan Command),
		findHandler: findHandler,
	}
}

// Read Start to read and holds until the first message arrives and loop it again
// unless it was impossible to read, which in this case, it will case a break 
// in the loop and no loger will be read
func (client *Client) Read() {
	log.Printf("WEBSOCKET Read(): Waiting for Commands to arrive (infinite loop)")
	var command Command
	for {
		if err := client.socket.ReadJSON(&command); err != nil {
			log.Printf("### WEBSOCKET Read(): Unable to Decode JSON: %#v\n", err)
			break; 
		}

		if handler, found := client.findHandler(command.Name); found {
			handler(client, command.Data)
		} else {
			log.Printf("### WEBSOCKET Read(): Unable to Find Handler: %#v\n", command.Name)
		}
	}
	log.Printf("WEBSOCKET Read(): Closing socket connection due a failure in JSON Decoding")
	client.socket.Close()
}

// Write Will be waiting for a command to be send through go channel 
// and immediately, it will be send to the Client as JSON
func (client *Client) Write() {
	log.Printf("WEBSOCKET Write(): Waiting for Commands to be sent (infinite loop)")
	for command := range client.Send {
		if err := client.socket.WriteJSON(command); err != nil {
			log.Printf("### WEBSOCKET Write(): Unable to Encode JSON: %#v\n", err)
			break;
		}
	}
	log.Printf("WEBSOCKET Write(): Closing socket connection due a failure in JSON Enconding")
	client.socket.Close()
}