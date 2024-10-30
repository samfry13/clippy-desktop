<script lang="ts">
  import { onMount } from "svelte";
  import { videoOptions } from "./VideoOptions.svelte";
  import { Command, open } from "@tauri-apps/plugin-shell";
  import Progress from "./components/ui/progress/progress.svelte";
  import { sep } from "@tauri-apps/api/path";

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
    const command = Command.sidecar("binaries/ffmpeg", [
      "-y",
      "-nostdin",
      "-i",
      file,
      "-ss",
      videoOptions.startTime.toString(),
      "-to",
      videoOptions.endTime.toString(),
      "-filter:v",
      "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease",
      outputFile,
    ]);
    command.on("close", (data) => {
      console.log(
        `command finished with code ${data.code} and signal ${data.signal}`
      );

      if (data.code === 0) {
        const outputFolder = outputFile.split(sep()).slice(0, -1).join(sep());
        open(outputFolder);

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
    class="flex gap-4 p-4 bg-primary/75 text-primary-foreground rounded-lg border-background border"
  >
    {#if progress !== null}
      <div class="w-28">
        <Progress value={progress} />
      </div>
    {/if}
  </div>
</div>
