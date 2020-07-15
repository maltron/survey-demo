package main

// API Documentation
//
// GET /user with Header: Content-type=application/json
// List all existing Users
//     returns: 200 Ok
//     Returns an array of users
//  returns: 204 No Content
//     when there is no data to get from
//  returns: 406 Not Acceptable
//     when there isn't a Header: Content-type=application/json
//  returns: 500 Internal Server Error
//     when it wasn unable to perform a SQL Query
// PUT /user with Header: Content-type=application/json
// Create a new User
//   returns: 201 Created
//   when a User was successfully created
//  returns: 400 Bad Request
//     when one of the fields are empty
//  returns: 406 Not Acceptable
//     when there isn't a Header: Content-type=application/json
//  returns: 409 Conflict
//     when there is another existing user with the same first and last name
//  returns: 417 Expectation Failed
//     The User is not a valid one (size greater than estipulated by the database)
//  returns: 500 Internal Server Error
//     when it wasn unable to perform a SQL Query
// POST /user with Header: Content-type=application/json
// Update an existing User
//   returns: 202 Accepted
//   when a User was successfully updated
//  returns: 204 No Content
//     when no rows were affected
//  returns: 406 Not Acceptable
//     when there isn't a Header: Content-type=application/json
//  returns: 409 Conflict
//     when there is another existing user with the same first and last name
//  returns: 400 Bad Request
//     when one of the fields are empty OR user.ID == 0
//  returns: 417 Expectation Failed
//     The User is not a valid one (size greater than estipulated by the database)
// DELETE /user with Header: Content-type=application/json
// Delete an existing User
//   returns: 202 Accepted
//   when a User was successfully deleted
//  returns: 204 No Content
//     when no rows were affected
//  returns: 417 Expectation Failed
//     The User is not a valid one (size greater than estipulated by the database)

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/gorilla/handlers"
	"github.com/maltron/survey-demo/backend/users"
)

const (
	defaultSurveyPort string = "8080"
	envSurveyPort     string = "SURVEY_PORT"

	defaultDatabaseUser     string = "mauricio"
	defaultDatabasePassword string = "maltron"
	defaultDatabaseHost     string = "127.0.0.1"
	defaultDatabasePort     string = "3306"
	defaultDatabase         string = "survey"

	envDatabaseUser     string = "SURVEY_DATABASE_USER"
	envDatabasePassword string = "SURVEY_DATABASE_PASSWORD"
	envDatabaseHost     string = "SURVEY_DATABASE_HOST"
	envDatabasePort     string = "SURVEY_DATABASE_PORT"
	envDatabase         string = "SURVEY_DATABASE"
	envNotInProduction  string = "NOT_IN_PRODUCTION"
)

var (
	database *sql.DB
	err      error
)

func main() {
	log.Println("Connecting to the database")
	// Connecting to the database
	database, err = sql.Open("mysql", databaseConnection())
	if err != nil {
		log.Fatal("Database Error.")
		panic(err.Error())
	}
	// Testing if we can perform queries
	err = database.Ping()
	if err != nil {
		log.Fatal("Database Error. Unable to connect. Ping failure")
		panic(err.Error())
	}
	defer database.Close()

	// Pass a reference of database to User Object
	users.Database = database

	// Environment variable for Development purposes
	notInProduction, ok := os.LookupEnv(envNotInProduction)
	if ok {
		value, err := strconv.ParseBool(notInProduction)

		if err == nil {
			users.NotInProduction = value
		}
	}
	log.Printf("\"Not In Production\" mode: %v\n", users.NotInProduction)

	// Fetching Port number
	port, ok := os.LookupEnv(envSurveyPort)
	if !ok {
		port = defaultSurveyPort
	}
	log.Printf("SURVEY DEMO: Starting at Port :%v\n", port)

	router := mux.NewRouter()

	// router.HandleFunc("/user", users.Cors).Methods("OPTIONS")
	router.HandleFunc("/user/{id}", users.GetUser).Methods("GET")
	router.HandleFunc("/user", users.GetUsers).Methods("GET")
	router.HandleFunc("/user", users.PutUser).Methods("PUT")
	router.HandleFunc("/user", users.PostUser).Methods("POST")
	router.HandleFunc("/user", users.DeleteUser).Methods("DELETE")

	handler := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedHeaders([]string{"content-type"}),
		handlers.AllowedMethods([]string{"GET", "PUT","POST","DELETE"}),
	)(router)
	
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%v", port), handler))
}

func databaseConnection() string {
	username, ok := os.LookupEnv(envDatabaseUser)
	if !ok {
		username = defaultDatabaseUser
	}

	password, ok := os.LookupEnv(envDatabasePassword)
	if !ok {
		password = defaultDatabasePassword
	}

	host, ok := os.LookupEnv(envDatabaseHost)
	if !ok {
		host = defaultDatabaseHost
	}

	port, ok := os.LookupEnv(envDatabasePort)
	if !ok {
		port = defaultDatabasePort
	}

	database, ok := os.LookupEnv(envDatabase)
	if !ok {
		database = defaultDatabase
	}

	return fmt.Sprintf("%v:%v@tcp(%v:%v)/%v?charset=utf8mb4",
		username, password, host, port, database)
}
