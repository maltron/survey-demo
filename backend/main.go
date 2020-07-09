package main

import (
	"log"
	"net/http"
	"github.com/gorilla/mux"
	"github.com/maltron/survey-demo/backend/users"
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
)

var (
	database *DB
	databaseError error 
)

func main() {
	log.Println("SURVEY DEMO: Starting at Port :8080")

	// Connecting to the database 
	database, databaseError = sql.Open("mysql", "mauricio:maltron@tcp(127.0.0.1:3306)/survey")
	if databaseError != nil {
		panic(databaseError.Error())
	}
	defer database.Close()

	router := mux.NewRouter()
	router.HandleFunc("/user", users.GetUsers).Methods("GET")
	log.Fatal(http.ListenAndServe(":8080", router))
}
