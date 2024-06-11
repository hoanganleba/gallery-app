import { Component, Match, Show, Switch, createEffect, createSignal, on } from "solid-js"
import TitleBar from "@/components/TitleBar"
import { dialog, invoke } from "@tauri-apps/api"
import DirEntry from "./types/DirEntry"
import isImageExtension from "@/utils/isImageExtension"
import isVideoExtension from "@/utils/isVideoExtension"
import shuffleArray from "@/utils/shuffleArray"
import ImageView from "@/components/ImageView"
import VideoView from "@/components/VideoView"
import isStringEmpty from "@/utils/isStringEmpty"
import { listen } from "@tauri-apps/api/event"
import isEmptyArray from "@/utils/isEmptyArray"
import { useFullScreenRef } from "@/refs/useFullScreenRef"
import WelcomeView from "@/components/WelcomeView"
import Alert from "@/components/Alert"

const App: Component = () => {
    const { fullScreenRef, isFullScreen, toggleFullScreen } = useFullScreenRef()
    const [images, setImages] = createSignal<DirEntry[]>([])
    const [videos, setVideos] = createSignal<DirEntry[]>([])
    const [viewType, setViewType] = createSignal("image")
    const [directoryPath, setDirectoryPath] = createSignal("")
    const [alertMessage, setAlertMessage] = createSignal("")
    const [isShownAlert, setIsShownAlert] = createSignal(false)

    const openDialog = async () => {
        const path = await dialog.open({ directory: true })
        if (path) {
            setDirectoryPath(path as string)
        }
    }

    listen("tauri://file-drop", (event) => {
        const path = (event.payload as any)[0]
        if (isImageExtension(path) || isVideoExtension(path)) {
            setIsShownAlert(true)
            setAlertMessage("Not a directory. Please drop a valid directory")
        } else {
            setDirectoryPath(path as string)
        }
    })

    createEffect(
        on(
            directoryPath,
            async () => {
                setImages([])
                setVideos([])
                setIsShownAlert(false)
                setAlertMessage("")
                setViewType("image")

                if (directoryPath()) {
                    const result = await invoke<DirEntry[]>("read_directory", {
                        pathStr: directoryPath(),
                    })
                    setImages(shuffleArray(result.filter((item) => isImageExtension(item.path))))
                    setVideos(shuffleArray(result.filter((item) => isVideoExtension(item.path))))
                }

                if (isEmptyArray(images()) && isEmptyArray(videos())) {
                    setIsShownAlert(true)
                    setAlertMessage("No images or videos were found. Please try again")
                    setViewType("")
                }

                if (isEmptyArray(images()) && !isEmptyArray(videos())) {
                    setViewType("video")
                }
            },
            { defer: true }
        )
    )

    return (
        <div ref={fullScreenRef} class="w-screen min-h-screen h-screen bg-neutral-950 overflow-hidden">
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
            <Switch>
                <Match when={!isStringEmpty(directoryPath())}>
                    <Switch>
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
                </Match>
                <Match when={isStringEmpty(directoryPath())}>
                    <WelcomeView openDialog={openDialog} />
                </Match>
            </Switch>
        </div>
    )
}

export default App
