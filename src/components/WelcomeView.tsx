import { Component, ComponentProps } from "solid-js"

interface WelcomeViewProps extends ComponentProps<any> {
    openDialog: () => void
}

const WelcomeView: Component<WelcomeViewProps> = (props: WelcomeViewProps) => {
    return (
        <div class="flex items-center justify-center w-full h-full p-8">
            <div
                onclick={props.openDialog}
                class="text-white bg-gray-800 w-[680px] h-64 flex justify-center items-center rounded-xl cursor-pointer"
            >
                <div>
                    <div class="flex justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-20 h-20"
                        >
                            <path
                                strok-linecap="round"
                                stroke-linejoin="round"
                                d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                            />
                        </svg>
                    </div>
                    <p class="text-lg font-bold text-center text-white">
                        Drop your folder here, or <span class="font-bold text-blue-400">browse</span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default WelcomeView
