package socket

import (
	"log"
	"net/http"
	"github.com/gorilla/websocket"
	"github.com/maltron/survey-demo/backend/database"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

// Handler the function signature
type Handler func(*Client, interface{})

// Router Keeps information about each handler based on a key
type Router struct {
	rules map[string]Handler
	hub *Hub
	database *database.Connection
}

// NewRouter Constructor to create a new instance of
func NewRouter(connection *database.Connection) *Router {
	hub := NewHub()
	go hub.Run()
	return &Router{
		rules: make(map[string]Handler),
		hub: hub,
		database: connection,
	}
}

// FindHandler If found, returns a Handler for a particular command
func (router *Router) FindHandler(command string) (Handler, bool) {
	handler, found := router.rules[command]
	return handler, found
}

// Handle Creates/Add a new Handle, so when a message is receive, it will be handled
func (router *Router) Handle(command string, handler Handler) {
	router.rules[command] = handler
}

// ServeHTTP This is needed by the http package, so you can use into the http.Handle
// It automatically will start listening for WebSocket connections and handling
// appropriately based on a Command struct
func (router *Router) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	socket, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("WEBSOCKET ERROR: Unable to Upgrade Connection to WebSocket: %#v\n", err)
		panic(err)
	}
	defer socket.Close()

	client := NewClient(router.hub, socket, router.FindHandler, router.database)
	router.hub.register <- client
	go client.Write() // Initiating Write in a go subrotine
	client.Read()
}
