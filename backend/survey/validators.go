package survey 

import (
	"fmt"
	"log"
	"net/http"
)

// IsContentTypeJSON | Check if the type "Content-type: application/json"
//                     If not, return 406: Not Acceptable
func IsContentTypeJSON(w http.ResponseWriter, r *http.Request) bool {
	if r.Header.Get("Content-type") != "application/json" {
		ReportError(w, http.StatusNotAcceptable, 
			fmt.Sprintf("406 Not Acceptable: %v\n", r.Header.Get("Content-type")), nil)
		return false
	}
	return true
}

// ReportError | Returns a HTTP Response with an error
func ReportError(w http.ResponseWriter, httpStatusCode int, description string, err error) {
	w.WriteHeader(httpStatusCode)
	if err != nil {
		log.Printf("### %v: %v\n", description, err.Error())
	} else {
		log.Printf("### %v\n", description)
	}
}