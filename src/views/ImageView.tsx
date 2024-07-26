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

interface ImageViewProps extends ComponentProps<any> {
    images: DirEntry[]
    haveVideos: boolean
    onFolderClicked: () => void
    onVideoClicked: () => void
}

const ImageView: Component<ImageViewProps> = (props: ImageViewProps) => {
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
                <button
                    onClick={prevImage}
                    disabled={imageIndex() === 0}
                    class="absolute disabled:opacity-30 rounded-full p-3.5 bg-gray-800/80 z-50 top-1/2 -translate-y-1/2 left-8 text-gray-50/80"
                >
                    <FiChevronLeft class="w-6 h-6" />
                </button>
                <img
                    onDblClick={reset}
                    style={{
                        transform: `scale(${scale()}) rotate(${rotate()}deg)`,
                    }}
                    draggable="false"
                    class="h-full w-auto object-scale-down select-none transition duration-300 ease-in-out origin-center"
                    src={convertFileSrc(props.images[imageIndex()].path)}
                />
                <button
                    onClick={nextImage}
                    disabled={imageIndex() === props.images.length - 1}
                    class="absolute disabled:opacity-30 rounded-full p-3.5 bg-gray-800/80 z-50 top-1/2 -translate-y-1/2 right-8 text-gray-50/80"
                >
                    <FiChevronRight class="w-6 h-6" />
                </button>
                <div class="absolute bottom-[12%] bg-gray-800/80 space-x-3.5 rounded-xl px-3.5 py-2 hover:opacity-100 opacity-0 transition-opacity duration-300">
                    <button onClick={props.onFolderClicked} class="p-3.5 text-gray-50/80">
                        <FiFolder class="w-6 h-6" />
                    </button>
                    <Show when={props.haveVideos}>
                        <button onClick={props.onVideoClicked} class="p-3.5 text-gray-50/80">
                            <FiFilm class="w-6 h-6" />
                        </button>
                    </Show>
                    <button onClick={upScale} class="p-3.5 text-gray-50/80">
                        <FiZoomIn class="w-6 h-6" />
                    </button>
                    <button onClick={downScale} class="p-3.5 text-gray-50/80">
                        <FiZoomOut class="w-6 h-6" />
                    </button>
                    <button onClick={rotateLeft} class="p-3.5 text-gray-50/80">
                        <FiRotateCcw class="w-6 h-6" />
                    </button>
                    <button onClick={rotateRight} class="p-3.5 text-gray-50/80">
                        <FiRotateCw class="w-6 h-6" />
                    </button>
                </div>
            </div>
        </Show>
    )
}

export default ImageView
