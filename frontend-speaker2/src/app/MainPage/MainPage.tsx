import React from "react";
import { Page, PageHeader, PageSection, Avatar,
    PageHeaderTools, PageHeaderToolsGroup, PageHeaderToolsItem,
    Brand, Button, ButtonVariant,
    Nav, NavList, NavItem, PageSidebar, SkipToContent, 
    Dropdown, DropdownItem, DropdownGroup, DropdownPosition, DropdownToggle
} from "@patternfly/react-core";
import { CogIcon, HelpIcon } from "@patternfly/react-icons";
import surveyDemoImage from "@app/assets/images/survey-demo.svg";
import imgAvatar from '@app/assets/images/imgAvatar.svg';
import { ListSurveys } from "./ListSurveys";

interface Navigation {
    navigation_item: number; 
    dropdown: boolean; 
    dropdownUser: boolean; 
}

export const MainPage: React.FunctionComponent = () => {
    const [ navigation, setNavigation ] = React.useState<Navigation>({
        navigation_item: 0, dropdown: false, dropdownUser: false 
    })

    const headerToolsDropdownItems = [
        <DropdownItem key="settings">
            <CogIcon/>Settings
        </DropdownItem>,
        <DropdownItem key="help">
            <HelpIcon/>Help
        </DropdownItem>
    ]

    const headerToolsUserDropdownItems = [
        <DropdownGroup key="group2">
            <DropdownItem key="myprofile">My Profile</DropdownItem>
            <DropdownItem key="usermanagement" component="button">User Management</DropdownItem>
            <DropdownItem key="logout">Logout</DropdownItem>
        </DropdownGroup>
    ]

    const headerTools = <PageHeaderTools>
        <PageHeaderToolsGroup visibility={{ default: "hidden", lg: "visible" }}>
            <PageHeaderToolsItem>
                <Button aria-label="Settings Action" variant={ButtonVariant.plain}>
                    <CogIcon/>
                </Button>
            </PageHeaderToolsItem>
            <PageHeaderToolsItem>
                <Button aria-label="Help Action" variant={ButtonVariant.plain}>
                    <HelpIcon/>
                </Button>
            </PageHeaderToolsItem>
        </PageHeaderToolsGroup>

        <PageHeaderToolsGroup>
            <PageHeaderToolsItem visibility={{ lg: "hidden", "2xl?": "hidden" }}>
                <Dropdown isPlain position={DropdownPosition.right}
                toggle={<DropdownToggle onToggle={isOpen => setNavigation({...navigation, dropdown: isOpen})}/>}
                isOpen={navigation.dropdown} dropdownItems={headerToolsDropdownItems}/>
            </PageHeaderToolsItem>
            <PageHeaderToolsItem>
                <Dropdown isPlain position={DropdownPosition.right}
                toggle={<DropdownToggle onToggle={isOpen => setNavigation({...navigation, dropdownUser: isOpen })}/>}
                isOpen={navigation.dropdownUser} dropdownItems={headerToolsUserDropdownItems}/>
            </PageHeaderToolsItem>
        </PageHeaderToolsGroup>
        <Avatar src={imgAvatar} alt="Avatar"/>
    </PageHeaderTools>

    const header = <PageHeader 
        logo={<Brand src={surveyDemoImage} alt="Survey Demo"/>}
        headerTools={headerTools} showNavToggle/>

    const handleNavigation = (selectedItem: {
        groupId: React.ReactText;
        itemId: React.ReactText;
        to: string;
        event: React.FormEvent<HTMLInputElement>;
    }) => {
        setNavigation({...navigation, navigation_item: selectedItem.itemId as number });
    }

    const nav = <Nav aria-label="Nav" onSelect={handleNavigation}>
        <NavList>
            <NavItem itemId={0} isActive={navigation.navigation_item == 0}>System Panel</NavItem>
            <NavItem itemId={1} isActive={navigation.navigation_item == 1}>Policy</NavItem>
            <NavItem itemId={2} isActive={navigation.navigation_item == 2}>Authentication</NavItem>
            <NavItem itemId={3} isActive={navigation.navigation_item == 3}>Network Services</NavItem>
            <NavItem itemId={4} isActive={navigation.navigation_item == 4}>Server</NavItem>
        </NavList>
    </Nav>

    const sidebar = <PageSidebar nav={nav}/>

    return (
        <Page mainContainerId="main-survey-demo"
            isManagedSidebar sidebar={sidebar} header={header}
            skipToContent={<SkipToContent href="main-survey-demo">Skip to Content</SkipToContent>}>
                <PageSection variant="dark">
                    {process.env.SERVER_API}
                </PageSection>
                <PageSection variant="default">
                    <ListSurveys surveys={[{ID: 0, name:"helo"},{ID: 1, name:"mama"}]}/>
                </PageSection>
        </Page>
    )
}