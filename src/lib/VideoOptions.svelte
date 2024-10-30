<script lang="ts">
  import Label from "./components/ui/label/label.svelte";
  import Separator from "./components/ui/separator/separator.svelte";
  import Switch from "./components/ui/switch/switch.svelte";
  import { videoOptions } from "./VideoOptionsStore.svelte";
  import * as Tabs from "./components/ui/tabs";
</script>

<div class="flex flex-col gap-4">
  <div class="flex flex-col gap-2">
    <Label>Resolution</Label>
    <Tabs.Root bind:value={videoOptions.config.resolution}>
      <Tabs.List class="grid w-full grid-cols-4">
        <Tabs.Trigger value="Original">Original</Tabs.Trigger>
        <Tabs.Trigger value="1080">1080</Tabs.Trigger>
        <Tabs.Trigger value="720">720</Tabs.Trigger>
        <Tabs.Trigger value="480">480</Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  </div>

  <Separator />

  <div class="flex flex-col gap-2">
    <Label>Frame Rate</Label>
    <Tabs.Root bind:value={videoOptions.config.frameRate}>
      <Tabs.List class="grid w-full grid-cols-4">
        <Tabs.Trigger value="Original">Original</Tabs.Trigger>
        <Tabs.Trigger value="144">144</Tabs.Trigger>
        <Tabs.Trigger value="60">60</Tabs.Trigger>
        <Tabs.Trigger value="30">30</Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  </div>

  <Separator />

  <div class="flex items-center gap-2">
    <Switch id="openFolder" bind:checked={videoOptions.config.openFolder} />
    <Label for="openFolder">Open folder when finished</Label>
  </div>
</div>
