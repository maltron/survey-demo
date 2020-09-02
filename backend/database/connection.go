package database

import (
	"fmt"
	"log"
	"database/sql"
	"github.com/maltron/survey-demo/backend/util"
)

const (
	defaultDatabaseUser     string = "mauricio"
	defaultDatabasePassword string = "maltron"
	defaultDatabaseHost     string = "127.0.0.1"
	defaultDatabasePort     string = "3306"
	defaultDatabase         string = "survey"

	envDatabaseUser     string = "SURVEY_DATABASE_USER"
	envDatabasePassword string = "SURVEY_DATABASE_PASSWORD"
	envDatabaseHost     string = "SURVEY_DATABASE_HOST"
	envDatabasePort     string = "SURVEY_DATABASE_PORT"
	envDatabase         string = "SURVEY_DATABASE"
)

// Connection Return a instance of a Database Connection to be used
func Connection() *sql.DB {
	// Starting to Connecting to the database
	connectionURL := databaseConnection()
	log.Printf(">>> Connecting MySQL: %v\n", connectionURL)
	database, err := sql.Open("mysql", connectionURL)
	if err != nil {
		log.Fatal("Database Error.")
		panic(err.Error())
	}
	// Testing if we can perform queries
	err = database.Ping()
	if err != nil {
		log.Fatal("Database Error. Unable to connect. Ping failure")
		panic(err.Error())
	}

	// // Creating basic tables
	// log.Println("Creating tables")
	// rows, err := database.Query("create table if not exists survey_user(ID int not null auto_increment, firstName varchar(50) not null, lastName varchar(50) not null, unique(firstName, lastName), primary key(ID)) default charset utf8mb4 collate utf8mb4_unicode_ci")
	// defer rows.Close()
	// if err != nil {
	// 	log.Fatal("Database Error. Unable to create basic tables")
	// 	panic(err.Error())
	// }

	log.Printf(">>> Connected MySQL: %v\n", connectionURL)
	return database
}

func databaseConnection() string {
	username := util.DefaultValue(envDatabaseUser, defaultDatabaseUser)
	password := util.DefaultValue(envDatabasePassword, defaultDatabasePassword)
	host := util.DefaultValue(envDatabaseHost, defaultDatabaseHost)
	port := util.DefaultValue(envDatabasePort, defaultDatabasePort)
	databaseName := util.DefaultValue(envDatabase, defaultDatabase)

	return fmt.Sprintf("%v:%v@tcp(%v:%v)/%v?charset=utf8mb4",
		username, password, host, port, databaseName)
}
