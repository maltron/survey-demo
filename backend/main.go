package main

// API Documentation
//
// GET /attendee with Header: Content-type=application/json
// List all existing Attendees
//     returns: 200 Ok
//     Returns an array of attendees
//  returns: 204 No Content
//     when there is no data to get from
//  returns: 406 Not Acceptable
//     when there isn't a Header: Content-type=application/json
//  returns: 500 Internal Server Error
//     when it wasn unable to perform a SQL Query
// PUT /attendee with Header: Content-type=application/json
// Create a new Attendee
//   returns: 201 Created
//   when a Attendee was successfully created
//  returns: 400 Bad Request
//     when one of the fields are empty
//  returns: 406 Not Acceptable
//     when there isn't a Header: Content-type=application/json
//  returns: 409 Conflict
//     when there is another existing attendee with the same first and last name
//  returns: 417 Expectation Failed
//     The Attendee is not a valid one (size greater than estipulated by the database)
//  returns: 500 Internal Server Error
//     when it wasn unable to perform a SQL Query
// POST /attendee with Header: Content-type=application/json
// Update an existing Attendee
//   returns: 202 Accepted
//   when a Attendee was successfully updated
//  returns: 204 No Content
//     when no rows were affected
//  returns: 406 Not Acceptable
//     when there isn't a Header: Content-type=application/json
//  returns: 409 Conflict
//     when there is another existing attendee with the same first and last name
//  returns: 400 Bad Request
//     when one of the fields are empty OR attendee.ID == 0
//  returns: 417 Expectation Failed
//     The Attendee is not a valid one (size greater than estipulated by the database)
// DELETE /attendee with Header: Content-type=application/json
// Delete an existing Attendee
//   returns: 202 Accepted
//   when a Attendee was successfully deleted
//  returns: 204 No Content
//     when no rows were affected
//  returns: 417 Expectation Failed
//     The Attendee is not a valid one (size greater than estipulated by the database)

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/maltron/survey-demo/backend/survey"
	"github.com/maltron/survey-demo/backend/socket"
	"github.com/maltron/survey-demo/backend/drive"
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
)

var (
	database *sql.DB
	err      error
)

func main() {
	log.Println(" ____  _     ____  _     ________  _   ____  _____ _      ____ ")
	log.Println("/ ___\\/ \\ /\\/  __\\/ \\ |\\/  __/\\  \\//  /  _ \\/  __// \\__/|/  _ \\")
	log.Println("|    \\| | |||  \\/|| | //|  \\   \\  /   | | \\||  \\  | |\\/||| / \\|")
	log.Println("\\___ || \\_/||    /| \\// |  /_  / /    | |_/||  /_ | |  ||| \\_/|")
	log.Println("\\____/\\____/\\_/\\_\\\\__/  \\____\\/_/     \\____/\\____\\\\_/  \\|\\____/")
	log.Println("Connecting to the database")
	// Connecting to the database
	// database, err = sql.Open("mysql", databaseConnection())
	// if err != nil {
	// 	log.Fatal("Database Error.")
	// 	panic(err.Error())
	// }
	// // Testing if we can perform queries
	// err = database.Ping()
	// if err != nil {
	// 	log.Fatal("Database Error. Unable to connect. Ping failure")
	// 	panic(err.Error())
	// }
	// defer database.Close()

	// // Creating basic tables
	// log.Println("Creating tables")
	// rows, err := database.Query("create table if not exists survey_user(ID int not null auto_increment, firstName varchar(50) not null, lastName varchar(50) not null, unique(firstName, lastName), primary key(ID)) default charset utf8mb4 collate utf8mb4_unicode_ci")
	// defer rows.Close()
	// if err != nil {
	// 	log.Fatal("Database Error. Unable to create basic tables")
	// 	panic(err.Error())
	// }

	// // Pass a reference of database to User Object
	// survey.Database = database

	// Fetching Port number
	port, ok := os.LookupEnv(envSurveyPort)
	if !ok {
		port = defaultSurveyPort
	}
	log.Printf("SURVEY DEMO: Started, Port :%v\n", port)

	router := mux.NewRouter()
	router.HandleFunc("/attendee/{id}", survey.GetAttendee).Methods("GET")
	router.HandleFunc("/attendee", survey.GetAttendees).Methods("GET")
	router.HandleFunc("/attendee", survey.PutAttendee).Methods("PUT")
	router.HandleFunc("/attendee", survey.PostAttendee).Methods("POST")
	router.HandleFunc("/attendee", survey.DeleteAttendee).Methods("DELETE")
	router.HandleFunc("/attendee/ranks/{surveyID}", survey.GetRanks).Methods("GET")
	router.HandleFunc("/survey/questions/{surveyID}", survey.GetSurveyQuestions).Methods("GET")
	router.HandleFunc("/survey/answer", survey.PostAttendeeAnswer).Methods("POST")
	router.HandleFunc("/speaker", survey.GetSpeakers).Methods("GET")
	
	// WEBSOCKET
	websocketRouter := socket.NewRouter()
	router.Handle("/ws", websocketRouter)

	// WebSocket Handlers
	websocketRouter.Handle("SpeakerStartSurvey", drive.SpeakerStartSurvey)
	websocketRouter.Handle("AttendeeRegistered", drive.AttendeeRegistered)
	websocketRouter.Handle("AttendeeScored", drive.AttendeeScored)
	
	handler := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedHeaders([]string{"content-type"}),
		handlers.AllowedMethods([]string{"GET", "PUT", "POST", "DELETE"}),
	)(router)

	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%v", port), handler))
	// log.Fatal(http.ListenAndServe(fmt.Sprintf(":%v", port), nil))
	// Example of service using HTTPS
	// log.Fatal(http.ListenAndServeTLS(fmt.Sprintf(":%v", port), "server.crt", "server.key", handler))
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
