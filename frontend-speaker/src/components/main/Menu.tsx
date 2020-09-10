import React from "react";
import { Page, PageSection, PageHeader, Brand, PageHeaderTools, PageHeaderToolsGroup, PageHeaderToolsItem, Button, ButtonVariant, Dropdown 
} from "@patternfly/react-core";
import { CogIcon, HelpIcon } from "@patternfly/react-icons";
import surveyDemoImage from "../login/images/survey-demo.svg";


export const Menu = () => {

    const headerTools = () => (
        <PageHeaderTools>

            <PageHeaderToolsGroup visibility={{default: "hidden", lg:"visible"}}>
                <PageHeaderToolsItem>
                    <Button aria-label="Setting Actions" variant={ButtonVariant.plain}/>
                    <CogIcon/>
                </PageHeaderToolsItem>

                <PageHeaderToolsItem>
                    <Button aria-label="Help Actions" variant={ButtonVariant.plain}/>
                    <HelpIcon/>
                </PageHeaderToolsItem>
            </PageHeaderToolsGroup>

            <PageHeaderToolsGroup>
                <PageHeaderToolsItem visibility={{ lg: "hidden" }}>
                    <Dropdown isPlain position="right"/>
                </PageHeaderToolsItem>
                <PageHeaderToolsItem visibility={{ default: "hidden", md: "visible" }}>
                    <Dropdown isPlain position="right"/>
                </PageHeaderToolsItem>
            </PageHeaderToolsGroup>

        </PageHeaderTools>
    )

    const header = () => (
        <PageHeader logo={<Brand src={surveyDemoImage} alt="Survey Demo"/>}
            headerTools={headerTools} showNavToggle/>
    )

    const sidebar = () => {

    }

    return (
        <Page header={header}>
            Hello
        </Page>
    )
}