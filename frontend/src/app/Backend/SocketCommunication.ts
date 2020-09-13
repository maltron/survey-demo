import React from "react";
import { surveyServer } from "@app/Backend/Backend";

export enum Option {
    SpeakerStartSurvey = "SpeakerStartSurvey",
    SpeakerJumpQuestion = "SpeakerJumpQuestion",
    SurveyQuestions = "SurveyQuestions",
    SpeakerFinishSurvey = "SpeakerFinishSurvey",
    AttendeeStarted = "AttendeeStarted",
    AttendeeRegistration = "AttendeeRegistration",
    AttendeeRegistered = "AttendeeRegistered",
    AttendeeAnswered = "AttendeeAnswered",
    AttendeeScored = "AttendeeScored",
    AttendeesForSurvey = "AttendeesForSurvey"
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

export const sendWebSocket = (webSocket: WebSocket, command: Command) => {
    if(webSocket.readyState === WebSocket.OPEN)
        webSocket.send(JSON.stringify(command));
    else console.log("### WARNING: WEB SOCKET NOT CONNECTED");
}

export const useWebSocket = (): [ boolean, WebSocket ] => {
    const [ connected, setConnected ] = React.useState<boolean>(false);
    const webSocket = React.useRef<WebSocket>();

    React.useEffect(() => {
        webSocket.current = new WebSocket(`ws://${surveyServer()}/ws`);
        webSocket.current.onopen = (event: Event) => {
            console.log(">>> WEBSOCKET ----> ON OPEN ON OPEN ON OPEN ON OPEN ON OPEN ON OPEN ON OPEN");
            console.log(`>>> useWebSocket React.useEffect() onopen() ${event}`);
            setConnected(true);
        }
        // webSocket.current.onmessage = onmessage;
        // webSocket.current.onmessage = (event: MessageEvent) => {
        //     console.log(`>>> onmessage(): ${event.data} ${event.lastEventId} ${event.origin} ${event.ports} ${event.source}`);
        // }      
        webSocket.current.onclose = (event: CloseEvent) => {
            console.log(">>> WEBSOCKET ----> ON CLOSE ON CLOSE ON CLOSE ON CLOSE ON CLOSE ON CLOSE ");
            console.log(`>>> useWebSocket React.useEffect() onclose() code: ${event.code} reason: ${event.reason} wasClean: ${event.wasClean}`);
            setConnected(false);
        }
        webSocket.current.onerror = (event: Event) => {
            console.log(">>> WEBSOCKET ----> ON ERROR ON ERROR ON ERROR ON ERROR ON ERROR ON ERROR");
            console.log(`>>> useWebSocket React.useEffect() onerror() ${event}`);
        }
        
        return () => {
            console.log(">>> WEBSOCKET ----> CLOSING CLOSING CLOSING CLOSING CLOSING CLOSING CLOSING ");           
            console.log(">>> useWebSocket React.useEffect() Closing WebSocket");
            webSocket.current?.close();
        }
    }, []); 

    return [ connected, webSocket.current as WebSocket ];
}