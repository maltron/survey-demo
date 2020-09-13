import React from "react";
import { LoginPage, LoginForm, ListVariant } from "@patternfly/react-core";
import { ExclamationCircleIcon } from "@patternfly/react-icons";
// In order to make work for loading SVG images
// Suggestion from @zack on Patternfly Workspace@Slack
// Remove lines 48-86 in webpack.common.js
// Add the option svg in the line
//           test: /\.(jpg|jpeg|png|gif|svg)$/i,
import surveyDemoImage from "@app/assets/images/survey-demo.svg";
import background_lg from "@app/assets/bgimages/pfbg_1200.jpg";
import background_sm from "@app/assets/bgimages/pfbg_768.jpg";
import background_sm2x from "@app/assets/bgimages/pfbg_768@2x.jpg";
import background_xs from "@app/assets/bgimages/pfbg_576.jpg";
import background_xs2x from "@app/assets/bgimages/pfbg_576@2x.jpg";

interface LoginState {
    showHelperText: boolean;
    username: string;
    isValidUsername: boolean; 
    password: string;
    isValidPassword: boolean;
}

export const Login: React.FunctionComponent = () => {
    const [ login, setLogin ] = React.useState<LoginState>({
        showHelperText: false, 
        username: "", isValidUsername: true, 
        password: "", isValidPassword: true
    })

    const handleUsernameAndPassword = (value: string, event: React.FormEvent<HTMLInputElement>) => {
        const { name } = event.currentTarget;
        if(name === "pf-login-username-id") {
            setLogin({...login, username: value });
        } else if(name === "pf-login-password-id") {
            setLogin({...login, password: value });
        }
    }

    const helperText: React.ReactNode = (
        <React.Fragment>
            <ExclamationCircleIcon/>
            &nbsp;Invalid login credentials.
        </React.Fragment>
    )

    const backgroundImages = {
        lg: background_lg,
        sm: background_sm,
        sm2x: background_sm2x,
        xs: background_xs,
        xs2x: background_xs2x
    }

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