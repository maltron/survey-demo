import React from "react";
import { Survey, Attendee, AttendeeRank, Answer, Question } from "@app/Shared/Model";
import { backendURL } from "@app/Backend/Backend";

// List of all existing Surveys
export const useAPISurveys = (): [ boolean, Array<Survey> ] => {
    const [ surveys, setSurveys ] = React.useState<Array<Survey>>([]);
    const [ loading, setLoading ] = React.useState<boolean>(true);

    React.useEffect(() => {
        fetch(`http://${backendURL()}/survey`, {
            method: "GET", headers: { "Content-type": "application/json" }
        }).then(response => response.json())
        .then(data => {
            setSurveys(data); setLoading(false);
        });
    }, []);

    return [ loading, surveys ]
}

// List of all existing Attendees
export const useAPIAttendees = (): [ boolean,  Array<Attendee> ] => {
    const [ attendees, setAttendees ] = React.useState<Array<Attendee>>([]);
    const [ loading, setLoading ] = React.useState<boolean>(true);

    React.useEffect(() => {
        fetch(`http://${backendURL()}/user`, {
            method: "GET", headers: { "Content-type": "application/json" }
        }).then(response => response.json())
        .then(data => {
            setAttendees(data); setLoading(false);
        })
    }, []);

    return [ loading, attendees ];
}

export const useAPIRank = (surveyID: number): [ boolean, Array<AttendeeRank> ] => {
    const [ rank, setRank ] = React.useState<Array<AttendeeRank>>([]);
    const [ loading, setLoading ] = React.useState<boolean>(true);

    React.useEffect(() => {
        fetch(`http://${backendURL()}/attendee/ranks/${surveyID}`, {
            method: "GET", headers: { "Content-type" : "application/json" }
        }).then(response => response.json())
        .then(data => {
            setRank(data); setLoading(false);
        })
    }, []);

    return [ loading, rank ];
}

export const useAPIQuestions = (surveyID: number): [ boolean, Array<Question> ] => {
    const [ questions, setQuestions ] = React.useState<Array<Question>>([]);
    const [ loading, setLoading ] = React.useState<boolean>(true);

    React.useEffect(() => {
        fetch(`http://${backendURL()}/survey/questions/${surveyID}`, {
            method: "GET", headers: { "Content-type" : "application/json" }
        }).then(response => response.json()) 
        .then(data =>  {
            setQuestions(data); setLoading(false);
        })
    }, []);

    return [ loading, questions ];
}