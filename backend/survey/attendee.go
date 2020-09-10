package survey

import (
	"log"
	"github.com/mitchellh/mapstructure"
	"github.com/maltron/survey-demo/backend/socket"
	"github.com/maltron/survey-demo/backend/model"
	"github.com/maltron/survey-demo/backend/database"
)

type attendeeRegistration struct {
	SurveyID int      `json:"surveyID"`
	Attendee model.Attendee `json:"attendee"`
}

// AttendeeStarted Attendee initiated a session in the 
// Registration step
// Attendee.started
func AttendeeStarted(client *socket.Client, data interface{}) {
	log.Printf(">>> AttedeeStarted: %v\n", data)
	var registration attendeeRegistration
	if err := mapstructure.Decode(data, &registration); err != nil {
		log.Printf("### AttendeeStarted Unable to Decode: %v\n", err)
	}

	// Fetch all the questions for this Survey and returns to 
	// this particular Attendee
	if questions, err := database.GetSurveyQuestions(client.Connection, registration.SurveyID); err == nil {
		log.Printf(">>> AttendeeStarted Returning questions")
		client.Send <- socket.Command{ Name: "SurveyQuestions", Data: questions }
	}
}


// AttendeeRegistration The Attendee entered into a particular session
// {
// 	"name":"AttendeeRegistration",
// 	"data":{
// 	   "surveyID":1,
// 	   "attendee":{
// 		  "id":1,
// 		  "firstName":"John",
// 		  "lastName":"Smith",
// 		  "email":"john@smith.com",
// 		  "points":0
// 	   }
// 	}
//  }
func AttendeeRegistration(client *socket.Client, data interface{}) {
	log.Printf(">>> AttendeeRegistration: %v\n", data)
	var registration attendeeRegistration
	if err := mapstructure.Decode(data, &registration); err != nil {
		log.Printf("### AttendeeRegistration Unable to Decode: %v\n", err)
		return 
	}

	// Make sure Attendee is registered to a particular Survey
	registration.Attendee.Survey = registration.SurveyID;

	log.Printf(">>> AttendeeRegistration SaveAttendee: %v\n", registration.Attendee)
	database.SaveAttendee(client.Connection, &registration.Attendee)
	// Inform everyone an Attendee is Registered
	log.Printf(">>> AttendeeRegistration SaveAttendee: AttendeeRegistered: %v\n", registration);
	client.Hub.Broadcast <- socket.Command{ Name: "AttendeeRegistered", Data: registration }
}

// AttendeeAnswered Attendee answered a specific Question
func AttendeeAnswered(client *socket.Client, data interface{}) {
	log.Printf(">>> AttendeeAnswered: %v\n", data)
	var answered model.Answered
	if err := mapstructure.Decode(data, &answered); err != nil {
		log.Printf("### AttendeeAnswered Unable to Decode: %v\n", err)
		return 
	}

	database.RecordAttendeeAnswered(client.Connection, &answered)
}

// AttendeeScored Record Points the attendee scored for each particular question
// and then, inform the Client with a list of new Score
func AttendeeScored(client *socket.Client, data interface{}) {
	log.Printf(">>> AttendeeScored: %v\n", data)
	var registration attendeeRegistration
	if err := mapstructure.Decode(data, &registration); err != nil {
		log.Printf("### AttendeeScored Unable to Decode: %v\n", err)
		return 
	}

	if database.RecordPoints(client.Connection, registration.Attendee) {
		client.Hub.Broadcast <- socket.Command{ Name: "AttendeeScored", Data: registration }
	}	
}

// func listOfAttendees(registration attendeeRegistration) socket.Command {
// 	return socket.Command{ Name: "Attendees", Data: sessions[registration.SurveyID] }
// }