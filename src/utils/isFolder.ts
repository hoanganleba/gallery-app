export default (path: string) => {
    // Normalize the path separators to '/'
    path = path.replace(/\\/g, "/")

    // Extract the last part of the path
    const lastPart = path.split("/").pop()

    // Check if the last part contains a period
    return lastPart && !lastPart.includes(".")
}
