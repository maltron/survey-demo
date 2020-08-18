package users

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type Speaker struct {
	ID       int64  `json:"ID"`
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email"`
}

// Stringer
func (speaker Speaker) String() string {
	return fmt.Sprintf("{\"ID\": %d, \"username\": \"%v\", \"password\": \"%v\", \"email\": \"%v\"}",
		speaker.ID, speaker.Username, speaker.Password, speaker.Email)
}

// Returns true if one of the fields  are empty
func (speaker Speaker) isEmpty() bool {
	return len(speaker.Username) == 0 || len(speaker.Password) == 0 || len(speaker.Email) == 0
}

// Returns true if this information is valid
func (speaker Speaker) isValid() bool {
	return len(speaker.Username) > 0 &&
		len(speaker.Username) < 151 &&
		len(speaker.Password) > 0 &&
		len(speaker.Password) < 151 &&
		len(speaker.Email) > 0 &&
		len(speaker.Email) < 151
}

// Read the content from JSON and turn into a Speaker
func (speaker *Speaker) decodeJSON(r *http.Request) error {
	return json.NewDecoder(r.Body).Decode(speaker)
}

// Return a Speaker as a JSON
func (speaker Speaker) encodeJSON(w http.ResponseWriter) {
	json.NewEncoder(w).Encode(speaker)
}
