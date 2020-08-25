import React from "react";
import { backendURL } from "@app/Backend/Backend";

export enum Option {
    AttendeeRegister = "AttendeeRegister"
}

export interface Command {
    option: Option; 
    data: any; 
}

export const sendBackend = (webSocket: WebSocket, command: Command) => {
    webSocket.send(JSON.stringify(command));
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