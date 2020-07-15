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

type User struct {
	ID        int64  `json:"ID"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}

// Stringer
func (user User) String() string {
	return fmt.Sprintf("{\"ID\":%d,\"firstName\":\"%v\",\"lastName\":\"%v\"}",
		user.ID, user.FirstName, user.LastName)
}

// Returns true if one of the fields are empty
func (user User) isEmpty() bool {
	return len(user.FirstName) == 0 || len(user.LastName) == 0
}

// Returns true if this information is valid
func (user User) isValid() bool {
	return len(user.FirstName) > 0 &&
		len(user.LastName) > 0 &&
		len(user.FirstName) < 51 &&
		len(user.LastName) < 51
}

// Read the content from JSON and turn into a User
func (user *User) decodeJSON(r *http.Request) error {
	return json.NewDecoder(r.Body).Decode(user)
}

// Returns a User as a JSON
func (user User) encodeJSON(w http.ResponseWriter) {
	json.NewEncoder(w).Encode(user)
}

func (user *User) decodeAndValidate(w http.ResponseWriter, r *http.Request) bool {
	error := user.decodeJSON(r)
	if error != nil {
		reportError(w, http.StatusBadRequest, "400 Bad Request", error)
		return false
	}

	// Validate if there are both firstName and lastName
	if user.isEmpty() {
		// If one of the fields are missing
		// 400 Bad Request: One of the fields are empty
		reportError(w, http.StatusBadRequest,
			fmt.Sprintf("400 Bad Request (Insufficient User Information: %v)\n",
				user.String()), nil)
		return false
	}

	// Check if all the information is valid and fits into
	// the database
	if !user.isValid() {
		reportError(w, http.StatusExpectationFailed,
			fmt.Sprintf("417 Status Expectation Failed (User is not Valid: %v)\n",
				user.String()), nil)
		return false
	}

	return true
}

// DELETE DELETE DELETE DELETE DELETE DELETE DELETE DELETE DELETE DELETE
//  DELETE DELETE DELETE DELETE DELETE DELETE DELETE DELETE DELETE DELETE
func DeleteUser(w http.ResponseWriter, r *http.Request) {
	handlePostDelete(w, r, true)
}

// POST UPDATE POST UPDATE POST UPDATE POST UPDATE POST UPDATE
//  POST UPDATE POST UPDATE POST UPDATE POST UPDATE POST UPDATE
func PostUser(w http.ResponseWriter, r *http.Request) {
	handlePostDelete(w, r, false)
}

// A single function to handle both Post(UPDATE) and Delete(DELETE)
func handlePostDelete(w http.ResponseWriter, r *http.Request, isDelete bool) {
	// If Content-type is not "application/json",
	// return 406 - Not Acceptable
	if !isContentTypeJSON(w, r) {
		return
	}

	var user User
	if !user.decodeAndValidate(w, r) {
		// Unable to decode the User and make sure is a valid
		// All the HTTP Response codes were already performed
		return
	}

	// In order to update, a User ID must be > 0
	if user.ID == 0 {
		reportError(w, http.StatusExpectationFailed,
			fmt.Sprintf("417 Status Expectation Failed (User ID not valid: %v)\n",
				user.String()), nil)
		return
	}

	// Step 1/3: Prepare a statement for updating
	var query string
	if isDelete {
		query = "delete from survey_user where ID = ?"
	} else {
		query = "update survey_user set firstName=?,lastName=? where ID = ?"
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
		result, err = statement.Exec(user.ID)
	} else {
		result, err = statement.Exec(user.FirstName, user.LastName, user.ID)
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
	user.encodeJSON(w)
}

// PUT INSERT PUT INSERT PUT INSERT PUT INSERT PUT INSERT
//   PUT INSERT PUT INSERT PUT INSERT PUT INSERT PUT INSERT
func PutUser(w http.ResponseWriter, r *http.Request) {
	// If Content-type is not "application/json",
	// return 406 - Not Acceptable
	if !isContentTypeJSON(w, r) {
		return
	}

	var user User
	if !user.decodeAndValidate(w, r) {
		// Unable to decode the User and make sure is a valid
		// All the HTTP Response codes were already performed
		return
	}

	// Step 1/3: Prepare a statement for inserting
	// log.Println("Step 1/3")
	const query string = "insert into survey_user(firstName, lastName) values(?, ?)"
	statement, err := Database.Prepare(query)
	defer statement.Close()
	if err != nil {
		reportError(w, http.StatusInternalServerError,
			fmt.Sprintf("500 Internal Server Error (Unable to Prepare Statement: %v)\n", query), err)
		return
	}

	// Step 2/3: Execute the Statement and try to Insert
	// log.Println("Step 2/3: User:", user)
	result, err := statement.Exec(user.FirstName, user.LastName)
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
	user.ID, err = result.LastInsertId()
	if err != nil {
		reportError(w, http.StatusInternalServerError,
			"Internal Server Error (result.LastInsertId())", err)
		return
	}

	// Step 3/3: The content was inserted and notify
	//      with 201 - Created
	// log.Println("Step 3/3")
	w.WriteHeader(http.StatusCreated)
	user.encodeJSON(w)
}

// GET ALL GET ALL GET ALL GET ALL GET ALL GET ALL GET ALL GET ALL
//  GET ALL GET ALL GET ALL GET ALL GET ALL GET ALL GET ALL GET ALL
func GetUsers(w http.ResponseWriter, r *http.Request) {
	// If Content-type is not "application/json",
	// return 406 - Not Acceptable
	if !isContentTypeJSON(w, r) {
		return
	}

	// Query Database for Users, sorted by first,last name
	const query string = "select ID, firstName, lastName from survey_user order by firstName, lastname"
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

	var users []User
	for rows.Next() {
		var user User
		err := rows.Scan(&user.ID, &user.FirstName, &user.LastName)
		if err != nil {
			// PENDING: Returning a better code information: 500 ?
			panic(err.Error())
		}
		users = append(users, user)
	}

	// If there is content available, return 204 - No Content
	if len(users) == 0 {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Header().Set("Accept", "application/json")
	json.NewEncoder(w).Encode(users)
}

// SINGLE GET SINGLE GET SINGLE GET SINGLE GET SINGLE GET SINGLE GET
//  SINGLE GET SINGLE GET SINGLE GET SINGLE GET SINGLE GET SINGLE GET
func GetUser(w http.ResponseWriter, r *http.Request) {
	ID, ok := mux.Vars(r)["id"]
	if !ok {
		reportError(w, http.StatusInternalServerError,
			"500 Internal Server Error (Unable to fetch ID from URL)", nil)
		return
	}

	query := fmt.Sprintf("select ID, firstName, lastName from survey_user where ID = %v", ID)
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

	var user User
	if rows.Next() {
		err := rows.Scan(&user.ID, &user.FirstName, &user.LastName)
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
	json.NewEncoder(w).Encode(user)
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
