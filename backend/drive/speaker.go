package drive 

import (
	"log"
	"github.com/maltron/survey-demo/backend/socket"
	"github.com/mitchellh/mapstructure"
)

// SpeakerStartSurvey creates a new Session, so Attendees and Join
// e.g. { speakerID: 1, surveyID: 2 }
func SpeakerStartSurvey(client *socket.Client, data interface{}) {
	var speakerStartedSurvey struct {
		SpeakerID int `json:"speakerID"`
		SurveyID int `json:"surveyID"`
	}
	if err := mapstructure.Decode(data, &speakerStartedSurvey); err != nil {
		log.Printf("### SpeakerStartSurvey Unable to Decode:%v\n", err)
		return
	}
	// Create a Session based on SurveyID with no Attendees in it
	sessions.create(speakerStartedSurvey.SurveyID)
	log.Printf(">>> Speaker StartSurvey %#v\n", sessions)
}