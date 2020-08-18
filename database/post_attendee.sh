curl -v -X POST -H "Content-type: application/json" $(oc get route/survey-demo --output jsonpath='http://{.spec.host}/attendee') $1
