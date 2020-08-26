package survey

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// Speaker Describe information about a Speaker
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

// Decode a Speaner and validate Information
func (speaker Speaker) decodeAndValidate(w http.ResponseWriter, r *http.Request) bool {
	error := speaker.decodeJSON(r)
	if error != nil {
		reportError(w, http.StatusBadRequest,  "400 Bad Request", error)
		return false
	}

	// Validate if Speaker is Empty
	if speaker.isEmpty() {
		// If one of the fields are missing
		// 400 Bad Request: One of the fields are empty
		reportError(w, http.StatusBadRequest, 
			fmt.Sprintf("400 Bad Request (Insufficient Speaker Information: %v)\n",
				speaker.String()), nil)
		return false 
	}

	// Check if all the information is valid and fits into
	// the database
	if !speaker.isValid() {
		reportError(w, http.StatusExpectationFailed, 
			fmt.Sprintf("417 Status Expectation Failed (Speaker is not Valid: %v)\n",
				speaker.String()), nil)
		return false
	}

	return true
}

// GET ALL GET ALL GET ALL GET ALL GET ALL GET ALL GET ALL GET ALL
//  GET ALL GET ALL GET ALL GET ALL GET ALL GET ALL GET ALL GET ALL
func GetSpeakers(w http.ResponseWriter, r *http.Request) {
	// If Content-type is not "application/json",
	// return 406 - Not Acceptable
	if !isContentTypeJSON(w, r) {
		return
	}

	// Query Database for Attendees, sorted by first,last name
	const query string = "select ID, username, password, email from survey_speaker order by email"
	rows, err := Database.Query(query)
	defer rows.Close()
	if err != nil {
		// Error: 500 - Internal Server Error
		// PENDING: It seems there is no way to return 500 in case
		//          of something happened to the query
		reportError(w, http.StatusInternalServerError,
			fmt.Sprintf("500 Internal Server Error (query: %v)\n", query), err)
		return
	}

	var speakers []Speaker
	for rows.Next() {
		var speaker Speaker
		err := rows.Scan(&speaker.ID, &speaker.Username, &speaker.Password, &speaker.Email)
		if err != nil {
			// PENDING: Returning a better code information: 500 ?
			panic(err.Error())
		}
		speakers = append(speakers, speaker)
	}

	// If there is content available, return 204 - No Content
	if len(speakers) == 0 {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Header().Set("Accept", "application/json")
	json.NewEncoder(w).Encode(speakers)
}
