import { createEffect, createSignal } from "solid-js"

export const useFullScreenRef = () => {
    const [isFullScreen, setIsFullScreen] = createSignal(false)
    let elementRef: any
    const fullScreenRef = (element: any) => {
        if (element) {
            elementRef = element
            element.addEventListener("fullscreenchange", () => {
                setIsFullScreen(!!document.fullscreenElement)
            })
        }
    }

    const toggleFullScreen = () => {
        if (!isFullScreen()) {
            elementRef.requestFullscreen()
        } else {
            document.exitFullscreen()
        }
    }

    createEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === "f") {
                toggleFullScreen()
            }
        }

        window.addEventListener("keydown", handleKeyPress)
        return () => {
            window.removeEventListener("keydown", handleKeyPress)
        }
    })

    createEffect(() => {
        return () => {
            if (isFullScreen()) {
                document.exitFullscreen()
            }
        }
    })

    return { fullScreenRef, isFullScreen, toggleFullScreen }
}
