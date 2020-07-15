oc exec -i -t $(oc get pods -o jsonpath='{.items[?(@.metadata.labels.name=="survey-mysql")].metadata.name}') -- mysql -u $(oc get secret/survey-mysql -o jsonpath='{.data.database-user}' | base64 --decode) -p$(oc get secret/survey-mysql -o jsonpath='{.data.database-password}' | base64 --decode) $(oc get secret/survey-mysql -o jsonpath='{.data.database-name}' | base64 --decode) --default-character-set=utf8mb4