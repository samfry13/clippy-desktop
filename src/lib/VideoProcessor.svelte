<script lang="ts">
  import { onMount } from "svelte";
  import { videoOptions } from "./VideoOptionsStore.svelte";
  import { Command, open } from "@tauri-apps/plugin-shell";
  import Progress from "./components/ui/progress/progress.svelte";
  import { sep } from "@tauri-apps/api/path";
  import { formatTime } from "./utils";

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
    if (videoOptions.config.resolution === "1080")
      filters.push(
        "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease"
      );
    else if (videoOptions.config.resolution === "720")
      filters.push(
        "scale='min(1280,iw)':'min(720,ih)':force_original_aspect_ratio=decrease"
      );
    else if (videoOptions.config.resolution === "480")
      filters.push(
        "scale='min(864,iw)':'min(486,ih)':force_original_aspect_ratio=decrease"
      );

    if (videoOptions.config.frameRate !== "Original")
      filters.push(`fps=${videoOptions.config.frameRate}`);

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
