import React from "react";
import { LoginPage, ListVariant, ListItem, 
         LoginFooterItem, 
         LoginForm 
} from "@patternfly/react-core";
import surveyDemoImage from "./images/survey-demo.svg";
import { ExclamationCircleIcon } from "@patternfly/react-icons";

export const Login: React.FunctionComponent = () => {
    const [ login, setLogin ] = React.useState({
        showHelperText: false, 
        username: "", isValidUsername: false, 
        password: "", isValidPassword: false, 
        isRememberMeChecked: false
    })

    const listItem = (
        <React.Fragment>
            <ListItem>
                <LoginFooterItem>Terms of Use</LoginFooterItem>
            </ListItem>
            <ListItem>
                <LoginFooterItem>Help</LoginFooterItem>
            </ListItem>
            <ListItem>
                <LoginFooterItem>Privacy Policy</LoginFooterItem>
            </ListItem>
        </React.Fragment>
    )

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
            passwordLabel="Password"
            passwordValue={login.password}
            isValidPassword={login.isValidPassword}
            rememberMeLabel="Keep me logged in for 30 days"
            isRememberMeChecked={login.isRememberMeChecked}
        />
    )

    return (
        <LoginPage
            footerListVariants={ListVariant.inline}
            brandImgSrc={surveyDemoImage} brandImgAlt="Survey Demo"
            backgroundImgSrc={backgroundImages} backgroundImgAlt="images"
            footerListItems={listItem}
            textContent="This is a placeholder text only. Use this area to place any information or introductory message about your application that may be relevant to users"
            loginTitle="Log into your account"
            logSubtitle="Please use your single sign-on LDAP credentials"   
        >
            {loginForm}
        </LoginPage>
    )
}