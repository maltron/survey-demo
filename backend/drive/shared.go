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

func (sessions SurveySession) create(speaker speakerForSurvey) {
	sessions[speaker.SurveyID] = []Attendee{}
}

func (sessions SurveySession) exists(surveyID int) bool {
	_, found := sessions[surveyID]
	return found
}

func (sessions SurveySession) containsAttendee(registration attendeeRegistered) bool {
	for _, a := range sessions[registration.SurveyID] {
		if a.ID == registration.Attendee.ID {
			return true
		}
	}

	return false
}

func (sessions SurveySession) add(registration attendeeRegistered) bool {
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

func (sessions SurveySession) recordPoints(registration attendeeRegistered) {
	for i := 0; i < len(sessions[registration.SurveyID]); i++ {
		if sessions[registration.SurveyID][i].ID == registration.Attendee.ID {
			sessions[registration.SurveyID][i].Points = registration.Attendee.Points
			break
		}
	}
}