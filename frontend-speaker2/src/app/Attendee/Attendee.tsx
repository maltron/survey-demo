import React from "react";
import { Page, PageSection
} from "@patternfly/react-core";
import { Attendee, Question, AttendeeStep } from "@app/Shared/Model";
import { useWebSocket, sendBackend, Command, Option 
} from "@app/Backend/SocketCommunication";
import { AttendeeQuestion } from "@app/Attendee/AttendeeShared";
import { Wait, Status, BigTitle } from "@app/Shared/Components";
import { AttendeeRegister } from "@app/Attendee/AttendeeRegister";

export const AttendeeSurvey: React.FunctionComponent<{ survey: number }> = ({ survey }) => {
    const [ connected, websocket ] = useWebSocket(); // WEBSOCKET 
    const [ errorMessage, setErrorMessage ] = React.useState<string>("");
    const [ step, setStep ] = React.useState<AttendeeStep>(AttendeeStep.started);
    const ready = React.useRef<boolean>(false); // Indicate the user is ready to engage

    const [ registration, setRegistration ] = React.useState<Attendee>({
        ID: 0, firstName: "", lastName: "", email: "", points: 0, survey: 0
    })
    // This reference is important due the nature of WebSockets, 
    // which it doesn't trigger the render process, hence it's 
    // impossible to get any state as a result of onmessage()
    const attendee = React.useRef<Attendee>({
        ID: 0, firstName: "", lastName: "", email: "", points:0, survey
    })
    const [ loadingQuestions, setLoadingQuestions ] = React.useState<boolean>(true);
    const questions = React.useRef<Array<Question>>([]);
    const [ questionsBefore, setQuestionsBefore ] = React.useState<Array<Question>>([]);
    const [ questionsFinish, setQuestionsFinish ] = React.useState<Array<Question>>([]);    
    const [ currentQuestion, setCurrentQuestion ] = React.useState<number>(0);

    React.useEffect(() => {
        // If an WebSocket communiction is established, setup a message callback
        console.log(">>> DriveQuestions useEffect(): ", connected);
        if(connected) {
          websocket.onmessage = backendMessage;
          // Tell backend to send all questions related to this survey
          sendBackend(websocket, { name: Option.AttendeeStarted, 
                data: { surveyID: survey }})
        }
    
    }, [connected]);

    // WEBSOCKET WEBSOCKET WEBSOCKET WEBSOCKET WEBSOCKET WEBSOCKET WEBSOCKET 
    //    WEBSOCKET WEBSOCKET WEBSOCKET WEBSOCKET WEBSOCKET WEBSOCKET WEBSOCKET 
    const backendMessage = (event: MessageEvent) => {
        var response: Command = JSON.parse(event.data);
        // console.log(`>>> backend Name: ${response.name} Data: ${event.data} currentQuestion: ${currentQuestion} Step: ${step}`);
        // Receving Questions 
        if(response.name === Option.SurveyQuestions) {
            questions.current = response.data;
            setLoadingQuestions(false);
        // Capture AttendeeRegistered in order fetch Attendee.ID
        } else if(response.name === Option.AttendeeRegistered) {
            // console.log(`>>> Option.AttendeeRegistered: ${response.data}`);
            console.log(response.data);
            // AttendeeRegistered Data: {"name":"AttendeeRegistered","data":{"surveyID":0,"attendee":{"id":16,"firstName":"a","lastName":"a","email":"a","points":0,"survey":1}}}
            const attendeeRegistered: Attendee = response.data.attendee;

            // We're getting notifications from every single Attendee
            // We need to update Attendee.ID and it's only true if
            // firstName, lastName and email matches
            if(attendee.current.firstName == attendeeRegistered.firstName &&
                attendee.current.lastName == attendeeRegistered.lastName &&
                    attendee.current.email == attendeeRegistered.email) {
                attendee.current.ID = parseInt(response.data.attendee.id);
            }

        // Finish this Survey
        } else if(response.name === Option.SpeakerFinishSurvey) {
            ready.current = false; // Attendee is no longer will engage in Questions
            setCurrentQuestion(0);
            setStep(AttendeeStep.finish);
        // Initiate main Questions 
        } else if(ready.current && response.name === Option.SpeakerJumpQuestion) {
            console.log(`>>> backendMessage: ${response.data.questionID} Questions Length: ${questions.current.length}`);
            setCurrentQuestion(questions.current.findIndex(
                question => question.ID == parseInt(response.data.questionID)));
            setStep(AttendeeStep.ready);
        }
    }

    React.useEffect(() => {
        // If we're reading loading questions, let's split into different 
        // variables to be easily handled
        if(!loadingQuestions) {
            console.log("React.useEffect loading. Loading Questions");
            setQuestionsBefore(questions.current.filter(question => question.kind == -1));
            setQuestionsFinish(questions.current.filter(question => question.kind == 1));
        }
    }, [loadingQuestions]);

    const handleStart = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        // Update SurveyID into the Registration
        setRegistration({ ...registration, survey });

        // The information of the existing Attendee is kept into attendee.current
        // This is needed due the nature of WebSockets which never triggers
        // the rendering phase
        attendee.current = registration; 

        sendBackend(websocket, { name: Option.AttendeeRegistration, 
            data: { surveyID: survey, attendee: registration }});
        setStep(AttendeeStep.before);
    }

    const handleBeforeFinishQuestion = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const { id } = event.currentTarget;
        console.log(`>>> handleBeforeFinishQuestion Answer ID: ${id} Current: ${currentQuestion} Length: ${questionsBefore.length}`);
        console.log(attendee.current);

        if(step == AttendeeStep.before) {
            // Record the answer 
            sendBackend(websocket, { name: Option.AttendeeAnswered, 
                data: { ID:0, surveyID: survey, 
                            attendeeID: attendee.current.ID,
                            questionID: questionsBefore[currentQuestion].ID, 
                                                    answerID: parseInt(id) }})
            if(currentQuestion < questionsBefore.length-1) {
                setCurrentQuestion(prevQuestion => prevQuestion+1);
            } else {
                // By the end of begin, jump to the next step
                setStep(AttendeeStep.getready);
                ready.current = true; // Attendee is Ready to accept Questions from Speaker
            }
        } else if(step == AttendeeStep.finish) {
            // Record the answer 
            sendBackend(websocket, { name: Option.AttendeeAnswered, 
                data: { ID:0, surveyID: survey, attendeeID: attendee.current.ID, 
                            questionID: questionsFinish[currentQuestion].ID, 
                                                    answerID: parseInt(id) }})
            if(currentQuestion < questionsFinish.length-1) {
                setCurrentQuestion(prevQuestion => prevQuestion+1);
            } else {
                // By the end of begin, jump to the next step
                setStep(AttendeeStep.end);
            }
        }
    }

    const handleReadyQuestion = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

    }

    const currentStep = (): JSX.Element => {
        console.log(`>>> currentStep: Step ${step} currentQuestion ${currentQuestion}`);
        switch(step) {
            // Flow 1/4: BEFORE
            case AttendeeStep.before: 
                return <AttendeeQuestion 
                    handleQuestion={handleBeforeFinishQuestion}
                    question={questionsBefore[currentQuestion]}/>
            // Flow 2/4: GET READY
            case AttendeeStep.getready:
                return <AttendeeGetReady/>            
            // Flow 3/4: READY
            case AttendeeStep.ready: 
                // From now on, select a question based on its Question.ID
                // const questionSelected: Question = questions.find(
                //         question => question.ID == attendeeState.currentQuestion) as Question;
                return <AttendeeQuestion handleQuestion={handleReadyQuestion}
                        question={questions.current[currentQuestion]}/>
            // // Flow 4/4: FINISH
            case AttendeeStep.finish: 
                return <AttendeeQuestion handleQuestion={handleBeforeFinishQuestion}
                        question={questionsFinish[currentQuestion]}/>
            // Flow 5/5: THE END
            case AttendeeStep.end:
                return <AttendeeEnd/>
        }

        return <AttendeeRegister user={{ registration, setRegistration }} 
                        handleStart={handleStart} errorMessage={errorMessage}/>
    }

    return (
        <React.Fragment>
            { loadingQuestions && (<Wait/>)}
            { !loadingQuestions && (<Page>{currentStep()}</Page>)}
        </React.Fragment>
    )
}

const AttendeeGetReady = () => {
    return (
        <React.Fragment>
            <Status message="Waiting on Speaker"/>
            <PageSection>
                <BigTitle message="Get Ready"/>
            </PageSection>
        </React.Fragment>
    )
}

const AttendeeEnd = () => {
    return (
        <React.Fragment>
            <Status message=" "/>
            <PageSection>
                <BigTitle message="Thank you"/>
            </PageSection>
        </React.Fragment>
    )
}