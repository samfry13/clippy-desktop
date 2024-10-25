<script lang="ts">
  import { convertFileSrc } from "@tauri-apps/api/core";
  import Ellipsis from "lucide-svelte/icons/ellipsis";
  import Pause from "lucide-svelte/icons/pause";
  import Play from "lucide-svelte/icons/play";
  import Save from "lucide-svelte/icons/save";
  import Volume2 from "lucide-svelte/icons/volume-2";
  import VolumeX from "lucide-svelte/icons/volume-x";
  import DurationSlider from "./components/DurationSlider.svelte";
  import Button from "./components/ui/button/button.svelte";

  const { file }: { file: string } = $props();
  const assetUrl = convertFileSrc(file);

  let video: HTMLVideoElement;

  let paused = $state(false);
  const togglePlay = () => {
    if (currentTime >= endTime) currentTime = startTime;
    if (endTime - startTime <= 0) return;
    paused ? video.play() : video.pause();
  };

  let muted = $state(false);
  const toggleMute = () => (muted = !muted);

  let duration = $state(0);
  let startTime = $state(0);
  let currentTime = $state(0);
  let endTime = $state(-1);

  $effect(() => {
    if (duration > 0 && endTime === -1) {
      endTime = duration;
      startTime = 0;
      currentTime = 0;
    }
  });
  $effect(() => {
    // these are just here to make sure the effect gets triggered
    // whenever start time or end time changes
    startTime;
    endTime;
    paused = true;
  });

  const onProgress = () => {
    if (currentTime >= endTime) {
      currentTime = endTime;
      paused = true;
    }
  };

  const formatTime = (time: number, space = false) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const millis = Math.floor((time % 1) * 100);
    return [minutes, seconds, millis]
      .map((value) => value.toString().padStart(2, "0"))
      .join(space ? " : " : ":");
  };
</script>

<div class="w-full h-screen max-h-screen flex flex-col bg-neutral-800">
  <!-- svelte-ignore a11y_media_has_caption -->
  <video
    class="flex-1 py-4"
    bind:this={video}
    bind:paused
    bind:muted
    bind:duration
    bind:currentTime
    ontimeupdate={onProgress}
  >
    <source src={assetUrl} />
    Your browser does not support the video tag.
  </video>

  <div class="p-4 mx-auto w-2/3 max-w-3xl space-y-6 select-none">
    <div
      class="text-primary-foreground border border-primary w-fit mx-auto py-1 px-3 rounded-md bg-primary/50"
    >
      {formatTime(endTime - startTime, true)}
    </div>

    <div
      class="flex items-center gap-4 sm:gap-2 mb-2 text-primary-foreground text-sm w-full justify-center border border-primary p-1 rounded-md bg-primary/50"
    >
      <div class="shrink-0 flex gap-1">
        <Button
          class="shrink-0"
          variant="ghost"
          size="icon"
          onclick={togglePlay}
        >
          {#if paused}
            <Play class="size-5" />
          {:else}
            <Pause class="size-5" />
          {/if}
        </Button>

        <Button
          class="hidden md:flex shrink-0"
          variant="ghost"
          size="icon"
          onclick={toggleMute}
        >
          {#if muted}
            <VolumeX class="size-5" />
          {:else}
            <Volume2 class="size-5" />
          {/if}
        </Button>
      </div>

      <div class="grow flex gap-6 items-center">
        <span class="hidden sm:block">{formatTime(currentTime)}</span>
        <DurationSlider
          {duration}
          bind:startTime
          bind:endTime
          bind:currentTime
        />
        <span class="hidden sm:block">{formatTime(duration)}</span>
      </div>

      <div class="shrink-0 flex gap-1">
        <Button variant="ghost" size="icon"><Ellipsis class="size-5" /></Button>
        <Button variant="ghost" size="icon"><Save class="size-5" /></Button>
      </div>
    </div>
  </div>
</div>
