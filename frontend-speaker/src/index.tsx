import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, NavLink } from "react-router-dom";
import '@patternfly/react-core/dist/styles/base.css';
import { Page, PageHeader, PageSidebar,
        Nav, NavList, NavItem, SkipToContent
} from "@patternfly/react-core"
import './app.css';

 interface IAppLayout {
     children: React.ReactNode;
 }

const App: React.FunctionComponent<IAppLayout> = ({children}) => {
    const logoProps = {
        href: "/", target: "_blank"
    };
    const [ isNavOpen, setIsNavOpen ] = React.useState(true);
    const [ isMobileView, setIsMobileView ] = React.useState(true);
    const [ isNavOpenMobile, setIsNavOpenMobile ] = React.useState(true);

    const onNavToggleMobile = () => {
        setIsNavOpenMobile(!isNavOpenMobile);
    }
    const onNavToggle = () => {
        setIsNavOpen(!isNavOpen);
    }
    const onPageResize = (props: { mobileView: boolean, windowSize: number }) => {
        setIsMobileView(props.mobileView);
    }

    const Header = (
        <PageHeader
            logo="Survey Demo"
            logoProps={logoProps}
            showNavToggle isNavOpen={isNavOpen} 
            onNavToggle={ isMobileView ? onNavToggleMobile : onNavToggle }
        />        
    );

    const Navigation = (
        <Nav id="nav-primary-simple" theme="dark">
            <NavList id="nav-list-simple">
                <NavItem key="Users" id="Users-1">
                    <NavLink exact to="/users" activeClassName="pf-m-current">Users</NavLink>
                </NavItem>
                <NavItem key="Questions-2" id="Questions-2">
                <NavLink exact to="/questions" activeClassName="pf-m-current">Questions</NavLink>
                </NavItem>
            </NavList>
        </Nav>

    );

    const Sidebar = (
        <PageSidebar
            theme="dark"
            nav={Navigation}
            isNavOpen={ isMobileView ? isNavOpenMobile : isNavOpen }
        />
    );

    const PageSkipToContent = (
        <SkipToContent href="#primary-app-container">
            Skip To Content
        </SkipToContent>
    )

    return (
    <Page 
        mainContainerId="primary-app-container"
        header={Header}
        sidebar={Sidebar}
        onPageResize={onPageResize}
        skipToContent={PageSkipToContent}
    >{children}</Page>
    )
}

ReactDOM.render(<Router><App/></Router>, document.getElementById("root"));