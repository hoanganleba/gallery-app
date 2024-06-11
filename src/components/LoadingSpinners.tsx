import { Component } from "solid-js"

const LoadingSpinners: Component = () => {
    return (
        <div class="flex justify-center items-center h-full w-full p-8">
            <div
                aria-label="Loading..."
                role="status"
                class="flex items-center space-x-2 bg-gray-800 py-4 px-6 rounded-lg"
            >
                <svg class="h-5 w-5 animate-spin stroke-gray-50/80" viewBox="0 0 256 256">
                    <line
                        x1="128"
                        y1="32"
                        x2="128"
                        y2="64"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="24"
                    ></line>
                    <line
                        x1="195.9"
                        y1="60.1"
                        x2="173.3"
                        y2="82.7"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="24"
                    ></line>
                    <line
                        x1="224"
                        y1="128"
                        x2="192"
                        y2="128"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="24"
                    ></line>
                    <line
                        x1="195.9"
                        y1="195.9"
                        x2="173.3"
                        y2="173.3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="24"
                    ></line>
                    <line
                        x1="128"
                        y1="224"
                        x2="128"
                        y2="192"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="24"
                    ></line>
                    <line
                        x1="60.1"
                        y1="195.9"
                        x2="82.7"
                        y2="173.3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="24"
                    ></line>
                    <line
                        x1="32"
                        y1="128"
                        x2="64"
                        y2="128"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="24"
                    ></line>
                    <line
                        x1="60.1"
                        y1="60.1"
                        x2="82.7"
                        y2="82.7"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="24"
                    ></line>
                </svg>
                <span class="text-gray-50/80 text-sm">Loading...</span>
            </div>
        </div>
    )
}

export default LoadingSpinners
