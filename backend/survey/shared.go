package survey 

import (
	"log"
	"github.com/maltron/survey-demo/backend/model"
)

// SurveySession represents a Map of [surveyID] = [Attendee, Atendee, ....]
type SurveySession map[int][]model.Attendee

// Key: SurveyID, Value: Array of Attendees
var sessions SurveySession = make(SurveySession)

func (sessions SurveySession) create(speaker speakerForSurvey) {
	sessions[speaker.SurveyID] = []model.Attendee{}
}

func (sessions SurveySession) exists(surveyID int) bool {
	_, found := sessions[surveyID]
	return found
}

func (sessions SurveySession) containsAttendee(registration attendeeRegistration) bool {
	for _, a := range sessions[registration.SurveyID] {
		if a.ID == registration.Attendee.ID {
			return true
		}
	}

	return false
}

func (sessions SurveySession) add(registration attendeeRegistration) bool {
	var successful bool = false 
	if sessions.exists(registration.SurveyID) {
		if !sessions.containsAttendee(registration) {
			sessions[registration.SurveyID] = append(sessions[registration.SurveyID], 
																registration.Attendee)
			successful = true 
		} 
	} else {
		log.Printf("### SurveySession.add: SurveyID: %d doesn't exist\n", registration.SurveyID)
	}
	return successful
}

func (sessions SurveySession) recordPoints(registration attendeeRegistration) {
	for i := 0; i < len(sessions[registration.SurveyID]); i++ {
		if sessions[registration.SurveyID][i].ID == registration.Attendee.ID {
			sessions[registration.SurveyID][i].Points = registration.Attendee.Points
			break
		}
	}
}