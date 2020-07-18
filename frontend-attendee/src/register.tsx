import React from "react";
import { PageSection,
         Form, FormGroup, TextInput, ActionGroup, Button, 
         Label, 
         ValidatedOptions
} from "@patternfly/react-core";
import { InfoCircleIcon } from "@patternfly/react-icons";

interface Props {
}

interface User {
    ID: number; 
    firstName: string;
    lastName: string;
}


const Register: React.FunctionComponent<Props> = () => {

    const [start, setStart] = React.useState<boolean>(false);
    const [user, setUser]   = React.useState<User>({
        ID: 0, firstName: "", lastName: ""
    })
    const [ validated, setValidated] = React.useState({
        firstName: ValidatedOptions.default, lastName: ValidatedOptions.default
    })
    const [ errorMessage, setErrorMessage ] = React.useState<string>("");
    
    const handleEntry = (value: string, event: React.FormEvent<HTMLInputElement>) => {
        const { name } = event.currentTarget;

        let enableStart: boolean
        if(name==="firstName") {
            enableStart = (user.lastName.length > 0 && 
                user.lastName.length < 51 && value.length > 0 && value.length < 51);
        } else if(name==="lastName") {
            enableStart = (user.firstName.length > 0 &&
                user.firstName.length < 51 && value.length > 0 && value.length < 51);
        }
        setStart(() => enableStart);

        setUser({...user, [name]: value });
    }

    const handleClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        console.log("handleClick", JSON.stringify(user));

        await fetch('http://survey-demo-test2.apps.cluster-maltron-2ef2.maltron-2ef2.example.opentlc.com/user', {
            method: "PUT", 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        }).then(response => {
            if(response.status == 201) {
                setErrorMessage("");
                setValidated({ firstName: ValidatedOptions.success,
                            lastName: ValidatedOptions.success});
            } else if (response.status == 400) {
                // Bad Request: when one of the fields are empty
                setErrorMessage("400: Bad Request");
            } else if (response.status == 406) {
                // Not Acceptable: when there isn't a Header: Content-type=application/json
                setErrorMessage("406: Not Acceptable");
            } else if (response.status == 409) {
                // Conflict: when there is another existing user with the same first and last name
                setErrorMessage("409: Conflict");
            } else if(response.status == 417) {
                // Expectation Failed: The User is not a valid one (size greater than estipulated by the database)
                setErrorMessage("417: Expectation Failed");
            } else if(response.status == 500) {
                // Internal Server: when it wasn unable to perform a SQL Query
                setErrorMessage("500: Server Failed");
            }
        })
        .catch(error => {
            // console.log("### ERROR:", error)
            setErrorMessage(error);            
        });
    }


    
    return (
    <PageSection>
        <Form>
            <React.Fragment>
            { errorMessage ?
                <Label color="red" icon={<InfoCircleIcon/>}>{errorMessage}</Label>
              : <Label>{" "}</Label> }
            </React.Fragment>
            <FormGroup fieldId="id_first_name" label="First Name" isRequired
                    helperText="Please provide your first name">
                <TextInput id="text_first_name" name="firstName" isRequired type="text"
                    value={user.firstName} onChange={handleEntry}
                    validated={validated.firstName}/>
            </FormGroup>
            <FormGroup fieldId="id_last_name" label="Last Name" isRequired>
                <TextInput id="text_last_name" name="lastName" isRequired type="text"
                    value={user.lastName}
                    onChange={handleEntry}
                    validated={validated.lastName}/>
            </FormGroup>
            <ActionGroup>
                <Button variant="primary" onClick={handleClick} isDisabled={!start}>START</Button>
            </ActionGroup>
        </Form>
    </PageSection>
    )
}

export { Register };