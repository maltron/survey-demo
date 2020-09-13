import React from "react";
import { Page, PageSection, ProgressVariant
} from "@patternfly/react-core";
import { Attendee, Question, AttendeeStep, AnswerState, AnswerType } from "@app/Shared/Model";
import { useWebSocket, sendWebSocket, Command, Option 
} from "@app/Backend/SocketCommunication";
import { AttendeeQuestion, AttendeeQuestionState } from "@app/Attendee/AttendeeShared";
import { Wait, Status, BigTitle } from "@app/Shared/Components";
import { AttendeeRegister } from "@app/Attendee/AttendeeRegister";

export const AttendeeSurvey: React.FunctionComponent<{ survey: number }> = ({ survey }) => {
    const [ isSocketConnected, websocket ] = useWebSocket();
    const [ state, setState ] = React.useState<AttendeeQuestionState>({
        errorMessage: "",
        step: AttendeeStep.started, 
        registration: {ID: 0, firstName: "", lastName: "", email: "", points: 0, survey: 0 },
        loadingQuestions: true, 
        questionsBefore: [],
        questionsFinish: [],
        currentQuestion: 0,
        answerState: {answerID: 0, type: AnswerType.answering, variant: undefined},
        status: "",
        countDown: 0
    });
    // const [ connected, websocket ] = useWebSocket(); // WEBSOCKET 
    // const [ errorMessage, setErrorMessage ] = React.useState<string>("");
    // const [ step, setStep ] = React.useState<AttendeeStep>(AttendeeStep.started);
    const ready = React.useRef<boolean>(false); // Indicate the user is ready to engage

    // const [ registration, setRegistration ] = React.useState<Attendee>({
    //     ID: 0, firstName: "", lastName: "", email: "", points: 0, survey: 0
    // });
    // // This reference is important due the nature of WebSockets, 
    // // which it doesn't trigger the render process, hence it's 
    // // impossible to get any state as a result of onmessage()
    const attendee = React.useRef<Attendee>({
        ID: 0, firstName: "", lastName: "", email: "", points:0, survey
    })
    // const [ loadingQuestions, setLoadingQuestions ] = React.useState<boolean>(true);
    const questions = React.useRef<Array<Question>>([]);
    // const [ questionsBefore, setQuestionsBefore ] = React.useState<Array<Question>>([]);
    // const [ questionsFinish, setQuestionsFinish ] = React.useState<Array<Question>>([]);    
    // const [ currentQuestion, setCurrentQuestion ] = React.useState<number>(0);
    // // It helps to stop the timer countdown in each Question
    const tick = React.useRef<NodeJS.Timeout>();
    // const [ answerState, setAnswerState ] = React.useState<AnswerState>({
    //     answerID: 0, type: AnswerType.answering, variant: undefined
    // })
    // const [ countDown, setCountDown ] = React.useState<number>(0);

    React.useEffect(() => {
        // If an WebSocket communiction is established, setup a message callback
        console.log(">>> DriveQuestions useEffect(): ", isSocketConnected);
        if(isSocketConnected) {
          websocket.onmessage = websocketMessage;
          // Tell backend to send all questions related to this survey
          sendWebSocket(websocket, 
                { name: Option.AttendeeStarted, data: { surveyID: survey }})
        }
    
    }, [isSocketConnected]);

    // WEBSOCKET WEBSOCKET WEBSOCKET WEBSOCKET WEBSOCKET WEBSOCKET WEBSOCKET 
    //    WEBSOCKET WEBSOCKET WEBSOCKET WEBSOCKET WEBSOCKET WEBSOCKET WEBSOCKET 
    const websocketMessage = (event: MessageEvent) => {
        var response: Command = JSON.parse(event.data);
//        console.log(`>>> backend Name: ${response.name} Data: ${event.data} currentQuestion: ${state.currentQuestion} Step: ${state.step}`);
        // Refuse anything not related to this Survey 
        if(survey != parseInt(response.data.surveyID)) return;

        // Receving Questions 
        if(response.name === Option.SurveyQuestions) {
            questions.current = response.data.questions;
            // setLoadingQuestions(false);
            setState({ ...state, loadingQuestions: false });
        // Capture AttendeeRegistered in order fetch Attendee.ID
        } else if(response.name === Option.AttendeeRegistered) {
            console.log(`>>> Option.AttendeeRegistered: ${response.data}`);
            // AttendeeRegistered Data: {"name":"AttendeeRegistered","data":{"surveyID":0,"attendee":{"id":16,"firstName":"a","lastName":"a","email":"a","points":0,"survey":1}}}
            const attendeesRegistered: Array<Attendee> = response.data.attendees as Array<Attendee>;
            const attendeeRegistered = 
                attendeesRegistered.find(a => 
                    a.firstName == attendee.current.firstName && 
                    a.lastName == attendee.current.lastName && 
                    a.email == attendee.current.email);
            if(attendeeRegistered) {
                console.log(`>>> Option.AttendeeRegistered: ID:${attendeeRegistered.ID}`);
                attendee.current.ID = attendeeRegistered.ID;
                attendee.current.survey = survey;
            }

            // // We're getting notifications from every single Attendee
            // // We need to update Attendee.ID and it's only true if
            // // firstName, lastName and email matches
            // if(attendee.current.firstName == attendeeRegistered.firstName &&
            //     attendee.current.lastName == attendeeRegistered.lastName &&
            //         attendee.current.email == attendeeRegistered.email) {
            //     attendee.current.ID = parseInt(response.data.attendee.id);
            //     attendee.current.survey = survey; 
            // }

        // READY SURVEY READY SURVEY READY SURVEY READY SURVEY READY SURVEY READY SURVEY  
        } else if(ready.current && response.name === Option.SpeakerJumpQuestion) {
            console.log(`>>> backendMessage: ${response.data.questionID} Questions Length: ${questions.current.length}`);
            const currentQuestion = questions.current.findIndex(
                question => question.ID == parseInt(response.data.questionID));
            const newAnswerState: AnswerState = { ...state.answerState, type: AnswerType.answering, variant: undefined }
            setState({ ...state, loadingQuestions: false, 
                currentQuestion, answerState: newAnswerState, 
                countDown: questions.current[currentQuestion].timer,
                step: AttendeeStep.ready });
            // setCurrentQuestion(questions.current.findIndex(
            //     question => question.ID == parseInt(response.data.questionID)));
            // Reset visual information about the language
            // setAnswerState({ ...answerState, type: AnswerType.answering, variant: undefined });
            // setStep(AttendeeStep.ready);

        // FINISH SURVEY FINISH SURVEY FINISH SURVEY FINISH SURVEY FINISH SURVEY 
        } else if(response.name === Option.SpeakerFinishSurvey) {
            ready.current = false; // Attendee is no longer will engage in Questions
            const questionsFinish = questions.current.filter(question => question.kind == 1);
            setState({ ...state, loadingQuestions: false, 
                step: AttendeeStep.finish, questionsFinish, currentQuestion: 0 });
            // setCurrentQuestion(0);
            // setStep(AttendeeStep.finish);
        }
}

    // React.useEffect(() => {
    //     // If we're reading loading questions, let's split into different 
    //     // variables to be easily handled
    //     if(!state.loadingQuestions) {
    //         console.log("React.useEffect loading. Loading Questions");
            
    //         setState({ ...state, questionsBefore });
    //         // setQuestionsBefore(questions.current.filter(question => question.kind == -1));
    //         // setQuestionsFinish(questions.current.filter(question => question.kind == 1));
    //     }
    // }, [state.loadingQuestions]);

    const handleStart = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        // Update SurveyID into the Registration
        const questionsBefore = questions.current.filter(question => question.kind == -1);
        setState({ ...state, registration: { ...state.registration, survey },
                                step: AttendeeStep.before, questionsBefore });
        // setRegistration({ ...registration, survey });

        // The information of the existing Attendee is kept into attendee.current
        // This is needed due the nature of WebSockets which never triggers
        // the rendering phase
        attendee.current = state.registration;
        // attendee.current = registration; 

        sendWebSocket(websocket, 
            { name: Option.AttendeeRegistration, 
            data: { surveyID: survey, attendee: state.registration }});
        // setStep(AttendeeStep.before);
    }

    const handleBeforeFinishQuestion = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const { id } = event.currentTarget;
        console.log(`>>> handleBeforeFinishQuestion Answer ID: ${id} Current: ${state.currentQuestion} Length: ${state.questionsBefore.length}`);
        console.log(attendee.current);

        if(state.step == AttendeeStep.before) {
            // Record the answer 
            sendWebSocket(websocket, 
                { name: Option.AttendeeAnswered, 
                data: { ID:0, surveyID: survey, 
                            attendeeID: attendee.current.ID,
                            questionID: state.questionsBefore[state.currentQuestion].ID, 
                                                    answerID: parseInt(id) }})
            if(state.currentQuestion < state.questionsBefore.length-1) {
                setState(prevState => {
                    return {...state, currentQuestion: prevState.currentQuestion+1}
                });
                // setCurrentQuestion(prevQuestion => prevQuestion+1);
            } else {
                // By the end of begin, jump to the next step
                setState({...state, step: AttendeeStep.getready });
                // setStep(AttendeeStep.getready);
                ready.current = true; // Attendee is Ready to accept Questions from Speaker
            }
        } else if(state.step == AttendeeStep.finish) {
            // Record the answer 
            sendWebSocket(websocket, { name: Option.AttendeeAnswered, 
                data: { ID:0, surveyID: survey, attendeeID: attendee.current.ID, 
                            questionID: state.questionsFinish[state.currentQuestion].ID, 
                                                    answerID: parseInt(id) }})
            if(state.currentQuestion < state.questionsFinish.length-1) {
                setState(prevState => {
                    return { ...state, currentQuestion: prevState.currentQuestion+1}
                });
                // setCurrentQuestion(prevQuestion => prevQuestion+1);
            } else {
                // By the end of begin, jump to the next step
                setState({ ...state, step: AttendeeStep.end });
                // setStep(AttendeeStep.end);
            }
        }
    }

    const handleReadyQuestion = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        // First of all, stop any timer
        clearInterval(tick.current as NodeJS.Timeout);

        // Look the the answer is the correct one
        const { id: answerID } = event.currentTarget;
        var isCorrect: boolean = false;
        var question = questions.current[state.currentQuestion];
        question.answers.forEach((answer, index) => {
            if(answer.ID == parseInt(answerID) && answer.isCorrect) {
                isCorrect = true; 
            }
        });

        // TOTAL POINTS CALCULATION
        // If Correct, compute the amount of points will be
        // Question.points * state.countDown
        if(isCorrect) {
            attendee.current.points += question.points*state.countDown;
            sendWebSocket(websocket, { name: Option.AttendeeScored, 
                data: { surveyID: survey, attendee: attendee.current }});
        }

        // Visually shows based on the answer
        setState({ ...state, answerState: { answerID: parseInt(answerID),
                type: isCorrect ? AnswerType.correct : AnswerType.incorrect,
                variant: isCorrect ? ProgressVariant.success : ProgressVariant.danger }});
        // setAnswerState({ answerID: parseInt(answerID), 
        //         type: isCorrect ? AnswerType.correct : AnswerType.incorrect,
        //         variant: isCorrect ? ProgressVariant.success : ProgressVariant.danger })
    }

    // const resetQuestion = (): void => {
    //     setCountDown(questions.current[currentQuestion].timer);
    //     setAnswerState({
    //         answerID: 0, type: AnswerType.answering, variant: undefined
    //     });
    // }

    const questionBefore = (): Question => state.questionsBefore[state.currentQuestion];
    const questionFinish = (): Question => state.questionsFinish[state.currentQuestion];


    // JUMP IN EACH STEP: Before --> GET READY --> READY --> FINISH
    const currentStep = (): JSX.Element => {
        console.log(`>>> currentStep: Step ${state.step} currentQuestion ${state.currentQuestion}`);
        switch(state.step) {
            // Flow 1/4: BEFORE
            case AttendeeStep.before: 
                return <AttendeeQuestion tick={tick}
                    handleQuestion={handleBeforeFinishQuestion}
                    question={questionBefore()}
                    attendeeQuestionState={[ state, setState ]}/>
            // Flow 2/4: GET READY
            case AttendeeStep.getready:
                return <AttendeeGetReady/>            
            // Flow 3/4: READY
            case AttendeeStep.ready: 
                // From now on, select a question based on its Question.ID
                // const questionSelected: Question = questions.find(
                //         question => question.ID == attendeeState.currentQuestion) as Question;
                // resetQuestion();
                return <AttendeeQuestion tick={tick} 
                            handleQuestion={handleReadyQuestion}
                            question={questions.current[state.currentQuestion]}
                            attendeeQuestionState={[ state, setState ]}/>
            // // Flow 4/4: FINISH
            case AttendeeStep.finish: 
                var question = questionFinish();
                console.log(">>> Question Finish");
                console.log(question);
                
                return <AttendeeQuestion tick={tick}
                            handleQuestion={handleBeforeFinishQuestion}
                            question={questionFinish()}
                            attendeeQuestionState={[ state, setState ]}/>
            // Flow 5/5: THE END
            case AttendeeStep.end:
                return <AttendeeEnd/>
        }

        return <AttendeeRegister attendeeQuestionState={[ state, setState ]}
                        handleStart={handleStart} errorMessage={state.errorMessage}/>
    }

    return (
        <React.Fragment>
            { state.loadingQuestions && (<Wait/>)}
            { !state.loadingQuestions && (<Page>{currentStep()}</Page>)}
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