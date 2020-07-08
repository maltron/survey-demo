package users

import (
	"log"
	"io/ioutil"
	"net/http"
	"encoding/json"
)

type User struct {
	FirstName string `json:"firstName`
	LastName string `json:"lastName`
}

func (user *User) setJSON(w http.ResponseWriter, r *http.Request) {
	request, error := ioutil.ReadAll(r.Body)
	if error != nil {
		log.Print(error)
	}
	json.Unmarshal(request, user)
}

func (user User) getJSON() ([]byte, error) {
	return json.MarshalIndent(user, "", "")
}