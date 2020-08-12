curl --verbose --request GET --header "Content-type: application/json" $(oc get route/survey-demo --output jsonpath='http://{.spec.host}/survey')
