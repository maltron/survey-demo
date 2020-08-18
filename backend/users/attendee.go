package users

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
)

var Database *sql.DB

type Attendee struct {
	ID        int64  `json:"ID"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:email`
}

// Stringer
func (attendee Attendee) String() string {
	return fmt.Sprintf("{\"ID\":%d,\"firstName\":\"%v\",\"lastName\":\"%v\",\"email\":\"%v\"}",
		attendee.ID, attendee.FirstName, attendee.LastName, attendee.Email)
}

// Returns true if one of the fields are empty
func (attendee Attendee) isEmpty() bool {
	return len(attendee.FirstName) == 0 || len(attendee.LastName) == 0
}

// Returns true if this information is valid
func (attendee Attendee) isValid() bool {
	return len(attendee.FirstName) > 0 &&
		len(attendee.LastName) > 0 &&
		len(attendee.FirstName) < 51 &&
		len(attendee.LastName) < 51
}

// Read the content from JSON and turn into a Attendee
func (attendee *Attendee) decodeJSON(r *http.Request) error {
	return json.NewDecoder(r.Body).Decode(attendee)
}

// Returns a Attendee as a JSON
func (attendee Attendee) encodeJSON(w http.ResponseWriter) {
	json.NewEncoder(w).Encode(attendee)
}

func (attendee *Attendee) decodeAndValidate(w http.ResponseWriter, r *http.Request) bool {
	error := attendee.decodeJSON(r)
	if error != nil {
		reportError(w, http.StatusBadRequest, "400 Bad Request", error)
		return false
	}

	// Validate if there are both firstName and lastName
	if attendee.isEmpty() {
		// If one of the fields are missing
		// 400 Bad Request: One of the fields are empty
		reportError(w, http.StatusBadRequest,
			fmt.Sprintf("400 Bad Request (Insufficient Attendee Information: %v)\n",
				attendee.String()), nil)
		return false
	}

	// Check if all the information is valid and fits into
	// the database
	if !attendee.isValid() {
		reportError(w, http.StatusExpectationFailed,
			fmt.Sprintf("417 Status Expectation Failed (Attendee is not Valid: %v)\n",
				attendee.String()), nil)
		return false
	}

	return true
}

// DELETE DELETE DELETE DELETE DELETE DELETE DELETE DELETE DELETE DELETE
//  DELETE DELETE DELETE DELETE DELETE DELETE DELETE DELETE DELETE DELETE
func DeleteAttendee(w http.ResponseWriter, r *http.Request) {
	handlePostDelete(w, r, true)
}

// POST UPDATE POST UPDATE POST UPDATE POST UPDATE POST UPDATE
//  POST UPDATE POST UPDATE POST UPDATE POST UPDATE POST UPDATE
func PostAttendee(w http.ResponseWriter, r *http.Request) {
	handlePostDelete(w, r, false)
}

// A single function to handle both Post(UPDATE) and Delete(DELETE)
func handlePostDelete(w http.ResponseWriter, r *http.Request, isDelete bool) {
	// If Content-type is not "application/json",
	// return 406 - Not Acceptable
	if !isContentTypeJSON(w, r) {
		return
	}

	var attendee Attendee
	if !attendee.decodeAndValidate(w, r) {
		// Unable to decode the Attendee and make sure is a valid
		// All the HTTP Response codes were already performed
		return
	}

	// In order to update, a Attendee ID must be > 0
	if attendee.ID == 0 {
		reportError(w, http.StatusExpectationFailed,
			fmt.Sprintf("417 Status Expectation Failed (Attendee ID not valid: %v)\n",
				attendee.String()), nil)
		return
	}

	// Step 1/3: Prepare a statement for updating
	var query string
	if isDelete {
		query = "delete from survey_attendee where ID = ?"
	} else {
		query = "update survey_attendee set firstName=?,lastName=?,email=? where ID = ?"
	}
	statement, err := Database.Prepare(query)
	defer statement.Close()
	if err != nil {
		reportError(w, http.StatusInternalServerError,
			fmt.Sprintf("500 Internal Server Error (Unable to Prepare Statement: %v)\n", query), err)
		return
	}

	// Step 2/3: Execute the Prepared Statement
	var result sql.Result
	if isDelete {
		result, err = statement.Exec(attendee.ID)
	} else {
		result, err = statement.Exec(attendee.FirstName, attendee.LastName, attendee.Email, attendee.ID)
	}
	if err != nil {
		// Check if there is a duplication
		//  409 Conflict
		if strings.Contains(err.Error(), "Duplicate") {
			reportError(w, http.StatusConflict, "409 Conflict", err)
		} else {
			reportError(w, http.StatusInternalServerError,
				"500 Internal Server Error (Executing Prepared Statement)", err)
		}
		return
	}

	// Step 3/3: The content was inserted and notify
	//      with 201 - Created
	// log.Println("Step 3/3")
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		reportError(w, http.StatusInternalServerError,
			"500 Internal Server Error (Rows Affected)", err)
		return
	}
	if rowsAffected > 0 {
		w.WriteHeader(http.StatusAccepted)
	} else {
		w.WriteHeader(http.StatusNoContent)
	}
	attendee.encodeJSON(w)
}

