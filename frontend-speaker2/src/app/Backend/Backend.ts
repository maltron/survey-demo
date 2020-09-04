// URL Address to the Server
export const backendURL = (): string => {
    return process.env.BACKEND_API ? process.env.BACKEND_API : "localhost:8080";
}
