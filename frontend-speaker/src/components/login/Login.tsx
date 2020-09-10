import React from "react";
import { LoginPage, ListVariant, 
         LoginForm 
} from "@patternfly/react-core";
import surveyDemoImage from "./images/survey-demo.svg";
import { ExclamationCircleIcon } from "@patternfly/react-icons";

export const Login: React.FunctionComponent = () => {
    const [ login, setLogin ] = React.useState({
        showHelperText: false, 
        username: "", isValidUsername: true, 
        password: "", isValidPassword: true
    })

    const handleUsernameAndPassword = (value: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const { name } = event.currentTarget;
        if(name === "pf-login-username-id") {
            setLogin({...login, username: value });
        } else if(name === "pf-login-password-id") {
            setLogin({...login, password: value });
        }
    }

    const backgroundImages = {
        lg: './images/pfbg_1200.jpg',
        sm: './images/pfbg_768.jpg',
        sm2x: './images/pfbg_768@2x.jpg',
        xs: './images/pfbg_576.jpg',
        xs2x: './images/pfbg_576@2x.jpg'
    }

    const helperText = (
        <React.Fragment>
            <ExclamationCircleIcon/>
            &nbsp;Invalid login credentials.
        </React.Fragment>
    )

    const loginForm = (
        <LoginForm
            showHelperText={login.showHelperText}
            helperText={helperText}
            helperTextIcon={<ExclamationCircleIcon/>}
            usernameLabel="Username"
            usernameValue={login.username}
            isValidUsername={login.isValidUsername}
            onChangeUsername={handleUsernameAndPassword}
            passwordLabel="Password"
            passwordValue={login.password}
            isValidPassword={login.isValidPassword}
            onChangePassword={handleUsernameAndPassword}
        />
    )

    return (
        <LoginPage
            footerListVariants={ListVariant.inline}
            brandImgSrc={surveyDemoImage} brandImgAlt="Survey Demo"
            backgroundImgSrc={backgroundImages} backgroundImgAlt="images"
            loginTitle="Speaker Log In"
        >
            {loginForm}
        </LoginPage>
    )
}