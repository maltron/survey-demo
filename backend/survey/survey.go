package survey

import (
	"fmt"
	"encoding/json"
	"net/http"
	"database/sql"
)


// Database Connection (usually, MySQL)
var Database *sql.DB

// Survey | Information about a particular Survey (usually, mapped to a database table)
type Survey struct {
	ID int64 `json:"ID"`
	Name string `json:"name"`
}

// Stringer 
func (survey Survey) String() string {
	return fmt.Sprintf("{\"ID\":%d, \"name\":%s}", survey.ID, survey.Name)
}

// Decoder 
func (survey *Survey) decodeJSON(r *http.Request) error {
	return json.NewDecoder(r.Body).Decode(survey)
}

// Encode 
func (survey Survey) encodeJSON(w http.ResponseWriter) {
	json.NewEncoder(w).Encode(survey)
}

// GetSurveys | Return a list of all existing Surveys, where a User will be consuming
func GetSurveys(w http.ResponseWriter, r *http.Request) {
	// If Content-type is not "application/json",
	// return 406 - Not Acceptable
	if !IsContentTypeJSON(w, r) {
		return
	}	

	const query string = "select ID, name from survey order by ID"
	rows, err := Database.Query(query)
	defer rows.Close()
	if err != nil {
		// Error: 500 - Internal Server Error
		// PENDING: It seems there is no way to return 500 in case
		//          of something happened to the query
		ReportError(w, http.StatusInternalServerError,
			fmt.Sprintf("500 Internal Server Error (query: %v)\n", query), err)
		return
	}

	var surveys []Survey
	for rows.Next() {
		var survey Survey
		err := rows.Scan(&survey.ID, &survey.Name)
		if err != nil {
			// PENDING: Returning a better code information: 500 ?
			panic(err.Error())
		}
		surveys = append(surveys, survey)
	}

	// If there is content available, return 204 - No Content
	if len(surveys) == 0 {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Header().Set("Accept", "application/json")
	json.NewEncoder(w).Encode(surveys)	
}