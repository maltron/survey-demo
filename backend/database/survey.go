package database

import (
	"fmt"
	"log"
	"github.com/maltron/survey-demo/backend/model"
)

// GetSurveyQuestions Returns a list of Questions for a specific Survey
func GetSurveyQuestions(database *Connection, surveyID int) ([]model.Question, error) {
	query := fmt.Sprintf("select question.ID as questionID, question.question, question.timer, question.points, answer.ID as answerID, answer.answer, answer.is_correct, qa.kind from survey survey join survey_has_questions sq on survey.ID = sq.surveyID join survey_question question on question.ID = sq.questionID join survey_question_has_answers qa on qa.questionID = question.ID join survey_answer answer on qa.answerID = answer.ID where survey.ID = %d order by qa.kind, question.ID", surveyID)
	rows, err := database.connection.Query(query)
	defer rows.Close()

	if err != nil {
		log.Printf("### (query %v): %v\n", query, err)
		return []model.Question{}, err
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
			log.Printf("### (Unable to Read from Database, Scan): %v\n", err)
			return []model.Question{}, err
		}

		result = append(result, row)
	}

	// Get Questions
	var questions = []model.Question{model.Question{ID: result[0].questionID,
		Question: result[0].question, Timer: result[0].timer,
		Points: result[0].points, Kind: result[0].kind}}
	var currentQuestionID int = result[0].questionID
	for _, row := range result {
		if row.questionID != currentQuestionID {
			currentQuestionID = row.questionID
			questions = append(questions, model.Question{ID: row.questionID,
				Question: row.question, Timer: row.timer, Points: row.points, Kind: row.kind})
		}
	}

	// Get Answers for each particular Question
	for i := 0; i < len(questions); i++ {
		for j := 0; j < len(result); j++ {
			if questions[i].ID == result[j].questionID {
				questions[i].Answers = append(questions[i].Answers, 
					model.Answer{ID: result[j].answerID,
					Answer: result[j].answer, IsCorrect: result[j].isCorrect})
			}
		}
	}

	return questions, nil
}
