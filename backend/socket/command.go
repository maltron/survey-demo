package socket

// Command Represents how a command format should be shaped in order to be 
// understood for this backend (communicated through WebSocket)
type Command struct {
	Name string `json:"name"`
	Data interface{} `json:"data"`
}