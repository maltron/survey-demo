package drive

import (
	"log"
	"github.com/maltron/survey-demo/backend/socket"
	"github.com/mitchellh/mapstructure"
)



// AttendeeRegistered The Attendee entered into a particular session
// { ID: }
func AttendeeRegistered(client *socket.Client, data interface{}) {
	var registration struct {
		SurveyID int `json:"surveyID"`
		Attendee Attendee `json:"attendee"`
	}
	if err := mapstructure.Decode(data, &registration); err != nil {
		log.Printf("### AttendeeRegistered Unable to Decode: %v\n", err)
		return 
	}

	if sessions.add(registration.SurveyID, registration.Attendee) {
		// If the Attendee was succesfull added, inform the Client
		client.Send <- socket.Command{Name: "Attendees", 
							Data: sessions[registration.SurveyID] }
	}
	
	log.Printf("Registration: %v\n", sessions[registration.SurveyID])
}