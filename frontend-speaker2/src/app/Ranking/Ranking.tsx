import React from "react";
import { Page, PageSection
} from "@patternfly/react-core";
import { Table, TableHeader, TableBody } from "@patternfly/react-table";
import { Attendee, turnAttendeeIntoRows } from "@app/Shared/Model";
import { Command, useWebSocket, Option, sendWebSocket } from "@app/Backend/SocketCommunication";

interface RankingState {
    attendees: Array<Attendee>;
}

export const Ranking: React.FunctionComponent<{ survey: number }> = ({ survey }) => {
    const [ websocketConnected, websocket ] = useWebSocket();
    const [ state, setState ] = React.useState<RankingState>({
        attendees: [ {ID:0, firstName: "", lastName: "", email: "", points: 0, survey } ]
    });

    React.useEffect(() => {
        if(websocketConnected) {
            // Register where we're getting our messages directly from Server
            websocket.onmessage = websocketMessage; 

            // First time, fetch if there are any Attendees Registered
            sendWebSocket(websocket, { name: Option.AttendeesForSurvey,
                data: { surveyID: survey }});        
        }

    }, [websocketConnected]);

    // WEBSOCKET WEBSOCKET WEBSOCKET WEBSOCKET WEBSOCKET WEBSOCKET WEBSOCKET WEBSOCKET WEBSOCKET 
    //   WEBSOCKET WEBSOCKET WEBSOCKET WEBSOCKET WEBSOCKET WEBSOCKET WEBSOCKET WEBSOCKET WEBSOCKET 
    const websocketMessage = (event: MessageEvent) => {
        var response: Command = JSON.parse(event.data);
       console.log(`>>> WEBSOCKET Message Name: ${response.name} Data: ${event.data}`);
        // Refuse anything not related to this Survey 
        if(survey != parseInt(response.data.surveyID)) return;

        if(response.name === Option.AttendeeRegistered || 
            response.name === Option.AttendeeScored) {
            setState({ ...state, attendees: response.data.attendees as Array<Attendee>});
        }
    }

    return(
        <Page>
            <PageSection>
                <Table aria-label="Ranking" 
                    cells={[{ title: 'Rank' }, { title: 'Points' }, { title: 'First Name' }, { title: 'Second Name' }]} 
                    rows={turnAttendeeIntoRows(state.attendees)}>
                    <TableHeader/>
                    <TableBody/>
                </Table>
            </PageSection>
        </Page>
    )
}