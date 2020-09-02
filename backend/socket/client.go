package socket

import (
	"log"
	"database/sql"
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
	Hub *Hub
	Database *sql.DB
}

// NewClient Returns a instance of a Client struct, just like an constructor
func NewClient(hub *Hub, socket *websocket.Conn, findHandler FindHandler, database *sql.DB) *Client {
	return &Client{
		socket: socket,
		Send: make(chan Command),
		findHandler: findHandler,
		Hub: hub,
		Database: database,
	}
}

// Read Start to read and holds until the first message arrives and loop it again
// unless it was impossible to read, which in this case, it will case a break 
// in the loop and no loger will be read
func (client *Client) Read() {
	defer func() {
		log.Printf("WEBSOCKET Read(): Unregistering Client and Closing Connection")
		client.Hub.unregister <- client
		client.socket.Close()
	}()

	log.Printf("WEBSOCKET Read(): Waiting for Commands to arrive")
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
}

// Write Will be waiting for a command to be send through go channel 
// and immediately, it will be send to the Client as JSON
func (client *Client) Write() {
	defer func() {
		log.Printf("WEBSOCKET Write(): Unregistering Client and Closing Connection")
		client.Hub.unregister <- client
		client.socket.Close()
	}()
	log.Printf("WEBSOCKET Write(): Waiting for Commands to be sent")
	for command := range client.Send {
		if err := client.socket.WriteJSON(command); err != nil {
			log.Printf("### WEBSOCKET Write(): Unable to Encode JSON: %#v\n", err)
			break;
		}
	}
}