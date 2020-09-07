package database

// import (
// 	"fmt"
// 	"log"
// 	"database/sql"
// 	"github.com/maltron/survey-demo/backend/model"
// )

// func test() {
// 	var query string = fmt.Sprintf("select ID, firstName, lastName, email, points, surveyID from survey_attendee where ID = %d", 1)
// 	var attendee model.Attendee
// 	if err := Database.SelectSingle(SingleRow{query, func(row *sql.Row) error {
// 		return row.Scan()
// 	}}); err != nil {
// 		log.Printf("### test() FAILED: %v\n", err)
// 	}

// 	log.Printf(">>> Attendee: %v\n", attendee)
// }
