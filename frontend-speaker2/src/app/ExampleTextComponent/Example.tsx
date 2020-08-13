import React from "react";
import { TextContent, Text, TextVariants } from "@patternfly/react-core";


export const ExampleText: React.FunctionComponent = () => {
    return (
        <TextContent>
            <Text component={TextVariants.h1}>Hello World</Text>
        </TextContent>
    )
}