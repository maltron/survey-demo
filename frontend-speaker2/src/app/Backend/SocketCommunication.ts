import React from "react";
import { backendURL } from "@app/Backend/Backend";

export enum Option {
    SpeakerStartSurvey = "SpeakerStartSurvey",
    SpeakerJumpQuestion = "SpeakerJumpQuestion",
    SurveyQuestions = "SurveyQuestions",
    Attendees = "Attendees",
    AttendeeStarted = "AttendeeStarted",
    AttendeeRegistration = "AttendeeRegistration"
}

export interface Command {
    name: Option; 
    data: any; 
}

export interface SpeakerForSurvey {
    speakerID: number;
    surveyID: number;
    questionID: number;
}

export const sendBackend = (webSocket: WebSocket, command: Command) => {
    if(webSocket.readyState === WebSocket.OPEN)
        webSocket.send(JSON.stringify(command));
    else console.log("### WARNING: WEB SOCKET NOT CONNECTED");
}

export const useWebSocket = (): [ boolean, WebSocket ] => {
    const [ connected, setConnected ] = React.useState<boolean>(false);
    const webSocket = React.useRef<WebSocket>();

    React.useEffect(() => {
        webSocket.current = new WebSocket(`ws://${backendURL()}/ws`);
        webSocket.current.onopen = (event: Event) => {
            console.log(`>>> useWebSocket React.useEffect() onopen() ${event}`);
            setConnected(true);
        }
        // webSocket.current.onmessage = onmessage;
        // webSocket.current.onmessage = (event: MessageEvent) => {
        //     console.log(`>>> onmessage(): ${event.data} ${event.lastEventId} ${event.origin} ${event.ports} ${event.source}`);
        // }      
        webSocket.current.onclose = (event: CloseEvent) => {
            console.log(`>>> useWebSocket React.useEffect() onclose() code: ${event.code} reason: ${event.reason} wasClean: ${event.wasClean}`);
            setConnected(false);
        }
        webSocket.current.onerror = (event: Event) => {
            console.log(`>>> useWebSocket React.useEffect() onerror() ${event}`);
        }
        
        return () => {
            console.log(">>> useWebSocket React.useEffect() Closing WebSocket");
            webSocket.current?.close();
        }
    }, []); 

    return [ connected, webSocket.current as WebSocket ];
}