FROM golang:alpine AS builder
WORKDIR /survey
ENV GOPATH=/survey \
    SOURCE=/survey/src/github.com/maltron/survey-demo/backend/
ADD . $SOURCE
RUN apk --no-cache add git && \
    go get github.com/gorilla/mux github.com/gorilla/handlers github.com/go-sql-driver/mysql && \
    cd $SOURCE && CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o /survey/survey-demo .

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root
COPY --from=builder /survey/survey-demo .
CMD ["./survey-demo"]
