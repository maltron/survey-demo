package database

import (
	"fmt"
	"log"
	"database/sql"
	"github.com/maltron/survey-demo/backend/model"
)

// AttendeeExists Check if Attendee is already stored
func AttendeeExists(database *sql.DB, attendee *model.Attendee) (bool, error) {
	query := fmt.Sprintf("select ID from survey_attendee where surveyID = %d and email = '%v'", attendee.Survey, attendee.Email)
	rows, err := database.Query(query)
	defer rows.Close()
	if err != nil {
		log.Printf("### Database Query fail (Query: %v): %v\n", query, err)
		return false, err
	}

	var found bool = false
	for rows.Next() {
		// If this Attendee does exists, then update his ID
		if err := rows.Scan(&attendee.ID); err != nil {
			log.Fatalf("### AttendeeExists: Unable to perform Scan: %v\n", err)
		}
		found = true
	}

	return found, nil
}

// SaveAttendee Either insert or update depending if Attendee exists or not 
func SaveAttendee(database *sql.DB, attendee *model.Attendee) {
	found, err := AttendeeExists(database, attendee)
	if err != nil {
		log.Printf("### SaveAttendee Failed: %v\n", err)
		return 
	}

	// Update or Insert ?
	var query string
	if found {
		query = "update survey_attendee set firstName=?,lastName=?,email=? where ID = ?"
	} else {
		query = "insert into survey_attendee(firstName, lastName, email, surveyID) values(?, ?, ?, ?)"
	}

	statement, err := database.Prepare(query)
	defer statement.Close()
	if err != nil {
		log.Printf("### SaveAttendee: Unable to Store Attendee: %v\n", err)
		return 
	}

	if found {
		_, err := statement.Exec(attendee.FirstName, attendee.LastName, attendee.Email, attendee.ID)
		if err != nil {
			log.Printf("### SaveAttendee: Unable to <UPDATE>: %v\n", err)
		}
	} else {
		result, err := statement.Exec(attendee.FirstName, attendee.LastName, attendee.Email, attendee.Survey)
		if err != nil {
			log.Printf("### SaveAttendee: Unable to <INSERT>: %v\n", err)
		}
		// Update information regarding Attendee.ID
		if attendee.ID, err = result.LastInsertId(); err != nil {
			log.Printf("### SaveAttendee: Unable to Update attendee.ID: %v\n", err)
		}
	}

}
