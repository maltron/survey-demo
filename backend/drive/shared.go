package drive 

import (
	"log"
)

// Attendee Represents information about a single Attendee
type Attendee struct {
	ID int `json:"id"`
	FirstName string `json:"firstName"`
	LastName string `json:"lastName"`
	Email string `json:"email"`
	Points int `json:"points"`
}

// SurveySession represents a Map of [surveyID] = [Attendee, Atendee, ....]
type SurveySession map[int][]Attendee

// Key: SurveyID, Value: Array of Attendees
var sessions SurveySession = make(SurveySession)

func (sessions SurveySession) create(surveyID int) {
	sessions[surveyID] = []Attendee{}
}

func (sessions SurveySession) exists(surveyID int) bool {
	_, found := sessions[surveyID]
	return found
}

func (sessions SurveySession) contains(surveyID int, attendee Attendee) bool {
	for _, a := range sessions[surveyID] {
		if a.ID == attendee.ID {
			return true
		}
	}
	return false
}

func (sessions SurveySession) add(surveyID int, attendee Attendee) bool {
	var successfull bool = false 
	if sessions.exists(surveyID) {
		if !sessions.contains(surveyID, attendee) {
			sessions[surveyID] = append(sessions[surveyID], attendee)
			successfull = true 
		}
	} else {
		log.Printf("### SurveySession.add: SurveyID: %d doesn't exist\n", surveyID)
	}
	return successfull
}