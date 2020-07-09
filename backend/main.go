package main

import (
	"log"
	"net/http"
	"github.com/gorilla/mux"
	"github.com/maltron/survey-demo/backend/users"
)

func main() {
	log.Println("SURVEY DEMO: Starting at Port :8080")

	router := mux.NewRouter()
	router.HandleFunc("/user", users.GetUsers).Methods("GET")
	log.Fatal(http.ListenAndServe(":8080", router))
}
