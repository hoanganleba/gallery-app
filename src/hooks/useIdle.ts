import { createSignal, createEffect, onCleanup, Accessor } from "solid-js"

type Idle = {
    idle: Accessor<boolean>
    reset: () => void
}

const useIdle = (duration: number): Idle => {
    const [idle, setIdle] = createSignal(false)

    let timer: number

    const reset = () => {
        setIdle(false)
    }

    const handleSetIdle = () => {
        setIdle(true)
    }

    // Function to reset the idle state
    const resetIdle = () => {
        clearTimeout(timer)
        setIdle(false) // Reset idle state to false
        timer = window.setTimeout(handleSetIdle, duration)
    }

    // Event listeners to monitor user activity
    const handleUserActivity = () => {
        resetIdle()
    }

    createEffect(() => {
        // Attach event listeners
        window.addEventListener("mousemove", handleUserActivity)
        window.addEventListener("keydown", handleUserActivity)
        window.addEventListener("scroll", handleUserActivity)

        // Start the initial timer
        resetIdle()

        // Cleanup event listeners when the component is unmounted
        onCleanup(() => {
            clearTimeout(timer)
            window.removeEventListener("mousemove", handleUserActivity)
            window.removeEventListener("keydown", handleUserActivity)
            window.removeEventListener("scroll", handleUserActivity)
        })
    })

    return { idle, reset }
}

export default useIdle
