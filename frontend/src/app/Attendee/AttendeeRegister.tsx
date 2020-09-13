import React from "react";
import { 
    PageSection, PageSectionVariants,
    Text, TextContent, TextVariants,
    Form, FormGroup, TextInput, TextInputTypes, ActionGroup,
    Button, ButtonVariant
} from "@patternfly/react-core";
import { Attendee } from "@app/Shared/Model";
import { Status } from "@app/Shared/Components";
import { AttendeeQuestionState } from "@app/Attendee/AttendeeShared";

interface AttendeeRegisterProps {
    attendeeQuestionState: [ AttendeeQuestionState, React.Dispatch<React.SetStateAction<AttendeeQuestionState>> ];
    handleStart: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    errorMessage: string;
}

export const AttendeeRegister: React.FunctionComponent<AttendeeRegisterProps> = 
            ({ attendeeQuestionState, handleStart, errorMessage }) => {
    const [ ready, setReady ] = React.useState<boolean>(false);
    // const { registration, setRegistration } = user;
    const [ state, setState ] = attendeeQuestionState;

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
        // attendee.current = {...attendee.current, [name]: value };
        // setRegistration({ ...registration, [name]: value });
        setState({ ...state, registration: { ...state.registration, [name]: value }});
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
                                value={state.registration.firstName}
                                onChange={handleLogin}/>
                    </FormGroup>
                    <FormGroup fieldId="field_lastname" 
                        label="Last Name" isRequired>
                            <TextInput id="text_lastname" name="lastName"
                                type={TextInputTypes.text} ref={refereceLastName}
                                value={state.registration.lastName}
                                onChange={handleLogin}/>
                    </FormGroup>
                    <FormGroup fieldId="field_email" 
                        label="Email" isRequired>
                            <TextInput id="text_email" name="email"
                                type={TextInputTypes.email} ref={referenceEmail}
                                value={state.registration.email}
                                onChange={handleLogin}/>
                    </FormGroup>
                    <ActionGroup>
                        <Button variant={ButtonVariant.primary} 
                            isDisabled={!ready && !state.loadingQuestions} onClick={handleStart}>Start</Button>
                    </ActionGroup>
                </Form>
            </PageSection>
        </React.Fragment>
    )
} 