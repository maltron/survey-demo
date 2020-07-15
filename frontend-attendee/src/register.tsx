import React from "react";
import { PageSection,
         Form, FormGroup, TextInput, ActionGroup, Button
} from "@patternfly/react-core";
import axios from "axios";

interface Props {
}

interface User {
    ID: number; 
    firstName: string;
    lastName: string;
}


const Register: React.FunctionComponent<Props> = () => {

    const [ user, setUser ] = React.useState<User>({
        ID: 4, firstName: "Cintia", lastName: "Logan"
    })

    // const handleChange = (value: string, event: React.FormEvent<HTMLInputElement>) => {
    //     console.log("handleChange: "+value);
    //     const { firstName, lastName } = event.currentTarget;
    // }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        console.log("handleClick", JSON.stringify(user));
        // const response = axios({
        //     url: "http://localhost:8080/user",
        //     method: "PUT",
        //     headers: {
        //         "Content-type": "application/json"
        //     },
        //     data: JSON.stringify(user)
        // }).then(response => response.data)
        // .catch(error => console.log("### ERROR:", error));

        fetch('http://localhost:8080/user', {
            method: "PUT", 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        }).then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.log("### ERROR:", error));
    }


    
    return (
    <PageSection>
        <Form>
            <FormGroup fieldId="id_first_name" label="First Name" isRequired
                    helperText="Please provide your first name">
                <TextInput id="text_first_name" name="text_first_name" isRequired type="text"
                    value={user.firstName}
                    onChange={(value: string) => {
                        setUser({ ID: user.ID, firstName: value, lastName: user.lastName })
                    }}/>
            </FormGroup>
            <FormGroup fieldId="id_last_name" label="Last Name" isRequired>
                <TextInput id="text_last_name" name="text_last_name" isRequired type="text"
                    value={user.lastName}
                    onChange={(value: string) => {
                        setUser({ ID: user.ID, firstName: user.firstName, lastName: value })
                    }}/>
            </FormGroup>
            <ActionGroup>
                <Button variant="primary" onClick={handleClick}>START</Button>
            </ActionGroup>
        </Form>
    </PageSection>
    )
}

export { Register };