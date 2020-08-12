package survey

import (
	"fmt"
	"log"
	"encoding/json"
	"net/http"
	"github.com/gorilla/websocket"
)

const (
	CommandTest int = 0	
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:    4096,
	WriteBufferSize:   4096,
	EnableCompression: true,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// Command is a way client and server will be communicating to each other
type Command struct {
	Operation int `json:"operation"`
	Data string  `json:"data"`
}

// Stringer for command
func (command Command) String() string {
	return fmt.Sprintf("{\"operation\":\"%d\", \"data\":\"%s\"",
		command.Operation, command.Data)
}

func (command *Command) parseJSON(message []byte) error {
	return json.Unmarshal(message, command)
}

// WebSocket | Handles all the WebSocket incoming from client
func WebSocket(w http.ResponseWriter, r *http.Request) {
	connection, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("### COMMAND HANDLER: Unable to Upgrade Websocket:%v\n", err.Error())
		return 
	}
	defer connection.Close()

	// Infinite Loop
	for {
		log.Println(">>> Command Handler: Looping BEGIN >>>>>>>>")
		_, message, err := connection.ReadMessage()
		if err != nil {
			log.Printf("### COMMAND HANDLER: Unable to read Message:%v\n", err.Error())
			continue
		}

		command := Command{}
		err = command.parseJSON(message)
		if err != nil {
			log.Printf("### COMMAND HANDLER: Unable to Parse JSON:%s\n", message)
			continue 
		}

		log.Println(">>> Command Handler: Looping END <<<<<<<<<<")
	}	

}