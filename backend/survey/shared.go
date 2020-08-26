package survey

import (
	"fmt"
	"log"
	"net/http"
	"database/sql"
)

// Connection to the database
var Database *sql.DB

func isContentTypeJSON(w http.ResponseWriter, r *http.Request) bool {
	if r.Header.Get("Content-type") != "application/json" {
		reportError(w, http.StatusNotAcceptable, 
			fmt.Sprintf("406 Not Acceptable: %v\n", r.Header.Get("Content-type")), nil)
		return false
	}
	return true
}

func reportError(w http.ResponseWriter, httpStatusCode int, description string, err error) {
	w.WriteHeader(httpStatusCode)
	if err != nil {
		log.Printf("### %v: %v\n", description, err.Error())
	} else {
		log.Printf("### %v\n", description)
	}
}

func reportErrorInternalServerError(w http.ResponseWriter, description string, err error) {
	reportError(w, http.StatusInternalServerError, fmt.Sprintf("500 Internal Server Error %v", description), err)
}

// func Cors(w http.ResponseWriter, r *http.Request) {
// 	log.Println("OPTIONS")
// 	for name, value := range r.Header {
// 		log.Printf("Header %v:%v\n", name, value)
// 	}
// 	w.Header().Set("Access-Control-Allow-Origin", "*")
// 	w.Header().Set("Access-Control-Allow-Headers", "*")
// 	w.Header().Set("Access-Control-Allow-Methods", "*")
// 	return 
// }