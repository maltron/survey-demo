import React from "react";
import { Page, PageSection, PageSectionVariants, 
    TextContent, Text, TextInput, TextInputTypes, TextVariants,
    Button, ButtonVariant, 
    Form, FormGroup, ActionGroup
} from "@patternfly/react-core";
import { Attendee, Question, Answer, questionJSON, answeredJSON } from "@app/Shared/Model";
import { backendURL } from "@app/Backend/Backend";
import { Command, Option, useWebSocket, sendBackend } from "@app/Backend/SocketCommunication";
import { useAPIQuestions } from "@app/Backend/APIReqquest";
import { AttendeeDuring } from "@app/Attendee/AttendeeDuring";
import { AttendeeEnd } from "@app/Attendee/AttendeeEnd";
import { AttendeeQuestion } from "@app/Attendee/AttendeeShared";
import { Wait, Status, BigTitle } from "@app/Shared/Components";

enum AttendeeStep {
    login, // Attendee will subscribe to a particular Survey
    before, // Attendee will answer initial questions
    getready, // Wait for Speaker to Begin on the first question
    during, // Attendee will engage of presentation
    end  // Attendee will answer final questions
}

interface AttendeeProps {
    survey: number; 
}

export const AttendeeSurvey: React.FunctionComponent<AttendeeProps> = ({ survey }) => {
    const [ errorMessage, setErrorMessage ] = React.useState<string>("");
    const [ step, setStep ] = React.useState<AttendeeStep>(AttendeeStep.login);
    const [ attendee, setAttendee ] = React.useState<Attendee>({
        ID: 0, firstName: "", lastName: "", email: "", survey
    })
    const [ currentQuestion, setCurrentQuestion ] = React.useState<number>(0);
    const [ questionsBefore, setQuestionsBefore ] = React.useState<Array<Question>>([]);
    const [ questionsAfter, setQuestionsAfter ] = React.useState<Array<Question>>([]);
    const [ loading, questions ] = useAPIQuestions(survey);

    const [ connected, websocket ] = useWebSocket();

    React.useEffect(() => {
        // If an WebSocket communiction is established, setup a message callback
        console.log(">>> DriveQuestions useEffect()");
        if(connected) {
          console.log(">>> DriveQuestions useEffect() connected");
          websocket.onmessage = backendMessage;
          // websocket.send(JSON.stringify({ survey: survey, action: "START" }));
        }
    
    }, [connected]);

    const backendMessage = (event: MessageEvent) => {
        console.log(`>>> backendMessage(): ${event.data} ${event.lastEventId} ${event.origin} ${event.ports} ${event.source}`);
    }

    React.useEffect(() => {
        // If we're reading loading questions, let's split into different 
        // variables to be easily handled
        if(!loading) {
            console.log("React.useEffect loading. Loading Questions");
            setQuestionsBefore(questions.filter(question => question.kind == -1));
            setQuestionsAfter(questions.filter(question => question.kind == 1));
        }
    }, [loading]);

    const handleStart = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        fetch(`http://${backendURL()}/attendee`, {
            method: "PUT", headers: { "Content-type": "application/json" },
            body: JSON.stringify(attendee)
        }).then(response => {
            if(response.status == 201) {
                response.json().then(data => {
                    setErrorMessage("");
                    setAttendee(data);
                    const { ID } = data; 
                    sendBackend(websocket, 
                        { option: Option.AttendeeRegister, data: { surveyID: survey, attendeeID: ID } });
                    setStep(AttendeeStep.before);
                });
            } else {
                setErrorMessage("Server Error");
            }
        });
    }

    const handleBeforeQuestion = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const { id } = event.currentTarget;
        console.log(`Answer ID: ${id} Current: ${currentQuestion} Length: ${questionsBefore.length}`);
        // Record the answer 
        fetch(`http://${backendURL()}/survey/answer`, 
        { method: "POST", headers: {"Content-type":"application/json"},
            body: answeredJSON(survey, attendee.ID, questionsBefore[currentQuestion], parseInt(id))})

        if(currentQuestion < questionsBefore.length-1) {
            setCurrentQuestion(prevQuestion => prevQuestion+1);
        } else {
            // By the end of begin, jump to the next step
            setStep(AttendeeStep.getready);
        }
    }

    const currentStep = (): JSX.Element => {
        switch(step) {
            // Flow 1/4: BEFORE
            case AttendeeStep.before: 
                return <AttendeeQuestion 
                    handleQuestion={handleBeforeQuestion}
                    question={questionsBefore[currentQuestion]}/>
            // Flow 2/4: GET READY
            case AttendeeStep.getready:
                return <AttendeeGetReady/>            
            // Flow 3/4: DURING
            case AttendeeStep.during: return <AttendeeDuring/>
            // // Flow 4/4: END
            case AttendeeStep.end: return <AttendeeEnd/>
        }

        return <AttendeeRegister register={[ attendee, setAttendee, handleStart ]} 
                    errorMessage={errorMessage}/>
    }

    return (
        <React.Fragment>
            { loading && (<Wait/>)}
            { !loading && (<Page>{currentStep()}</Page>)}
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

interface AttendeeRegisterProps {
    register: [ Attendee, (attendee: Attendee) => void, (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void ];
    errorMessage: string;
}

const AttendeeRegister: React.FunctionComponent<AttendeeRegisterProps> = ({ register, errorMessage }) => {
    const [ ready, setReady ] = React.useState<boolean>(false);
    const [ attendee, setAttendee, handleStart ] = register;     

    const referenceFirstName = React.useRef<HTMLInputElement>(null);
    const refereceLastName = React.useRef<HTMLInputElement>(null);
    const referenceEmail = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        // For each render, check if it's allowed to start
        setReady(isValidFirstName() && isValidLastName() && isValidEmail);
    })

    React.useEffect(() => {
        // Get focus into the First Name on the first render
        referenceFirstName.current?.focus();
    }, []);

    const isValidFirstName = (): boolean => {
        const component = referenceFirstName.current as HTMLInputElement;
        return component.value.length > 0 && component.value.length < 51; 
    }

    const isValidLastName = (): boolean => {
        const component = refereceLastName.current as HTMLInputElement;
        return component.value.length > 0 && component.value.length < 51; 
    }

    const isValidEmail = (): boolean => {
        const component = referenceEmail.current as HTMLInputElement;
        return component.value.length > 0 && component.value.length < 151; 
    }

    const handleLogin = (value: string, event: React.FormEvent<HTMLInputElement>) => {
        const { name } = event.currentTarget;
        setAttendee({...attendee, [name]: value });
    }

    return (
        <React.Fragment>
            <Status message={errorMessage}/>
            <PageSection variant={PageSectionVariants.default}>
                <TextContent>
                    <Text component={TextVariants.h1}>Capitals of the World</Text>
                </TextContent>
            </PageSection>
            <PageSection>
                <Form>
                    <FormGroup fieldId="field_firstname" 
                        label="First Name" isRequired>
                            <TextInput id="text_firstname" name="firstName" 
                                type={TextInputTypes.text} ref={referenceFirstName}
                                value={attendee.firstName}
                                onChange={handleLogin}/>
                    </FormGroup>
                    <FormGroup fieldId="field_lastname" 
                        label="Last Name" isRequired>
                            <TextInput id="text_lastname" name="lastName"
                                type={TextInputTypes.text} ref={refereceLastName}
                                value={attendee.lastName}
                                onChange={handleLogin}/>
                    </FormGroup>
                    <FormGroup fieldId="field_email" 
                        label="Email" isRequired>
                            <TextInput id="text_email" name="email"
                                type={TextInputTypes.email} ref={referenceEmail}
                                value={attendee.email}
                                onChange={handleLogin}/>
                    </FormGroup>
                    <ActionGroup>
                        <Button variant={ButtonVariant.primary} 
                            isDisabled={!ready} onClick={handleStart}>Start</Button>
                    </ActionGroup>
                </Form>
            </PageSection>
        </React.Fragment>
    )
} 