import React from "react";
import { Survey, User } from "@app/Shared/Model";

// Fetch the Backend's Endpoint URL to use everywhere
export const server = (): string => {
    return process.env.BACKEND_API ? process.env.BACKEND_API : "http://localhost:8080";
}

// List of all existing Surveys
export const useAPISurveys = (): [ boolean, Array<Survey> ] => {
    const [ surveys, setSurveys ] = React.useState<Array<Survey>>([]);
    const [ loading, setLoading ] = React.useState<boolean>(true);

    React.useEffect(() => {
        fetch(`${server()}/survey`, {
            method: "GET", headers: { "Content-type": "application/json" }
        }).then(response => response.json())
        .then(data => {
            setSurveys(data); setLoading(false);
        });
    }, []);

    return [ loading, surveys ]
}

// List of all existing Users
export const useAPIUsers = (): [ boolean,  Array<User> ] => {
    const [ users, setUsers ] = React.useState<Array<User>>([]);
    const [ loading, setLoading ] = React.useState<boolean>(true);

    React.useEffect(() => {
        fetch(`${server()}/user`, {
            method: "GET", headers: { "Content-type": "application/json" }
        }).then(response => response.json())
        .then(data => {
            setUsers(data); setLoading(false);
        })
    }, []);

    return [ loading, users ];
}