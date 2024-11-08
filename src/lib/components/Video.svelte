<script lang="ts">
  import {
    CONFIG_STORAGE_KEY,
    VideoFrameRate,
    VideoResolution,
    VideoType,
  } from "$lib/constants";
  import { formatTime } from "$lib/utils";
  import { videoOptions } from "$lib/VideoOptionsStore.svelte";
  import { convertFileSrc } from "@tauri-apps/api/core";
  import Ellipsis from "lucide-svelte/icons/ellipsis";
  import Pause from "lucide-svelte/icons/pause";
  import Play from "lucide-svelte/icons/play";
  import Save from "lucide-svelte/icons/save";
  import Volume2 from "lucide-svelte/icons/volume-2";
  import VolumeX from "lucide-svelte/icons/volume-x";
  import { onMount } from "svelte";
  import DurationSlider from "./DurationSlider.svelte";
  import Button, { buttonVariants } from "./ui/button/button.svelte";
  import * as Popover from "./ui/popover";
  import VideoOptions from "./VideoOptions.svelte";

  const { file, onSave }: { file: string; onSave: () => void } = $props();
  const assetUrl = convertFileSrc(file);

  let video: HTMLVideoElement;

  let paused = $state(false);
  const togglePlay = () => {
    if (currentTime >= videoOptions.endTime)
      currentTime = videoOptions.startTime;
    if (videoOptions.endTime - videoOptions.startTime <= 0) return;
    paused ? video.play() : video.pause();
  };

  let muted = $state(false);
  const toggleMute = () => (muted = !muted);

  let duration = $state(0);
  let currentTime = $state(0);

  $effect(() => {
    // these are just here to make sure the effect gets triggered
    // whenever start time or end time changes
    videoOptions.startTime;
    videoOptions.endTime;
    paused = true;
  });

  const onProgress = () => {
    if (currentTime >= videoOptions.endTime) {
      currentTime = videoOptions.endTime;
      paused = true;
    }
  };
  const onLoadedMetadata = () => {
    videoOptions.endTime = duration;
    videoOptions.startTime = 0;
    currentTime = 0;
  };

  onMount(() => {
    const savedConfig = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (!savedConfig) return;

    try {
      const parsedConfig = JSON.parse(savedConfig);
      if (typeof parsedConfig !== "object") return;

      if (
        typeof parsedConfig.type === "string" &&
        Object.keys(VideoType).includes(parsedConfig.type)
      )
        videoOptions.config.type = parsedConfig.type;
      if (
        typeof parsedConfig.resolution === "string" &&
        Object.keys(VideoResolution).includes(parsedConfig.resolution)
      )
        videoOptions.config.resolution = parsedConfig.resolution;
      if (
        typeof parsedConfig.frameRate === "string" &&
        Object.keys(VideoFrameRate).includes(parsedConfig.frameRate)
      )
        videoOptions.config.frameRate = parsedConfig.frameRate;
      if (
        typeof parsedConfig.quality === "number" &&
        parsedConfig.quality <= 6 &&
        parsedConfig.quality >= 0
      )
        videoOptions.config.quality = parsedConfig.quality;
      if (typeof parsedConfig.loop === "boolean")
        videoOptions.config.loop = parsedConfig.loop;
      if (typeof parsedConfig.openFolder === "boolean")
        videoOptions.config.openFolder = parsedConfig.openFolder;
    } catch (e) {
      console.error(`Error parsing config: ${e}`);
    }
  });

  $effect(() => {
    localStorage.setItem(
      CONFIG_STORAGE_KEY,
      JSON.stringify(videoOptions.config)
    );
  });
</script>

<svelte:window
  onkeydown={(e) => {
    if (e.altKey || e.ctrlKey || e.shiftKey) return;

    if (e.key === " " || e.key === "k") {
      togglePlay();
    }
    if (e.key === "m") {
      toggleMute();
    }
  }}
/>

<div class="w-full h-screen flex flex-col">
  <div
    class="shrink-0 basis-0 grow p-4 min-h-28 flex items-center justify-center"
  >
    <!-- svelte-ignore a11y_media_has_caption -->
    <video
      class="max-h-full max-w-full shadow-lg"
      bind:this={video}
      bind:paused
      bind:muted
      bind:duration
      bind:currentTime
      ontimeupdate={onProgress}
      onloadedmetadata={onLoadedMetadata}
    >
      <source src={assetUrl} />
      Your browser does not support the video tag.
    </video>
  </div>

  <div class="p-4 mx-auto w-2/3 max-w-3xl space-y-6 select-none">
    <div
      class="text-secondary-foreground border border-secondary w-fit mx-auto py-1 px-3 rounded-md bg-secondary/50"
    >
      {formatTime(videoOptions.endTime - videoOptions.startTime, true)}
    </div>

    <div
      class="flex items-center gap-4 sm:gap-2 mb-2 text-secondary-foreground text-sm w-full justify-center border border-secondary p-1 rounded-md bg-secondary/50"
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
          bind:startTime={videoOptions.startTime}
          bind:endTime={videoOptions.endTime}
          bind:currentTime
        />
        <span class="hidden sm:block">{formatTime(duration)}</span>
      </div>

      <div class="shrink-0 flex gap-1">
        <Popover.Root>
          <Popover.Trigger
            class={buttonVariants({ variant: "ghost", size: "icon" })}
          >
            <Ellipsis class="size-5" />
          </Popover.Trigger>
          <Popover.Content class="w-fit"><VideoOptions /></Popover.Content>
        </Popover.Root>
        <Button variant="ghost" size="icon" onclick={onSave}>
          <Save class="size-5" />
        </Button>
      </div>
    </div>
  </div>
</div>
