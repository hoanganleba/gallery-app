import { Component, Show, createMemo, createSignal, lazy, onCleanup } from "solid-js"
import TitleBar from "@/components/TitleBar"
import { dialog, invoke } from "@tauri-apps/api"
import DirEntry from "@/types/DirEntry"
import isImageExtension from "@/utils/isImageExtension"
import isVideoExtension from "@/utils/isVideoExtension"
import { listen } from "@tauri-apps/api/event"
import isEmptyArray from "@/utils/isEmptyArray"
import { useFullScreenRef } from "@/refs/useFullScreenRef"
import isFolder from "@/utils/isFolder"
import { Dynamic } from "solid-js/web"

const Alert = lazy(() => import("@/components/Alert"))
const WelcomeView = lazy(() => import("@/views/WelcomeView"))
const ImageView = lazy(() => import("@/views/ImageView"))
const VideoView = lazy(() => import("@/views/VideoView"))

type ViewType = "welcome" | "image" | "video"

const DATA_THEME = "black"

const App: Component = () => {
    const { fullScreenRef, isFullScreen, toggleFullScreen } = useFullScreenRef()
    const [images, setImages] = createSignal<DirEntry[]>([])
    const [videos, setVideos] = createSignal<DirEntry[]>([])
    const [viewType, setViewType] = createSignal<ViewType>("welcome")
    const [alertMessage, setAlertMessage] = createSignal("")
    const [isShownAlert, setIsShownAlert] = createSignal(false)

    const loadMediaFiles = async (path: any) => {
        try {
            const result = await invoke<DirEntry[]>("read_directory", { pathStr: path })

            const _images = result.filter((item) => isImageExtension(item.path))
            const _videos = result.filter((item) => isVideoExtension(item.path))

            if (isEmptyArray(_images) && isEmptyArray(_videos)) {
                setIsShownAlert(true)
                setAlertMessage(
                    "The selected folder doesn't contain any images or videos. Please choose a different folder and try again"
                )
            } else {
                setIsShownAlert(false)
                setAlertMessage("")
                setImages(_images)
                setVideos(_videos)

                if (isEmptyArray(images()) && !isEmptyArray(videos())) {
                    setViewType("video")
                } else {
                    setViewType("image")
                }
            }
        } catch (error) {
            setIsShownAlert(true)
            setAlertMessage(`Error loading media files: ${error}`)
        }
    }

    const openDialog = async () => {
        const path = await dialog.open({ directory: true })
        return path && loadMediaFiles(path)
    }

    const handleCommandO = (event: any) => {
        if (event.metaKey && event.key === "o") {
            event.preventDefault()
            openDialog()
        }
    }

    document.addEventListener("keydown", handleCommandO)

    onCleanup(() => {
        document.removeEventListener("keydown", handleCommandO)
    })

    listen("tauri://file-drop", async (event) => {
        const path = (event.payload as any)[0]
        if (isFolder(path)) {
            loadMediaFiles(path)
        } else {
            setIsShownAlert(true)
            setAlertMessage("Only folders are supported. Please drag and drop a valid folder and try again")
        }
    })

    const componentsMap = {
        welcome: WelcomeView,
        image: ImageView,
        video: VideoView,
    }

    const propsMap = createMemo(() => ({
        welcome: { openDialog },
        image: {
            haveVideos: !isEmptyArray(videos()),
            onFolderClicked: openDialog,
            onVideoClicked: () => setViewType("video"),
            images: images(),
        },
        video: {
            isFullscreen: isFullScreen(),
            onFullscreenClicked: toggleFullScreen,
            haveImages: !isEmptyArray(images()),
            onFolderClicked: openDialog,
            onImageClicked: () => setViewType("image"),
            videos: videos(),
        },
    }))

    return (
        <div data-theme={DATA_THEME} ref={fullScreenRef} class="w-screen min-h-screen h-screen overflow-hidden">
            <Show when={isShownAlert()}>
                <div class="fixed z-50 top-12 inset-x-0">
                    <div class="flex justify-center">
                        <div class="min-w-[680px]">
                            <Alert message={alertMessage()} onAlertClicked={() => setIsShownAlert(false)} />
                        </div>
                    </div>
                </div>
            </Show>
            <Show when={!isFullScreen()}>
                <TitleBar />
            </Show>
            <Dynamic component={componentsMap[viewType()]} {...propsMap()[viewType()]} />
        </div>
    )
}

export default App
