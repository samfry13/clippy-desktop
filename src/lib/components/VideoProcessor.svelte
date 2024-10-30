<script lang="ts">
  import { formatTime } from "$lib/utils";
  import { videoOptions } from "$lib/VideoOptionsStore.svelte";
  import { sep } from "@tauri-apps/api/path";
  import { Command, open } from "@tauri-apps/plugin-shell";
  import { onMount } from "svelte";
  import Progress from "./ui/progress/progress.svelte";
  import { VideoFrameRate, VideoResolution, VideoType } from "$lib/constants";

  let {
    file,
    outputFile,
    onComplete,
    onError,
  }: {
    file: string;
    outputFile: string;
    onComplete: () => void;
    onError: (reason: string) => void;
  } = $props();

  let progress = $state<number | null>(null);
  let eta = $state<number | null>(null);

  onMount(() => {
    const filters: string[] = [];
    if (videoOptions.config.resolution !== VideoResolution.Original)
      filters.push(
        {
          [VideoResolution[1080]]:
            "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease",
          [VideoResolution[720]]:
            "scale='min(1280,iw)':'min(720,ih)':force_original_aspect_ratio=decrease",
          [VideoResolution[480]]:
            "scale='min(864,iw)':'min(486,ih)':force_original_aspect_ratio=decrease",
        }[videoOptions.config.resolution]
      );

    if (videoOptions.config.frameRate !== VideoFrameRate.Original)
      filters.push(`fps=${videoOptions.config.frameRate}`);

    if (videoOptions.config.type === VideoType.Gif)
      filters.push(
        `split[s0][s1];[s0]palettegen=stats_mode=diff[p];[s1][p]paletteuse`
      );

    const args = [
      "-y",
      "-nostdin",
      "-i",
      file,
      "-ss",
      videoOptions.startTime.toString(),
      "-to",
      videoOptions.endTime.toString(),
      ...(filters.length > 0 ? ["-filter:v", filters.join(",")] : []),
      ...(videoOptions.config.type === VideoType.Gif
        ? videoOptions.config.loop
          ? ["-loop", "0"]
          : ["-loop", "-1"]
        : []),
      // this changes the bitrate. Higher number = lower quality
      // so if the input's value is low, the number will be high,
      // and the quality will be lower
      // Current range -> 19 - 24
      ...(videoOptions.config.quality < 6
        ? ["-crf", `${24 - videoOptions.config.quality}`]
        : []),
      outputFile,
    ];
    console.log(`command args: ffmpeg ${args.join(" ")}`);

    const command = Command.sidecar("binaries/ffmpeg", args);

    command.on("close", (data) => {
      console.log(
        `command finished with code ${data.code} and signal ${data.signal}`
      );

      if (data.code === 0) {
        if (videoOptions.config.openFolder) {
          const outputFolder = outputFile.split(sep()).slice(0, -1).join(sep());
          open(outputFolder);
        }

        onComplete();
      } else {
        onError(
          `Error: finished with code ${data.code} and signal ${data.signal}`
        );
      }
    });
    command.on("error", (error) => {
      console.error(`command error: "${error}"`);
      onError(`Error: command error: "${error}"`);
    });
    command.stderr.on("data", (line) => {
      console.log(`command stderr: "${line}"`);

      const matches = line.match(
        /time=(\d\d:\d\d:\d\d\.\d\d).*?speed=(\d+\.\d+)x/
      );
      const time = matches?.[1];
      const speed = matches?.[2];

      if (time && speed) {
        const [hours, minutes, seconds] = time.split(":");
        const parsedTime =
          Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds);

        const duration = videoOptions.endTime - videoOptions.startTime;
        progress = (parsedTime / duration) * 100;

        const parsedSpeed = Number(speed);
        eta = (duration - parsedTime) / parsedSpeed;
      }
    });

    command.spawn().then((child) => {
      console.log(`pid: ${child.pid}`);
      progress = 0;
    });
  });
</script>

<div
  class="bg-background/50 absolute inset-0 w-screen h-screen flex items-center justify-center"
>
  <div
    class="flex gap-4 p-4 bg-primary/75 text-primary-foreground rounded-lg border-background border w-3/4 sm:w-1/2"
  >
    {#if progress !== null}
      <div class="w-full flex flex-col gap-2">
        <Progress value={progress} />
        {#if eta}
          <div class="flex justify-between">
            <span>Time Left:</span>
            <span>{eta ? formatTime(eta) : "--:--:--"}</span>
          </div>
        {:else}
          <span>Starting up...</span>
        {/if}
      </div>
    {/if}
  </div>
</div>
