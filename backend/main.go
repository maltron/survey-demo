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
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/maltron/survey-demo/backend/survey"
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
)

var (
	database *sql.DB
	err      error
)

// // WEBSOCKET: TESTING
// var upgrader = websocket.Upgrader{} // Use Default values

// type Command struct {
// 	Command string `json:"command"`
// 	Data    string `json:"data"`
// }

// func echo(w http.ResponseWriter, r *http.Request) {
// 	log.Println("WEBSOCKET BEGIN >>>>>>>>>>>>")
// 	// log.Println(">>> WEBSOCKET Echo Upgrading")
// 	// for name, value := range r.Header {
// 	// 	log.Printf("Header %v:%v\n", name, value)
// 	// }
// 	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
// 	connection, err := upgrader.Upgrade(w, r, nil);
// 	if err != nil {
// 		log.Println("### ERROR UPGRADE:", err)
// 		panic(err.Error);
// 	}
// 	defer connection.Close();

// 	for {
// 		log.Println(">>> WEBSOCKET BEGIN LOOP #####")
// 		// READ THE MESSAGE
// 		messageType, message, err := connection.ReadMessage();
// 		if err != nil {
// 			log.Println("### ERROR READ:", err)
// 			break;
// 		}

// 		command := Command{}
// 		errJSON := json.Unmarshal(message, &command);
// 		if errJSON != nil {
// 			log.Println("### JSON ERROR:", errJSON)
// 		}
// 		log.Printf(">>> WEBSOCKET Command: %v Data: %v\n", command.Command, command.Data)

// 		// WRITE THE MESSAGE BACK
// 		log.Printf(">>> WEBSOCKET Message messageType: %d Received:%s Type:%T\n",
// 															messageType, message, message)
// 		log.Println(">>> WEBSOCKET Writing the same message back")
// 		err = connection.WriteMessage(messageType, message);
// 		if err != nil {
// 			log.Println("### ERROR WRITE: ", err);
// 			break;
// 		}
// 		log.Println(">>> WEBSOCKET END LOOP #####")
// 	}
// 	log.Println("WEBSOCKET END <<<<<<<<<<<<<")
// }

func main() {
	var addr = flag.String("addr", "localhost:8080", "http service address")
	log.Printf("addr (%T) %v\n", addr, addr)
	log.Println(" ____  _     ____  _     ________  _   ____  _____ _      ____ ")
	log.Println("/ ___\\/ \\ /\\/  __\\/ \\ |\\/  __/\\  \\//  /  _ \\/  __// \\__/|/  _ \\")
	log.Println("|    \\| | |||  \\/|| | //|  \\   \\  /   | | \\||  \\  | |\\/||| / \\|")
	log.Println("\\___ || \\_/||    /| \\// |  /_  / /    | |_/||  /_ | |  ||| \\_/|")
	log.Println("\\____/\\____/\\_/\\_\\\\__/  \\____\\/_/     \\____/\\____\\\\_/  \\|\\____/")
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

	// Creating basic tables
	log.Println("Creating tables")
	rows, err := database.Query("create table if not exists survey_user(ID int not null auto_increment, firstName varchar(50) not null, lastName varchar(50) not null, unique(firstName, lastName), primary key(ID)) default charset utf8mb4 collate utf8mb4_unicode_ci")
	defer rows.Close()
	if err != nil {
		log.Fatal("Database Error. Unable to create basic tables")
		panic(err.Error())
	}

	// Pass a reference of database to User Object
	users.Database = database
	survey.Database = database

	// Fetching Port number
	port, ok := os.LookupEnv(envSurveyPort)
	if !ok {
		port = defaultSurveyPort
	}
	log.Printf("SURVEY DEMO: Starting at Port :%v\n", port)

	router := mux.NewRouter()

	router.HandleFunc("/attendee/{id}", users.GetAttendee).Methods("GET")
	router.HandleFunc("/attendee", users.GetAttendees).Methods("GET")
	router.HandleFunc("/attendee", users.PutAttendee).Methods("PUT")
	router.HandleFunc("/attendee", users.PostAttendee).Methods("POST")
	router.HandleFunc("/attendee", users.DeleteAttendee).Methods("DELETE")

	router.HandleFunc("/survey", survey.GetSurveys).Methods("GET")

	// WEBSOCKET
	router.HandleFunc("/ws", survey.WebSocket)

	handler := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedHeaders([]string{"content-type"}),
		handlers.AllowedMethods([]string{"GET", "PUT", "POST", "DELETE"}),
	)(router)

	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%v", port), handler))
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
