package socket 

import (
	"log"
)

// Hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
	// Registered clients.
	clients map[*Client]bool

	// Inbound messages from the clients.
	Broadcast chan Command

	// Register requests from the clients.
	register chan *Client

	// Unregister requests from clients.
	unregister chan *Client
}

// NewHub Create a new Instance of Hub
func NewHub() *Hub {
	return &Hub{
		clients:    make(map[*Client]bool),
		Broadcast:  make(chan Command),
		register:   make(chan *Client),
		unregister: make(chan *Client),
	}
}

// Run the Hub into a Go Routine to manage all clients
func (hub *Hub) Run() {
	for {
		select {
		case client := <-hub.register:
			hub.clients[client] = true
			log.Printf(">>> HUB: <-hub.register: %d\n", len(hub.clients))
		case client := <-hub.unregister:
			if _, ok := hub.clients[client]; ok {
				delete(hub.clients, client)
				close(client.Send)
			}
			log.Printf(">>> HUB: <-hub.deregister: %d\n", len(hub.clients))
		case command := <-hub.Broadcast:
			log.Printf(">>> HUB: <-hub.Broadcast: %d\n", len(hub.clients))
			for client := range hub.clients {
				select {
				case client.Send <- command:
				default:
					close(client.Send)
					delete(hub.clients, client)
				}
			}
		}
	}
}