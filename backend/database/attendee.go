package database

import (
	"fmt"
	"log"
	"database/sql"
	"github.com/maltron/survey-demo/backend/model"
)

// AttendeeExists Check if Attendee is already stored
func AttendeeExists(database *Connection, attendee *model.Attendee) (bool, error) {
	query := fmt.Sprintf("select ID from survey_attendee where surveyID = %d and email = '%v'", attendee.Survey, attendee.Email)
	rows, err := database.connection.Query(query)
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
func SaveAttendee(database *Connection, attendee *model.Attendee) ([]model.Attendee, bool, error) {
	found, err := AttendeeExists(database, attendee)
	if err != nil {
		log.Printf("### SaveAttendee Failed: %v\n", err)
		return []model.Attendee{}, false, err
	}

	// Update or Insert ?
	var query string
	if found {
		query = "update survey_attendee set firstName=?,lastName=?,email=? where ID = ?"
	} else {
		query = "insert into survey_attendee(firstName, lastName, email, surveyID) values(?, ?, ?, ?)"
	}

	statement, err := database.connection.Prepare(query)
	defer statement.Close()
	if err != nil {
		log.Printf("### SaveAttendee: Prepare Unable to Store Attendee: %v\n", err)
		return []model.Attendee{}, false, err
	}

	var result sql.Result
	if found {
		result, err = statement.Exec(attendee.FirstName, attendee.LastName, attendee.Email, attendee.ID)
		if err != nil {
			log.Printf("### SaveAttendee: Exec Unable to <UPDATE>: %v\n", err)
			return []model.Attendee{}, false, err
		}
	} else {
		result, err = statement.Exec(attendee.FirstName, attendee.LastName, attendee.Email, attendee.Survey)
		if err != nil {
			log.Printf("### SaveAttendee: Exec Unable to <INSERT>: %v\n", err)
			return []model.Attendee{}, false, err
		}
		// Update information regarding Attendee.ID
		if attendee.ID, err = result.LastInsertId(); err != nil {
			log.Printf("### SaveAttendee: LastInsertId() Unable to Update attendee.ID: %v\n", err)
			return []model.Attendee{}, false, err
		}
	}

	// Fetch number of rows affected
	rows, err := result.RowsAffected()
	if err != nil {
		log.Printf("### SaveAttendee: RowsAffected(): %v\n", err)
		return []model.Attendee{}, false, err
	}

	attendees, err := Attendees(database, attendee.Survey)
	if err != nil {
		return []model.Attendee{}, false, err
	}

	return attendees, rows > 0, nil
}

// RecordPoints save the score of this Attendee and returns a list
// of all attendees sorted by rank, to be used as a Ranking Dashboard
func RecordPoints(database *Connection, attendee model.Attendee) ([]model.Attendee, bool) {
	var query string = "update survey_attendee set points=? where ID = ?"
	statement, err := database.connection.Prepare(query)
	defer statement.Close()
	if err != nil {
		log.Printf("### RecordPoints Failed Prepare: %v\n", err)
		return []model.Attendee{}, false
	}

	result, err := statement.Exec(attendee.Points, attendee.ID)
	if err != nil {
		log.Printf("### RecordPoints Failed Exec: %v\n", err)
		return []model.Attendee{}, false
	}

	rows, err := result.RowsAffected()
	if err != nil {
		log.Printf("### RecordPoints Failed RowsAffected: %v\n", err)
		return []model.Attendee{}, false
	}

	attendees, err := Attendees(database, attendee.Survey)
	if err != nil {
		return []model.Attendee{}, false
	}

	return attendees, rows > 0
}

// Attendees Returns a list of all Attendees for a particular Survey
func Attendees(database *Connection, surveyID int) ([]model.Attendee, error) {
	query := fmt.Sprintf("select ID, firstname, lastname, email, points, surveyID from survey_attendee where surveyID = %d order by points desc", surveyID)
	rows, err := database.connection.Query(query)
	defer rows.Close()
	if err != nil {
		return []model.Attendee{}, err
	}

	var attendees []model.Attendee
	for rows.Next() {
		var attendee model.Attendee
		if err := rows.Scan(&attendee.ID, &attendee.FirstName, &attendee.LastName,
			&attendee.Email, &attendee.Points, &attendee.Survey); err != nil {
			return []model.Attendee{}, err
		}
		attendees = append(attendees, attendee)
	}

	return attendees, nil
}

// RecordAttendeeAnswered Stores the information of a particular Answer into the database
// for future retrival
func RecordAttendeeAnswered(database *Connection, answered *model.Answered) bool {
	query := fmt.Sprintf("select ID from survey_attendee_answered where surveyID = %d and attendeeID = %d and questionID = %d", answered.SurveyID, answered.AttendeeID, answered.QuestionID)
	rows, err := database.connection.Query(query)
	defer rows.Close()
	if err != nil {
		log.Printf("### RecordAttendeeAnswered (query: %v): %v\n", query, err)
		return false 
	}

	// Step 1/3: Check if this answer already exists 
	var found bool = false
	for rows.Next() {
		found = true
		if err := rows.Scan(&answered.ID); err != nil {
			log.Printf("### RecordAttendeeAnswered Scan: %v\n", err)
			return false
		}
	}

	// Step 2/3: If does exists, UPDATE it, else INSERT it
	var rowsAffected int64
	if found { // UPDATE 
		query = "update survey_attendee_answered set answerID=? where surveyID = ? and attendeeID = ? and questionID = ?"
	} else {
		query = "insert into survey_attendee_answered(answerID, surveyID, attendeeID, questionID) values(?, ?, ?, ?)"
	}
	statement, err := database.connection.Prepare(query)
	defer statement.Close()
	if err != nil {
		log.Printf("### RecordAttendeeAnswered Prepare: %v\n", err)
		return false 
	}

	result, err := statement.Exec(answered.AnswerID, answered.SurveyID, 
								answered.AttendeeID, answered.QuestionID)
	if err != nil {
		log.Printf("### RecordAttendeeAnswered Exec: %v\n", err)
		return false
	}

	// Step 3/3: Check the number of lines affected
	rowsAffected, err = result.RowsAffected()
	if err != nil {
		log.Printf("### RecordAttendeeAnswered RowsAffected()<UPDATE>: %v\n", err)	
		return false
	}

	return rowsAffected > 0
}
