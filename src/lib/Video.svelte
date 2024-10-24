<script lang="ts">
  import { convertFileSrc } from "@tauri-apps/api/core";
  import Button from "./components/ui/button/button.svelte";
  import Play from "lucide-svelte/icons/play";
  import Pause from "lucide-svelte/icons/pause";
  import VolumeX from "lucide-svelte/icons/volume-x";
  import Volume2 from "lucide-svelte/icons/volume-2";
  import Ellipsis from "lucide-svelte/icons/ellipsis";
  import Save from "lucide-svelte/icons/save";
  import Slider from "./components/ui/slider/slider.svelte";

  const { file }: { file: string } = $props();
  const assetUrl = convertFileSrc(file);

  let video: HTMLVideoElement;

  let paused = $state(false);
  const togglePlay = () => (paused ? video.play() : video.pause());
  let muted = $state(false);
  const toggleMute = () => (muted = !muted);
  let duration = $state(0);

  let currentTime = $state(0);

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
  >
    <source src={assetUrl} />
    Your browser does not support the video tag.
  </video>

  <div class="p-4 mx-auto w-2/3 max-w-3xl space-y-6 select-none">
    <div
      class="text-primary-foreground border border-primary w-fit mx-auto py-1 px-3 rounded-md bg-primary/50"
    >
      {formatTime(duration, true)}
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

      <div class="grow flex gap-6">
        <span class="hidden sm:block">{formatTime(currentTime)}</span>
        <Slider
          class="flex-1"
          value={[currentTime]}
          max={duration}
          step={0.1}
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
