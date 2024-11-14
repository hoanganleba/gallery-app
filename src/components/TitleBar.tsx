import { Component, ComponentProps } from "solid-js"
import { appWindow } from "@tauri-apps/api/window"

interface TitlebarProps extends ComponentProps<any> {
    dataTheme: string;
}

const Titlebar: Component<TitlebarProps> = (props : TitlebarProps) => {
    const startDragging = async (event: Event) => {
        event.stopPropagation()
        event.preventDefault()
        await appWindow.startDragging()
    }
    const toggleMaximize = async (event: Event) => {
        event.stopImmediatePropagation()
        event.preventDefault()
        await appWindow.toggleMaximize()
    }
    return (
        <div
            data-theme={props.dataTheme}
            onDblClick={toggleMaximize}
            onMouseDown={startDragging}
            class="z-50 fixed inset-x-0 h-8"
        ></div>
    )
}

export default Titlebar
