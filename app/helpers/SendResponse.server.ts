interface Args<T> {
    status: "success" | "error",
    code: number,
    message: string,
    action: string,
    data: T
}
export const sendResponseServer = <T>({ status, code, message, action, data }: Args<T>) => {
    return {
        data: data,
        action: action,
        status: status,
        code: code || 200,
        message: message || "لا توجد بيانات."
    }
}