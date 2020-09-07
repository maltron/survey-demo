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
	"github.com/maltron/survey-demo/backend/database"
	"fmt"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/maltron/survey-demo/backend/model"
	"github.com/maltron/survey-demo/backend/socket"
	"github.com/maltron/survey-demo/backend/survey"
	"github.com/maltron/survey-demo/backend/util"
)

const (
	defaultSurveyPort string = "8080"
	envSurveyPort     string = "SURVEY_PORT"
)

func main() {
	log.Println(" ____  _     ____  _     ________  _   ____  _____ _      ____ ")
	log.Println("/ ___\\/ \\ /\\/  __\\/ \\ |\\/  __/\\  \\//  /  _ \\/  __// \\__/|/  _ \\")
	log.Println("|    \\| | |||  \\/|| | //|  \\   \\  /   | | \\||  \\  | |\\/||| / \\|")
	log.Println("\\___ || \\_/||    /| \\// |  /_  / /    | |_/||  /_ | |  ||| \\_/|")
	log.Println("\\____/\\____/\\_/\\_\\\\__/  \\____\\/_/     \\____/\\____\\\\_/  \\|\\____/")

	// Fetching Port number
	port := util.DefaultValue(envSurveyPort, defaultSurveyPort)
	log.Printf("SURVEY DEMO: Started, Port :%v\n", port)

	router := mux.NewRouter()
	router.HandleFunc("/attendee/{id}", model.GetAttendee).Methods("GET")
	router.HandleFunc("/attendee", model.GetAttendees).Methods("GET")
	router.HandleFunc("/attendee", model.PutAttendee).Methods("PUT")
	router.HandleFunc("/attendee", model.PostAttendee).Methods("POST")
	router.HandleFunc("/attendee", model.DeleteAttendee).Methods("DELETE")
	//router.HandleFunc("/attendee/ranks/{surveyID}", model.GetRanks).Methods("GET")
	router.HandleFunc("/survey/questions/{surveyID}", model.GetSurveyQuestions).Methods("GET")
	router.HandleFunc("/survey/answer", model.PostAttendeeAnswer).Methods("POST")
	router.HandleFunc("/speaker", model.GetSpeakers).Methods("GET")

	// Database Connection
	var connection *database.Connection
	if connection, err := database.NewConnection(); err != nil {
		log.Fatalf("### Database Connection Failed: %v\n", err)
	}
	
	// WEBSOCKET
	websocketRouter := socket.NewRouter(connection)
	router.Handle("/ws", websocketRouter)

	// WebSocket Handlers
	websocketRouter.Handle("SpeakerStartSurvey", survey.SpeakerStartSurvey)
	websocketRouter.Handle("SpeakerJumpQuestion", survey.SpeakerJumpQuestion)
	websocketRouter.Handle("AttendeeStarted", survey.AttendeeStarted) // AttendeeStep.started
	websocketRouter.Handle("AttendeeRegistration", survey.AttendeeRegistration)
	websocketRouter.Handle("AttendeeAnswered", survey.AttendeeAnswered)
	websocketRouter.Handle("AttendeeScored", survey.AttendeeScored)		
	
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

