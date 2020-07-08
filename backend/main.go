package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	log.Println("SURVEY DEMO: Starting at Port :8080")
	// Serving the Users
	router := mux.NewRouter()
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func handleUsers(w http.ResponseWriter, r *http.Request) {

}
