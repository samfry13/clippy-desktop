<script lang="ts">
  import { VideoFrameRate, VideoResolution, VideoType } from "$lib/constants";
  import { videoOptions } from "$lib/VideoOptionsStore.svelte";
  import Label from "./ui/label/label.svelte";
  import Separator from "./ui/separator/separator.svelte";
  import Switch from "./ui/switch/switch.svelte";
  import * as Tabs from "./ui/tabs";
</script>

<div class="flex flex-col gap-4">
  <Tabs.Root bind:value={videoOptions.config.type}>
    <Tabs.List class="grid w-full grid-cols-2">
      <Tabs.Trigger value={VideoType.Video}>Video</Tabs.Trigger>
      <Tabs.Trigger value={VideoType.Gif}>GIF</Tabs.Trigger>
    </Tabs.List>
  </Tabs.Root>

  {#if videoOptions.config.type === VideoType.Gif}
    <div class="flex items-center gap-2">
      <Switch id="gifLoop" bind:checked={videoOptions.config.loop} />
      <Label for="gifLoop">Loop GIF</Label>
    </div>
  {/if}

  <Separator />

  <div class="flex flex-col gap-2">
    <Label>Resolution</Label>
    <Tabs.Root bind:value={videoOptions.config.resolution}>
      <Tabs.List class="grid w-full grid-cols-4">
        <Tabs.Trigger value={VideoResolution.Original}>Original</Tabs.Trigger>
        <Tabs.Trigger value={VideoResolution[1080]}>1080</Tabs.Trigger>
        <Tabs.Trigger value={VideoResolution[720]}>720</Tabs.Trigger>
        <Tabs.Trigger value={VideoResolution[480]}>480</Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  </div>

  <Separator />

  <div class="flex flex-col gap-2">
    <Label>Frame Rate</Label>
    <Tabs.Root bind:value={videoOptions.config.frameRate}>
      <Tabs.List class="grid w-full grid-cols-5">
        <Tabs.Trigger value={VideoFrameRate.Original}>Original</Tabs.Trigger>
        <Tabs.Trigger value={VideoFrameRate[144]}>144</Tabs.Trigger>
        <Tabs.Trigger value={VideoFrameRate[60]}>60</Tabs.Trigger>
        <Tabs.Trigger value={VideoFrameRate[30]}>30</Tabs.Trigger>
        <Tabs.Trigger value={VideoFrameRate[15]}>15</Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  </div>

  <Separator />

  <div class="flex flex-col gap-2">
    <Label>Quality</Label>
    <input
      type="range"
      step={1}
      min={0}
      max={6}
      bind:value={videoOptions.config.quality}
    />
    <div class="flex items-center justify-between text-xs">
      <span>Lowest</span>
      <span>Balanced</span>
      <span>Original</span>
    </div>
  </div>

  <Separator />

  <div class="flex items-center gap-2">
    <Switch id="openFolder" bind:checked={videoOptions.config.openFolder} />
    <Label for="openFolder">Open folder when finished</Label>
  </div>
</div>
