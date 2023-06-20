import { Component, createSignal, onMount } from 'solid-js';
import Play from './Play';
import SpeakerWave from './SpeakerWave';
import Pause from './Pause';
import SpeakerXMark from './SpeakerXMark';
import ArrowsPointingIn from './ArrowsPointingIn';
import ArrowsPointingOut from './ArrowsPointingOut';

interface VideoPlayerProps {
  src: string;
}

const VideoPlayer: Component<VideoPlayerProps> = (props) => {
  const [isPlay, setIsPlay] = createSignal(false);
  const [isMute, setIsMute] = createSignal(false);
  const [isHover, setIsHover] = createSignal(false);
  const [videoBarLength, setVideoBarLength] = createSignal(0);
  const [volumeBarLength, setVolumeBarLength] = createSignal(0);
  const [ambient, setAmbient] = createSignal(false);
  const [isFullScreen, setIsFullScreen] = createSignal(false);

  let videoRef: HTMLVideoElement;
  let videoBarRef: HTMLDivElement;
  let volumeBarRef: HTMLDivElement;

  const [videoMounted, setVideoMounted] = createSignal(false);
  const handleVideoMount = () => setVideoMounted(true);

  const [videoBarMounted, setVideoBarMounted] = createSignal(false);
  const handleVideoBarMount = () => setVideoBarMounted(true);

  const [volumeBarMounted, setVolumeBarMounted] = createSignal(false);
  const handleVolumeBarMount = () => setVolumeBarMounted(true);

  const handlePlayPause = (e: Event) => {
    e.stopPropagation();
    setIsPlay(!isPlay());
    if (videoRef.paused) {
      videoRef.play();
    } else {
      videoRef.pause();
    }
  };

  const handleMute = (e: Event) => {
    e.stopPropagation();
    setIsMute(!isMute());
    videoRef.muted = isMute();
    if (videoRef.muted) {
      setVolumeBarLength(0);
    } else {
      setVolumeBarLength(getVolumeBarLength(videoRef));
    }
  };

  const getVideoBarLength = (video: HTMLVideoElement) => videoBarRef.clientWidth * (video.currentTime / video.duration);

  const getVolumeBarLength = (video: HTMLVideoElement) => volumeBarRef.clientWidth * video.volume;

  const handleOnPlaying = (e: Event) => {
    e.stopPropagation();
    videoRef.addEventListener('timeupdate', () => {
      setVideoBarLength(getVideoBarLength(videoRef));
    });
  };

  onMount(() => {
    setVolumeBarLength(getVolumeBarLength(videoRef));
  });

  return (
    <div
      onClick={handlePlayPause}
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      class={`relative w-full overflow-hidden rounded-2xl mx-auto ${
        ambient() && 'drop-shadow-[0_0_250px_rgba(255,255,255,0.4)]'
      }`}
    >
      <video
        onPlaying={handleOnPlaying}
        ref={(video) => {
          videoRef = video;
          if (video && !videoMounted()) handleVideoMount();
        }}
        class="w-full z-50"
        src={props.src}
      />
      <div
        class={`absolute inset-0 bg-gradient-to-b from-transparent to-neutral-600/30 transition duration-200 ${
          isHover() ? 'opacity-100' : 'opacity-0'
        }`}
      ></div>
      <div
        onClick={(e) => e.stopPropagation()}
        class={`absolute bottom-0 inset-x-0 px-4 transition duration-200 ${isHover() ? 'opacity-100' : 'opacity-0'}`}
      >
        <div
          ref={(videoBar) => {
            videoBarRef = videoBar;
            if (videoBar && !videoBarMounted()) handleVideoBarMount();
          }}
          class="h-1 w-full bg-neutral-300/60 rounded-full"
        >
          <div class="h-full bg-white relative rounded-full" style={{ width: videoBarLength() + 'px' }}>
            <div class="absolute bg-white h-3 w-3 -right-1.5 rounded-full top-1/2 -translate-y-1/2"></div>
          </div>
        </div>
        <div class="flex w-full py-3 items-center justify-between">
          <div class="flex items-center space-x-2">
            <button onClick={handlePlayPause} class="hover:bg-neutral-300/30 p-2 rounded-lg transition duration-200">
              {isPlay() ? <Pause /> : <Play />}
            </button>
            <div class="flex items-center space-x-3">
              <button onClick={handleMute} class="hover:bg-neutral-300/30 p-2 rounded-lg transition duration-200">
                {isMute() ? <SpeakerXMark /> : <SpeakerWave />}
              </button>
              <div
                ref={(volumeBar) => {
                  volumeBarRef = volumeBar;
                  if (volumeBar && !volumeBarMounted()) handleVolumeBarMount();
                }}
                class="h-1 w-16 bg-neutral-300/60 rounded-full"
              >
                <div class="h-full bg-white relative rounded-full" style={{ width: volumeBarLength() + 'px' }}>
                  <div class="absolute bg-white h-3 w-3 -right-1.5 rounded-full top-1/2 -translate-y-1/2"></div>
                </div>
              </div>
            </div>
          </div>
          <button class="hover:bg-neutral-300/30 p-2 rounded-lg transition duration-200">
            {isFullScreen() ? <ArrowsPointingIn /> : <ArrowsPointingOut />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
