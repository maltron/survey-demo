package survey

import (
	"log"
	"github.com/maltron/survey-demo/backend/socket"
	"github.com/mitchellh/mapstructure"
	"github.com/maltron/survey-demo/backend/database"
)

type speakerForSurvey struct {
	SpeakerID int `json:"speakerID"`
	SurveyID  int `json:"surveyID"`
	QuestionID int `json:"questionID"`
}

// SpeakerStartSurvey creates a new Session, so Attendees and Join
// e.g. { speakerID: 1, surveyID: 2 }
func SpeakerStartSurvey(client *socket.Client, data interface{}) {
	var speakerStartedSurvey speakerForSurvey
	if err := mapstructure.Decode(data, &speakerStartedSurvey); err != nil {
		log.Printf("### SpeakerStartSurvey Unable to Decode: %v\n", err)
		return
	}
	// Create a Session based on SurveyID with no Attendees in it
	sessions.create(speakerStartedSurvey)
	log.Printf(">>> Speaker StartSurvey %#v\n", sessions)
	if questions, err := database.GetSurveyQuestions(client.Connection, speakerStartedSurvey.SurveyID); err == nil {
		log.Printf(">>> Sending Questions for this Survey")
		client.Send <- socket.Command{ Name: "SurveyQuestions", Data: questions }
	}
}

// SpeakerJumpQuestion A way to inform Attendees which Question should be displayed
func SpeakerJumpQuestion(client *socket.Client, data interface{}) {
	log.Printf(">>> SpeakerJumpQuestion: %v\n", data)
	var speakerForSurvey speakerForSurvey
	if err := mapstructure.Decode(data, &speakerForSurvey); err != nil {
		log.Printf("### SpeakerJumpQuestion Unable to Decode: %v\n", err)
		return
	}

	// Inform Everyone which question should be displayed
	client.Hub.Broadcast <- socket.Command{ Name: "SpeakerJumpQuestion", Data: speakerForSurvey }
}

// SpeakerFinishSurvey Speaker decided to finish the Survey
func SpeakerFinishSurvey(client *socket.Client, data interface{}) {
	var speakerForSurvey speakerForSurvey
	if err := mapstructure.Decode(data, &speakerForSurvey); err != nil {
		log.Printf("### SpeakerFinishSurvey Unable to Decode: %v\n", err)
		return 
	}

	// Inform Everyone this Survey is Finish 
	client.Hub.Broadcast <- socket.Command{ Name: "SpeakerFinishSurvey", Data: speakerForSurvey }
}
