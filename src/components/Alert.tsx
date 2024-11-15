import { FiAlertCircle, FiX } from "solid-icons/fi"
import { Component, ComponentProps } from "solid-js"

interface AlertProps extends ComponentProps<any> {
    message: string
    onAlertClicked: () => void
}

const Alert: Component<AlertProps> = (props: AlertProps) => {
    return (
        <div role="alert" class="alert alert-error rounded-lg">
            <FiAlertCircle class="h-6 w-6 stroke-current shrink-0" />
            <span>{props.message}</span>
            <button
                onClick={props.onAlertClicked}
                class="btn text-base-100 btn-square rounded-md btn-sm bg-error border-none shadow-none hover:bg-error"
            >
                <FiX class="h-6 w-6 stroke-current shrink-0" />
            </button>
        </div>
    )
}

export default Alert
