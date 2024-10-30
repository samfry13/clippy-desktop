class VideoOptions {
  startTime = $state(0);
  endTime = $state(-1);

  reset() {
    this.startTime = 0;
    this.endTime = -1;
  }
}

export const videoOptions = new VideoOptions();
