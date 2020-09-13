// URL Address to the Server
export const surveyServer = (): string => {
    return process.env.SURVEY_SERVER ? process.env.SURVEY_SERVER : "localhost:8080";
}
