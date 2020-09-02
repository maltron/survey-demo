package drive

import (
	"log"
	"github.com/maltron/survey-demo/backend/socket"
	"github.com/mitchellh/mapstructure"
)

type attendeeRegistered struct {
	SurveyID int      `json:"surveyID"`
	Attendee Attendee `json:"attendee"`
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
	var registration attendeeRegistered
	if err := mapstructure.Decode(data, &registration); err != nil {
		log.Printf("### AttendeeRegistration Unable to Decode: %v\n", err)
		return 
	}

	if sessions.add(registration) {
		// If the Attendee was succesfull added, inform the Client
		client.Hub.Broadcast <- listOfAttendees(registration)
	}
	
	log.Printf("Registration: %v\n", sessions[registration.SurveyID])
}

// AttendeeScored Record Points the attendee scored for each particular question
// and then, inform the Client with a list of new Score
func AttendeeScored(client *socket.Client, data interface{}) {
	var registration attendeeRegistered
	if err := mapstructure.Decode(data, &registration); err != nil {
		log.Printf("### AttendeeScored Unable to Decode: %v\n", err)
		return 
	}

	sessions.recordPoints(registration)
	client.Send <- listOfAttendees(registration)
}

func listOfAttendees(registration attendeeRegistered) socket.Command {
	return socket.Command{ Name: "Attendees", Data: sessions[registration.SurveyID] }
}