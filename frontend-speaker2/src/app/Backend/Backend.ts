// URL Address to the Server
export const backendURL = (): string => {
    return process.env.BACKEND_API ? process.env.BACKEND_API : "http://localhost:8080";
}
