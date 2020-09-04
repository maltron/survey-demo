package model

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"github.com/gorilla/mux"
)

// Answer for a Given Question
type Answer struct {
	ID        int    `json:"ID"`
	Answer    string `json:"answer"`
	IsCorrect bool   `json:"isCorrect"`
}

// Question | Information about a particular Survey (usually, mapped to a database table)
type Question struct {
	ID       int      `json:"ID"`
	Question string   `json:"question"`
	Timer    int      `json:"timer"`
	Points   int      `json:"points"`
	Answers  []Answer `json:"answers"`
	Kind     int      `json:"kind"`
}

// Answered Answer given by the Attendee
type Answered struct {
	ID         int `json:"ID"`
	SurveyID   int `json:"survey"`
	AttendeeID int `json:"attendee"`
	QuestionID int `json:"question"`
	AnswerID   int `json:"answer"`
}

func (answered *Answered) decodeJSON(r *http.Request) error {
	return json.NewDecoder(r.Body).Decode(answered)
}

func (answered Answered) encodeJSON(w http.ResponseWriter) {
	json.NewEncoder(w).Encode(answered)
}

// // Encoder for SurveySpeaker
// func (question Question) encodeJSON(w http.ResponseWriter) error {
// 	w.WriteHeader(http.StatusOK)
// 	w.Header().Set("Accept", "application/json")

// 	json, err := json.Marshal(surveySpeaker)
// 	if err != nil {
// 		return err
// 	}
// 	w.Write(json)
// 	return nil
// }

// // SurveySpeaker Information for the Speaker to manage questions delivered to Attendees
// type SurveySpeaker struct {
// 	NumberOfQuestions int `json:"numberOfquestions"`
// 	Previous Question `json:"previous"`;
// 	Current Question `json:"current"`;
// 	Next Question `json:"next"`;
// }

// // MarshalJSON Manually encode the JSON to optimize amount of data transfered
// func (surveySpeaker SurveySpeaker) MarshalJSON() ([]byte, error) {
// 	buffer := bytes.NewBufferString("{")

// 	if surveySpeaker.NumberOfQuestions > 0 {
// 		buffer.WriteString(fmt.Sprintf("\"numberOfquestions\":\"%d\",",surveySpeaker.NumberOfQuestions))
// 	}
// 	if surveySpeaker.Previous.ID > 0 {
// 		previous, _ := json.Marshal(surveySpeaker.Previous)
// 		buffer.WriteString("\"previous\":")
// 		buffer.Write(previous)
// 		buffer.WriteString(",")
// 	}
// 	if surveySpeaker.Current.ID > 0 {
// 		current, _ := json.Marshal(surveySpeaker.Current)
// 		buffer.WriteString("\"current\":")
// 		buffer.Write(current)
// 	}
// 	if surveySpeaker.Next.ID > 0 {
// 		buffer.WriteString(",")
// 		next, _ := json.Marshal(surveySpeaker.Next)
// 		buffer.WriteString("\"next\":")
// 		buffer.Write(next)
// 	}

// 	buffer.WriteString("}")
// 	return buffer.Bytes(), nil
// }

// // Encoder for SurveySpeaker
// func (surveySpeaker SurveySpeaker) encodeJSON(w http.ResponseWriter) error {
// 	w.WriteHeader(http.StatusOK)
// 	w.Header().Set("Accept", "application/json")
// 	json, err := json.Marshal(surveySpeaker)
// 	if err != nil {
// 		return err
// 	}
// 	w.Write(json)
// 	return nil
// }

// // Fetch the amount of Questions available
// func (surveySpeaker *SurveySpeaker) fetchAmountQuestions(w http.ResponseWriter, surveyID int) {
// 	query := fmt.Sprintf("select count(question.question) as number_of_questions from survey survey join survey_has_questions sq on sq.surveyID = survey.ID join survey_question question on sq.questionID = question.ID where survey.ID = %d", surveyID)
// 	rows, err := Database.Query(query)
// 	defer rows.Close()
// 	if err != nil {
// 		// Error: 500 - Internal Server Error
// 		// PENDING: It seems there is no way to return 500 in case
// 		//          of something happened to the query
// 		reportErrorInternalServerError(w, fmt.Sprintf("(query %v)", query), err)
// 		return
// 	}

// 	for rows.Next() {
// 		err := rows.Scan(&surveySpeaker.NumberOfQuestions)
// 		if err != nil {
// 			reportErrorInternalServerError(w, "(Unable to Read from Datatabase, Scan)", err)
// 			panic(err.Error())
// 		}
// 	}
// }

// // Fetch a Question
// func (question *Question) fetchQuestion(w http.ResponseWriter, surveyID int, questionID int) {
// 	query := fmt.Sprintf("select ID, question, timer, points from survey_question question join survey_has_questions sq on question.ID = sq.questionID where sq.surveyID = %d and question.ID = %d", surveyID, questionID)
// 	rows, err := Database.Query(query)
// 	defer rows.Close()
// 	if err != nil {
// 		reportErrorInternalServerError(w, fmt.Sprintf("(query %v)", query), err)
// 		return
// 	}

// 	for rows.Next() {
// 		err := rows.Scan(&question.ID, &question.Question, &question.Timer, &question.Points)
// 		if err != nil {
// 			reportErrorInternalServerError(w, "(Unable to Read from Datatabase, Scan)", err)
// 			panic(err.Error())
// 		}
// 	}
// }