// PUT INSERT PUT INSERT PUT INSERT PUT INSERT PUT INSERT
//   PUT INSERT PUT INSERT PUT INSERT PUT INSERT PUT INSERT
func PutAttendee(w http.ResponseWriter, r *http.Request) {
	// If Content-type is not "application/json",
	// return 406 - Not Acceptable
	if !isContentTypeJSON(w, r) {
		return
	}

	var attendee Attendee
	if !attendee.decodeAndValidate(w, r) {
		// Unable to decode the Attendee and make sure is a valid
		// All the HTTP Response codes were already performed
		return
	}

	// Step 1/3: Prepare a statement for inserting
	// log.Println("Step 1/3")
	const query string = "insert into survey_attendee(firstName, lastName, email) values(?, ?, ?)"
	statement, err := Database.Prepare(query)
	defer statement.Close()
	if err != nil {
		reportError(w, http.StatusInternalServerError,
			fmt.Sprintf("500 Internal Server Error (Unable to Prepare Statement: %v)\n", query), err)
		return
	}

	// Step 2/3: Execute the Statement and try to Insert
	// log.Println("Step 2/3: Attendee:", attendee)
	result, err := statement.Exec(attendee.FirstName, attendee.LastName, attendee.Email)
	if err != nil {
		// Check if there is a duplication
		//  409 Conflict
		if strings.Contains(err.Error(), "Duplicate") {
			reportError(w, http.StatusConflict, "409 Conflict", err)
		} else {
			reportError(w, http.StatusInternalServerError,
				"500 Internal Server Error (Executing Prepared Statement)", err)
		}
		return
	}

	// Retriving the ID inserted
	// and update into the struct
	attendee.ID, err = result.LastInsertId()
	if err != nil {
		reportError(w, http.StatusInternalServerError,
			"Internal Server Error (result.LastInsertId())", err)
		return
	}

	// Step 3/3: The content was inserted and notify
	//      with 201 - Created
	// log.Println("Step 3/3")
	w.WriteHeader(http.StatusCreated)
	attendee.encodeJSON(w)
}

// GET ALL GET ALL GET ALL GET ALL GET ALL GET ALL GET ALL GET ALL
//  GET ALL GET ALL GET ALL GET ALL GET ALL GET ALL GET ALL GET ALL
func GetAttendees(w http.ResponseWriter, r *http.Request) {
	// If Content-type is not "application/json",
	// return 406 - Not Acceptable
	if !isContentTypeJSON(w, r) {
		return
	}

	// Query Database for Attendees, sorted by first,last name
	const query string = "select ID, firstName, lastName, email from survey_attendee order by firstName, lastname"
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

	var attendees []Attendee
	for rows.Next() {
		var attendee Attendee
		err := rows.Scan(&attendee.ID, &attendee.FirstName, &attendee.LastName, &attendee.Email)
		if err != nil {
			// PENDING: Returning a better code information: 500 ?
			panic(err.Error())
		}
		attendees = append(attendees, attendee)
	}

	// If there is content available, return 204 - No Content
	if len(attendees) == 0 {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Header().Set("Accept", "application/json")
	json.NewEncoder(w).Encode(attendees)
}

// SINGLE GET SINGLE GET SINGLE GET SINGLE GET SINGLE GET SINGLE GET
//  SINGLE GET SINGLE GET SINGLE GET SINGLE GET SINGLE GET SINGLE GET
func GetAttendee(w http.ResponseWriter, r *http.Request) {
	ID, ok := mux.Vars(r)["id"]
	if !ok {
		reportError(w, http.StatusInternalServerError,
			"500 Internal Server Error (Unable to fetch ID from URL)", nil)
		return
	}

	query := fmt.Sprintf("select ID, firstName, lastName, email from survey_attendee where ID = %v", ID)
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

	var attendee Attendee
	if rows.Next() {
		err := rows.Scan(&attendee.ID, &attendee.FirstName, &attendee.LastName, &attendee.Email)
		if err != nil {
			// PENDING: Returning a better code information: 500 ?
			panic(err.Error())
		}
	} else {
		reportError(w, http.StatusNotFound,
			fmt.Sprintf("404 Not Found (ID: %v)\n", ID), nil)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Header().Set("Accept", "application/json")
	json.NewEncoder(w).Encode(attendee)
}

func isContentTypeJSON(w http.ResponseWriter, r *http.Request) bool {
	if r.Header.Get("Content-type") != "application/json" {
		reportError(w, http.StatusNotAcceptable, 
			fmt.Sprintf("406 Not Acceptable: %v\n", r.Header.Get("Content-type")), nil)
		return false
	}
	return true
}

func reportError(w http.ResponseWriter, httpStatusCode int, description string, err error) {
	w.WriteHeader(httpStatusCode)
	if err != nil {
		log.Printf("### %v: %v\n", description, err.Error())
	} else {
		log.Printf("### %v\n", description)
	}
}

// func Cors(w http.ResponseWriter, r *http.Request) {
// 	log.Println("OPTIONS")
// 	for name, value := range r.Header {
// 		log.Printf("Header %v:%v\n", name, value)
// 	}
// 	w.Header().Set("Access-Control-Allow-Origin", "*")
// 	w.Header().Set("Access-Control-Allow-Headers", "*")
// 	w.Header().Set("Access-Control-Allow-Methods", "*")
// 	return 
// }
