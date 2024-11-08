import { VideoFrameRate, VideoResolution, VideoType } from "./constants";

type Config = {
  type: VideoType;
  resolution: VideoResolution;
  frameRate: VideoFrameRate;
  quality: number;
  loop: boolean;
  openFolder: boolean;
};

class VideoOptions {
  startTime = $state(0);
  endTime = $state(-1);

  config = $state<Config>({
    type: VideoType.Video,
    resolution: VideoResolution.Original,
    frameRate: VideoFrameRate.Original,
    quality: 3,
    loop: true,
    openFolder: false,
  });

  reset() {
    this.startTime = 0;
    this.endTime = -1;
  }
}

export const videoOptions = new VideoOptions();
