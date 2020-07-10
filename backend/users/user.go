package users

import (
	"fmt"
	"strings"
	"log"
	"net/http"
	"encoding/json"
	"database/sql"
)

var Database *sql.DB

type User struct {
	ID int64 `json:"ID"`
	FirstName string `json:"firstName"`
	LastName string `json:"lastName"`
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

func (user *User) decodeAndValidate(w http.ResponseWriter, r *http.Request) (bool, error) {
	error := user.decodeJSON(r)
	if error != nil {
		w.WriteHeader(http.StatusBadRequest)
		log.Printf("### 400 Bad Request: ????\n")
		return false, error
	}

	// Validate if there are both firstName and lastName
	if user.isEmpty() {
		// If one of the fields are missing 
		// 400 Bad Request: One of the fields are empty
		log.Printf("### 400 Bad Request: Insufficient User Information: %v\n", user.String())
		w.WriteHeader(http.StatusBadRequest)
		return false, error
	}

	// Check if all the information is valid and fits into 
	// the database
	if !user.isValid() {
		log.Printf("### 417 Expectation Failed: This User is not Valid: %v\n", user.String())
		w.WriteHeader(http.StatusExpectationFailed)
		return false, error 
	}

	return true, nil
}

// POST UPDATE POST UPDATE POST UPDATE POST UPDATE POST UPDATE 
//  POST UPDATE POST UPDATE POST UPDATE POST UPDATE POST UPDATE 
func PostUser(w http.ResponseWriter, r *http.Request) {
	// If Content-type is not "application/json", 
	// return 406 - Not Acceptable
	if !checkContentTypeJSON(w, r) {
		return
	}

	var user User
	ok, error := user.decodeAndValidate(w, r)
	if !ok {
		return
	}

	

}

// PUT INSERT PUT INSERT PUT INSERT PUT INSERT PUT INSERT 
//   PUT INSERT PUT INSERT PUT INSERT PUT INSERT PUT INSERT 
func PutUser(w http.ResponseWriter, r *http.Request) {
	// If Content-type is not "application/json", 
	// return 406 - Not Acceptable
	if !checkContentTypeJSON(w, r) {
		return
	}
 
	var user User
	ok, error := user.decodeAndValidate(w, r)
	if !ok {
		return
	}

	// Step 1/3: Prepare a statement for inserting
	// log.Println("Step 1/3")
	const query string = "insert into survey_user(firstName, lastName) values(?, ?)"
	statement, err := Database.Prepare(query)
	defer statement.Close()
	if err != nil {
		log.Printf("Unable to Prepare Statement: %v\n", query)
		internalServerError(w, err, query)
		return
	}

	// Step 2/3: Execute the Statement and try to Insert
	// log.Println("Step 2/3: User:", user)
	result, err := statement.Exec(user.FirstName, user.LastName)
	if err != nil {
		// Check if there is a duplication
		//  409 Conflict
		if strings.Contains(err.Error(), "Duplicate") {
			log.Printf("### 409 Conflict: %v\n", err.Error())
			w.WriteHeader(http.StatusConflict)
		} else {
			internalServerError(w, err, query)
		}
		return
	}

	// Retriving the ID inserted
	// and update into the struct 
	user.ID, err = result.LastInsertId()
	if err != nil {
		internalServerError(w, err, "result.LastInsertId()")
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
	if !checkContentTypeJSON(w, r) {
	   return
	}

	// Query Database for Users
	const query string = "select ID, firstName, lastName from survey_user order by firstName, lastname"
	rows, err := Database.Query(query);
	defer rows.Close()
	if err != nil {
		// Error: 500 - Internal Server Error
		// PENDING: It seems there is no way to return 500 in case
		//          of something happened to the query
		internalServerError(w, err, query)
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

func decodeAndValidateUser(r *http.R)

func checkContentTypeJSON(w http.ResponseWriter, r *http.Request) bool {
	if r.Header.Get("Content-type") != "application/json" {
		w.WriteHeader(http.StatusNotAcceptable)
		return false 
	} 
	
	return true
}

func internalServerError(w http.ResponseWriter, error error, query string) {
	// 500 - Internal Server Error
	w.WriteHeader(http.StatusInternalServerError)
	log.Printf("### 500 Internal Server Error: Unable to perform query: %v\n", query)
	log.Println(error.Error())
}