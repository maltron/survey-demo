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



// AttendeeRegistered The Attendee entered into a particular session
// { ID: }
func AttendeeRegistered(client *socket.Client, data interface{}) {
	var registration attendeeRegistered
	if err := mapstructure.Decode(data, &registration); err != nil {
		log.Printf("### AttendeeRegistered Unable to Decode: %v\n", err)
		return 
	}

	if sessions.add(registration) {
		// If the Attendee was succesfull added, inform the Client
		client.Send <- listOfAttendees(registration)
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