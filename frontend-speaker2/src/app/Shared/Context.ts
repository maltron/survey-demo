import React from "react";
import { Speaker, Attendee } from "@app/Shared/Model";

export const SpeakerContext = React.createContext<Speaker>({ ID: 0, 
    username: "", password: "", email: ""});

export const AttendeeContext = React.createContext<Attendee>(
    { ID: 0, firstName: "", lastName: "", email: "", points: 0, survey: 0}
);