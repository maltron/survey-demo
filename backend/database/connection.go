package database

import (	
	"fmt"
	"log"
	"database/sql"
	"github.com/maltron/survey-demo/backend/util"
)

// SingleRow Represents the minimum information needed in order to fetch a single 
// row in the database and map into a struct 
type SingleRow struct {
	query string 
	scan func(rows *sql.Rows) error

}

// Connection Represents information about a Database Connection
type Connection struct {
	connection *sql.DB
}

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

func databaseConnectionURL() string {
	username := util.DefaultValue(envDatabaseUser, defaultDatabaseUser)
	password := util.DefaultValue(envDatabasePassword, defaultDatabasePassword)
	host := util.DefaultValue(envDatabaseHost, defaultDatabaseHost)
	port := util.DefaultValue(envDatabasePort, defaultDatabasePort)
	databaseName := util.DefaultValue(envDatabase, defaultDatabase)

	return fmt.Sprintf("%v:%v@tcp(%v:%v)/%v?charset=utf8mb4",
		username, password, host, port, databaseName)
}

// NewConnection Returns a new instance of a Database Connection
func NewConnection() (*Connection, error) {
	// Starting to Connecting to the database
	connectionURL := databaseConnectionURL()
	log.Printf(">>> Connecting MySQL: %v\n", connectionURL)
	conn, err := sql.Open("mysql", connectionURL)
	if err != nil {
		log.Printf("### Database Error: %v\n", err)
		return &Connection{}, err
	}
	// Testing if we can perform queries
	err = conn.Ping()
	if err != nil {
		log.Printf("### Database Error. Unable to connect. Ping failure: %v\n", err)
		return &Connection{}, err
	}

	// // Creating basic tables
	// log.Println("Creating tables")
	// rows, err := database.Query("create table if not exists survey_user(ID int not null auto_increment, firstName varchar(50) not null, lastName varchar(50) not null, unique(firstName, lastName), primary key(ID)) default charset utf8mb4 collate utf8mb4_unicode_ci")
	// defer rows.Close()
	// if err != nil {
	// 	log.Fatal("Database Error. Unable to create basic tables")
	// 	panic(err.Error())
	// }

	log.Println("[ CONNECTED ]")
	return &Connection{ conn }, err
}


// SelectSingle Executes a specific query and if found, go over scan each column 
// and returns a boolean in case a line matches the query 
func (database Connection) SelectSingle(singleRow SingleRow) (bool, error) {
	rows, err := database.connection.Query(singleRow.query)
	defer rows.Close()
	if err != nil {
		return false, err
	}

	var found bool = false 
	for rows.Next() {
		found = true
		if err := singleRow.scan(rows); err != nil {
			return false, err
		}
	}

	return found, nil
}