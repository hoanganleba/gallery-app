import { Component, ComponentProps } from "solid-js"

interface AlertProps extends ComponentProps<any> {
    message: string
    onAlertClicked: () => void
}

const Alert: Component<AlertProps> = (props: AlertProps) => {
    return (
        <div role="alert" class="alert alert-error rounded-lg">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
            <span>{props.message}</span>
            <button
                onClick={props.onAlertClicked}
                class="btn text-base-100 btn-square rounded-md btn-sm bg-error border-none shadow-none hover:bg-error"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    )
}

export default Alert