// // Fetch all Answers for this Question
// func (question *Question) fetchAnswers(w http.ResponseWriter, surveyID int, questionID int) {
// 	query := fmt.Sprintf("select answer.ID as ID, answer.answer as answer, answer.is_correct as isCorrect from survey_answer answer join survey_question_has_answers qa on answer.ID = qa.answerID join survey_has_questions sq on sq.questionID = qa.questionID where sq.surveyID = %d and sq.questionID = %d", surveyID, questionID)
// 	rows, err := Database.Query(query)
// 	defer rows.Close()
// 	if err != nil {
// 		reportErrorInternalServerError(w, fmt.Sprintf("(query %v)", query), err)
// 		return
// 	}

// 	var answers[] Answer
// 	for rows.Next() {
// 		var answer Answer
// 		err := rows.Scan(&answer.ID, &answer.Answer, &answer.IsCorrect)
// 		if err != nil {
// 			reportErrorInternalServerError(w, "(Unable to Read from Datatabase, Scan)", err)
// 			panic(err.Error())
// 		}

// 		answers = append(answers, answer)
// 	}

// 	question.Answers = answers
// }

// GetSurveyQuestions Returns a list of Questions for a specific Survey
func GetSurveyQuestions(w http.ResponseWriter, r *http.Request) {
	// If Content-type is not "application/json",
	// return 406 - Not Acceptable
	if !isContentTypeJSON(w, r) {
		return
	}

	surveyID, ok := mux.Vars(r)["surveyID"]
	if !ok {
		reportErrorInternalServerError(w, "(Unable to fetch surveyID from URL)", nil)
		return
	}

	survey, err := strconv.Atoi(surveyID)
	if err != nil {
		reportErrorInternalServerError(w, "(surveyID is not an Int)", err)
		return
	}

	query := fmt.Sprintf("select question.ID as questionID, question.question, question.timer, question.points, answer.ID as answerID, answer.answer, answer.is_correct, qa.kind from survey survey join survey_has_questions sq on survey.ID = sq.surveyID join survey_question question on question.ID = sq.questionID join survey_question_has_answers qa on qa.questionID = question.ID join survey_answer answer on qa.answerID = answer.ID where survey.ID = %d order by qa.kind, question.ID", survey)
	rows, err := Database.Query(query)
	defer rows.Close()
	if err != nil {
		reportErrorInternalServerError(w, fmt.Sprintf("(query %v)", query), err)
		return
	}

	// Create a temporary structure instead of handling directly from the database
	var result []struct {
		questionID int
		question   string
		timer      int
		points     int
		answerID   int
		answer     string
		isCorrect  bool
		kind       int
	}
	for rows.Next() {
		var row struct {
			questionID int
			question   string
			timer      int
			points     int
			answerID   int
			answer     string
			isCorrect  bool
			kind       int
		}
		err := rows.Scan(&row.questionID, &row.question, &row.timer, &row.points,
			&row.answerID, &row.answer, &row.isCorrect, &row.kind)
		if err != nil {
			reportErrorInternalServerError(w, "(Unable to Read from Datatabase, Scan)", err)
			panic(err.Error())
		}

		result = append(result, row)
	}

	// Get Questions
	var questions = []Question{Question{ID: result[0].questionID,
		Question: result[0].question, Timer: result[0].timer,
		Points: result[0].points, Kind: result[0].kind}}
	var currentQuestionID int = result[0].questionID
	for _, row := range result {
		if row.questionID != currentQuestionID {
			currentQuestionID = row.questionID
			questions = append(questions, Question{ID: row.questionID,
				Question: row.question, Timer: row.timer, Points: row.points, Kind: row.kind})
		}
	}

	// Get Answers for each particular Question
	for i := 0; i < len(questions); i++ {
		for j := 0; j < len(result); j++ {
			if questions[i].ID == result[j].questionID {
				questions[i].Answers = append(questions[i].Answers, Answer{ID: result[j].answerID,
					Answer: result[j].answer, IsCorrect: result[j].isCorrect})
			}
		}
	}

	// Finally, return the whole thing as JSON
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Accept", "application/json")
	json.NewEncoder(w).Encode(questions)
}

// PostAttendeeAnswer Get Attendee's Answer
func PostAttendeeAnswer(w http.ResponseWriter, r *http.Request) {
	// If Content-type is not "application/json",
	// return 406 - Not Acceptable
	if !isContentTypeJSON(w, r) {
		return
	}

	var answered Answered
	if err := answered.decodeJSON(r); err != nil {
		reportErrorInternalServerError(w, "(Unable to Decode JSON Answered)", err)
		return
	}

	// Step #1: Check if the answer already exists
	query := fmt.Sprintf("select count(*) from survey_attendee_answers where surveyID = %d and attendeeID = %d and questionID = %d", answered.SurveyID, answered.AttendeeID, answered.QuestionID)
	row, err := Database.Query(query)
	if err != nil {
		reportErrorInternalServerError(w, fmt.Sprintf("(query %v)", query), err)
		return
	}

	// Read the number of colums found
	var count int
	for row.Next() {
		if err := row.Scan(&count); err != nil {
			reportErrorInternalServerError(w, "(Unable to Read from Datatabase, Scan)", err)
			panic(err.Error())
		}
	}

	// Depending on previous answer, either insert or update
	if count > 0 {
		query = fmt.Sprintf("update survey_attendee_answers set answerID=%d where surveyID = %d and attendeeID = %d and questionID = %d", answered.AnswerID, answered.SurveyID, answered.AttendeeID, answered.QuestionID)
	} else {
		query = fmt.Sprintf("insert into survey_attendee_answers(surveyID, attendeeID, answerID, questionID) values(%d,%d,%d,%d)", answered.SurveyID, answered.AttendeeID, answered.AnswerID, answered.QuestionID)
	}
	if _, err = Database.Query(query); err != nil {
		reportErrorInternalServerError(w, "(Unable to Read from Datatabase, Scan)", err)
		panic(err.Error())
	}

	w.WriteHeader(http.StatusAccepted)
	answered.encodeJSON(w)
}
