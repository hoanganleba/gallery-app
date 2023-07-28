import DirEntry from '@/types/DirEntry';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { useVideo } from '@/hooks/useVideo';
import { useProgressBarRef } from '@/refs/progressBarRef';
import { Component, ComponentProps, Match, Show, Switch } from 'solid-js';
import LoadingSpinners from './LoadingSpinners';
import isEmptyArray from '@/utils/isEmptyArray';
import {
  FiFolder,
  FiImage,
  FiList,
  FiMaximize,
  FiMinimize,
  FiPause,
  FiPlay,
  FiSkipBack,
  FiSkipForward,
  FiVolume2,
  FiVolumeX,
} from 'solid-icons/fi';
import useIdle from '@/hooks/useIdle';
import { formatDuration } from '@/utils/formatDuration';

interface VideoViewProps extends ComponentProps<any> {
  videos: DirEntry[];
  haveImages: boolean;
  isFullscreen: boolean;
  onFolderClicked: () => void;
  onImageClicked: () => void;
  onFullscreenClicked: () => void;
}

const VideoView: Component<VideoViewProps> = (props: VideoViewProps) => {
  const { idle } = useIdle(2000);

  const {
    videoIndex,
    videoElement,
    setVideoElement,
    isPlaying,
    isMuted,
    duration,
    currentTime,
    setCurrentTime,
    isHovered,
    setIsHovered,
    isDragging,
    togglePlay,
    toggleMute,
    prevVideo,
    nextVideo,
  } = useVideo(props);

  const { progressBarRef } = useProgressBarRef(duration, setCurrentTime, videoElement);

  return (
    <Show when={!isEmptyArray(props.videos)} fallback={<LoadingSpinners />}>
      <div class={`relative h-full w-full ${props.isFullscreen ? 'pt-0' : 'pt-8'}`}>
        <video
          onClick={togglePlay}
          ref={setVideoElement}
          src={convertFileSrc(props.videos[videoIndex()].path)}
          class="my-auto h-full w-full text-neutral-50"
        >
          Your browser does not support the video tag.
        </video>
        <Show when={!idle()}>
          <div class="absolute bg-gradient-to-b from-transparent to-neutral-950/60 inset-x-0 bottom-0 z-10 px-10 pt-16 py-20">
            <div class="flex items-center space-x-4">
              <div class="text-center text-neutral-50 text-xs font-normal cursor-default">
                {formatDuration(currentTime())}
              </div>
              <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                ref={progressBarRef}
                onclick={(event) => {
                  const progressBarRect = event.currentTarget.getBoundingClientRect();
                  const clickOffsetX = event.clientX - progressBarRect.left;
                  const progressBarWidth = progressBarRect.width;
                  const newCurrentTime = (clickOffsetX / progressBarWidth) * duration();
                  setCurrentTime(newCurrentTime);
                  videoElement()!.currentTime = newCurrentTime;
                }}
                class="w-full h-1 bg-neutral-50/30 rounded-full cursor-pointer relative"
              >
                <div
                  class="h-full bg-blue-600 rounded-full w-0"
                  style={`width: ${(currentTime() / duration()) * 100}%`}
                ></div>

                <Show when={isHovered() || isDragging()}>
                  <div
                    class="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-neutral-50 rounded-full"
                    style={`left: ${(currentTime() / duration()) * 100}%`}
                  ></div>
                </Show>
              </div>
              <div class="text-center text-neutral-50 text-xs font-normal cursor-default">
                {formatDuration(duration())}
              </div>
            </div>
            <div class="pt-11 flex items-center justify-between relative">
              <div class="flex items-center space-x-8">
                <button onClick={props.onFolderClicked} class="text-neutral-50">
                  <FiFolder class="h-6 w-6" />
                </button>
                <Show when={props.haveImages}>
                  <button onClick={props.onImageClicked} class="text-neutral-50">
                    <FiImage class="h-6 w-6" />
                  </button>
                </Show>
              </div>
              <div class="flex items-center space-x-20 absolute top-1/2 -trasnlate-y-1/2 left-1/2 -translate-x-1/2">
                <button
                  disabled={videoIndex() === 0}
                  onClick={prevVideo}
                  class="text-neutral-50 disabled:text-neutral-50/30"
                >
                  <FiSkipBack class="h-6 w-6" />
                </button>

                <button onClick={togglePlay} class="text-neutral-50">
                  <Switch>
                    <Match when={!isPlaying()}>
                      <FiPlay class="h-12 w-12" />
                    </Match>
                    <Match when={isPlaying()}>
                      <FiPause class="h-12 w-12" />
                    </Match>
                  </Switch>
                </button>

                <button
                  disabled={videoIndex() === props.videos.length - 1}
                  onClick={nextVideo}
                  class="text-neutral-50 disabled:text-neutral-50/30"
                >
                  <FiSkipForward class="h-6 w-6" />
                </button>
              </div>
              <div class="flex items-center space-x-8">
                <button onClick={toggleMute} class="text-neutral-50">
                  <Switch>
                    <Match when={!isMuted()}>
                      <FiVolume2 class="h-6 w-6" />
                    </Match>
                    <Match when={isMuted()}>
                      <FiVolumeX class="h-6 w-6" />
                    </Match>
                  </Switch>
                </button>
                <button class="text-neutral-50">
                  <FiList class="h-6 w-6" />
                </button>
                <button class="text-neutral-50" onClick={props.onFullscreenClicked}>
                  <Switch>
                    <Match when={props.isFullscreen}>
                      <FiMinimize class="h-6 w-6" />
                    </Match>
                    <Match when={!props.isFullscreen}>
                      <FiMaximize class="h-6 w-6" />
                    </Match>
                  </Switch>
                </button>
              </div>
            </div>
          </div>
        </Show>
      </div>
    </Show>
  );
};

export default VideoView;
