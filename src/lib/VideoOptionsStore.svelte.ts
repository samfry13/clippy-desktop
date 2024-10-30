class VideoOptions {
  startTime = $state(0);
  endTime = $state(-1);

  config = $state({
    resolution: "Original",
    frameRate: "Original",
    openFolder: false,
  });

  reset() {
    this.startTime = 0;
    this.endTime = -1;
  }
}

export const videoOptions = new VideoOptions();
