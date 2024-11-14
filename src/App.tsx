import { Component, Match, Show, Switch, createSignal, lazy, onCleanup } from "solid-js"
import TitleBar from "@/components/TitleBar"
import { dialog, invoke } from "@tauri-apps/api"
import DirEntry from "@/types/DirEntry"
import isImageExtension from "@/utils/isImageExtension"
import isVideoExtension from "@/utils/isVideoExtension"
import { listen } from "@tauri-apps/api/event"
import isEmptyArray from "@/utils/isEmptyArray"
import { useFullScreenRef } from "@/refs/useFullScreenRef"
import WelcomeView from "@/views/WelcomeView"
import isFolder from "@/utils/isFolder"

const Alert = lazy(() => import("@/components/Alert"))
const ImageView = lazy(() => import("@/views/ImageView"))
const VideoView = lazy(() => import("@/views/VideoView"))

const App: Component = () => {
    const DATA_THEME = "black"
    const { fullScreenRef, isFullScreen, toggleFullScreen } = useFullScreenRef()
    const [images, setImages] = createSignal<DirEntry[]>([])
    const [videos, setVideos] = createSignal<DirEntry[]>([])
    const [viewType, setViewType] = createSignal("welcome")
    const [alertMessage, setAlertMessage] = createSignal("")
    const [isShownAlert, setIsShownAlert] = createSignal(false)

    const loadMediaFiles = async (path: any) => {
        try {
            const result = await invoke<DirEntry[]>("read_directory", { pathStr: path });
            
            const _images = result.filter((item) => isImageExtension(item.path));
            const _videos = result.filter((item) => isVideoExtension(item.path));
    
            if (isEmptyArray(_images) && isEmptyArray(_videos)) {
                setIsShownAlert(true);
                setAlertMessage("No images or videos were found. Please try again");
            } else {
                setImages(_images);
                setVideos(_videos);
    
                if (isEmptyArray(images()) && !isEmptyArray(videos())) {
                    setViewType("video");
                } else {
                    setViewType("image");
                }
            }
        } catch (error) {
            console.error("Error loading media files:", error);
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
        return path && loadMediaFiles(path)
    })

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
                <TitleBar dataTheme={DATA_THEME} />
            </Show>
            <Switch>
                <Match when={viewType() === "welcome"}>
                    <WelcomeView openDialog={openDialog} />
                </Match>
                <Match when={viewType() === "image"}>
                    <ImageView
                        haveVideos={!isEmptyArray(videos())}
                        onFolderClicked={openDialog}
                        onVideoClicked={() => setViewType("video")}
                        images={images()}
                    />
                </Match>
                <Match when={viewType() === "video"}>
                    <VideoView
                        onFullscreenClicked={toggleFullScreen}
                        isFullscreen={isFullScreen()}
                        haveImages={!isEmptyArray(images())}
                        onFolderClicked={openDialog}
                        onImageClicked={() => setViewType("image")}
                        videos={videos()}
                    />
                </Match>
            </Switch>
        </div>
    )
}

export default App
