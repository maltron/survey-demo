import React, { ReactNode } from "react";
import { Attendee } from "@app/Shared/Model";

const initialAttendee = (): Attendee => {
    return { ID: 0, firstName: "", lastName: "", email: "", points: 0, survey: 0 }
}

interface AttendeeSessionInfo {
    session: Attendee;
    setSession: (attendee: Attendee) => void;
}

export const AttendeeSession = React.createContext<AttendeeSessionInfo>({} as AttendeeSessionInfo);

export const AttendeeSessionProvider: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
    const [ session, setSession ] = React.useState<Attendee>(initialAttendee);

    return (
        <AttendeeSession.Provider value={{ session, setSession }}>
            { children }
        </AttendeeSession.Provider>
    )
}
