import { formatDuration } from "@/utils/formatDuration"
import { Component, ComponentProps, Show } from "solid-js"

interface ProgressBarProps extends ComponentProps<any> {
    ref: any
    isHovered: boolean
    isDragging: boolean
    currentTime: number
    duration: number
    onMouseEnter?: () => void
    onMouseLeave?: () => void
}

const ProgressBar: Component<ProgressBarProps> = (props: ProgressBarProps) => {
    const progressBarRef = props.ref
    return (
        <div class="flex items-center space-x-4">
            <div class="text-center text-neutral-50 text-xs font-normal cursor-default">
                {formatDuration(props.currentTime)}
            </div>
            <div
                onMouseEnter={props.onMouseEnter}
                onMouseLeave={props.onMouseLeave}
                ref={progressBarRef}
                class="w-full h-1 bg-neutral-50/30 rounded-full cursor-pointer relative"
            >
                <div
                    class="h-full bg-blue-600 rounded-full w-0"
                    style={`width: ${(props.currentTime / props.duration) * 100}%`}
                ></div>

                <Show when={props.isHovered || props.isDragging}>
                    <div
                        class="absolute animate-scale-up-center top-0 bottom-0 my-auto -ml-1.5 w-3.5 h-3.5 bg-neutral-50 rounded-full"
                        style={`left: ${(props.currentTime / props.duration) * 100}%`}
                    ></div>
                </Show>
            </div>
            <div class="text-center text-neutral-50 text-xs font-normal cursor-default">
                {formatDuration(props.duration)}
            </div>
        </div>
    )
}

export default ProgressBar
