import DirEntry from "@/types/DirEntry"
import isEmptyArray from "@/utils/isEmptyArray"
import { Component, ComponentProps, Show, createEffect, createSignal, on, onCleanup } from "solid-js"
import LoadingSpinners from "@/components/LoadingSpinners"
import { convertFileSrc } from "@tauri-apps/api/tauri"
import {
    FiChevronLeft,
    FiChevronRight,
    FiFilm,
    FiRotateCcw,
    FiRotateCw,
    FiZoomIn,
    FiZoomOut,
    FiFolder,
} from "solid-icons/fi"
import useIdle from "@/hooks/useIdle"

interface ImageViewProps extends ComponentProps<any> {
    images: DirEntry[]
    haveVideos: boolean
    onFolderClicked: () => void
    onVideoClicked: () => void
}

const ImageView: Component<ImageViewProps> = (props: ImageViewProps) => {
    const { idle } = useIdle(1000)
    const [imageIndex, setImageIndex] = createSignal(0)
    const [scale, setScale] = createSignal(1)
    const [rotate, setRotate] = createSignal(0)

    const upScale = () => scale() < 5 && setScale(scale() + 0.5)
    const downScale = () => scale() > 0.5 && setScale(scale() - 0.5)
    const rotateLeft = () => setRotate(rotate() - 90)
    const rotateRight = () => setRotate(rotate() + 90)

    const reset = () => {
        setScale(1)
        setRotate(0)
    }

    const prevImage = () => imageIndex() > 0 && setImageIndex(imageIndex() - 1)
    const nextImage = () => imageIndex() < props.images.length - 1 && setImageIndex(imageIndex() + 1)

    createEffect(on(imageIndex, () => setScale(1)))
    createEffect(() => {
        props.images
        setImageIndex(0)
    })

    const handleKeyDown = (event: any) => {
        if (event.key === "ArrowRight") {
            nextImage()
        }

        if (event.key === "ArrowLeft") {
            prevImage()
        }

        if (event.key === "ArrowUp") {
            setScale(scale() + 0.5)
        }

        if (event.key === "ArrowDown") {
            setScale(scale() - 0.5)
        }
    }

    window.addEventListener("keydown", handleKeyDown)

    onCleanup(() => window.removeEventListener("keydown", handleKeyDown))

    return (
        <Show when={!isEmptyArray(props.images)} fallback={<LoadingSpinners />}>
            <div class="flex justify-center items-center h-full w-full p-16">
                <div
                    class={`${idle() ? "opacity-0" : "opacity-100"} transition duration-300 absolute z-50 top-1/2 -translate-y-1/2 left-8 bg-base-100/80 rounded-full`}
                >
                    <button onClick={prevImage} disabled={imageIndex() === 0} class="btn btn-lg btn-circle">
                        <FiChevronLeft class="w-6 h-6" />
                    </button>
                </div>
                <img
                    onDblClick={reset}
                    style={{
                        transform: `scale(${scale()}) rotate(${rotate()}deg)`,
                    }}
                    draggable="false"
                    class="h-full w-auto object-scale-down select-none transition duration-300 ease-in-out origin-center"
                    src={convertFileSrc(props.images[imageIndex()].path)}
                />
                <div
                    class={`${idle() ? "opacity-0" : "opacity-100"} transition duration-300 absolute z-50 top-1/2 -translate-y-1/2 right-8 bg-base-100/80 rounded-full`}
                >
                    <button
                        onClick={nextImage}
                        disabled={imageIndex() === props.images.length - 1}
                        class="btn btn-lg btn-circle"
                    >
                        <FiChevronRight class="w-6 h-6" />
                    </button>
                </div>
                <div
                    class={`${idle() ? "opacity-0" : "opacity-100"} transition duration-300 absolute bottom-12 z-50 join rounded-lg bg-base-100/80`}
                >
                    <button onClick={props.onFolderClicked} class="btn join-item btn-lg">
                        <FiFolder class="w-6 h-6" />
                    </button>
                    <Show when={props.haveVideos}>
                        <button onClick={props.onVideoClicked} class="btn join-item btn-lg">
                            <FiFilm class="w-6 h-6" />
                        </button>
                    </Show>
                    <button onClick={upScale} class="btn join-item btn-lg">
                        <FiZoomIn class="w-6 h-6" />
                    </button>
                    <button onClick={downScale} class="btn join-item btn-lg">
                        <FiZoomOut class="w-6 h-6" />
                    </button>
                    <button onClick={rotateLeft} class="btn join-item btn-lg">
                        <FiRotateCcw class="w-6 h-6" />
                    </button>
                    <button onClick={rotateRight} class="btn join-item btn-lg">
                        <FiRotateCw class="w-6 h-6" />
                    </button>
                </div>
            </div>
        </Show>
    )
}

export default ImageView
