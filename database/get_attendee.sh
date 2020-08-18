curl -v -X GET -H "Content-type: application/json" $(oc get route/survey-demo --output jsonpath='http://{.spec.host}/attendee')
