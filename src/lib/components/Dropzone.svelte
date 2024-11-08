<script lang="ts">
  import { cn } from "$lib/utils";
  import { getCurrentWebview } from "@tauri-apps/api/webview";
  import { open } from "@tauri-apps/plugin-dialog";
  import Upload from "lucide-svelte/icons/upload";
  import { onDestroy } from "svelte";
  import Button from "./ui/button/button.svelte";

  let { selectFile }: { selectFile: (file: string) => void } = $props();

  let dragging = $state(false);
  let error = $state("");

  const unlisten = getCurrentWebview().onDragDropEvent((event) => {
    if (event.payload.type === "enter") {
      dragging = true;
      if (event.payload.paths.length > 1) error = "Only one video file allowed";
    } else if (event.payload.type === "drop") {
      dragging = false;
      if (event.payload.paths.length > 1) {
        error = "Only one video file allowed";
        setTimeout(() => {
          error = "";
        }, 1000);
      } else {
        selectFile(event.payload.paths[0]);
      }
    } else if (event.payload.type === "leave") {
      error = "";
      dragging = false;
    }
  });

  onDestroy(() => {
    unlisten.then((fn) => fn());
  });
</script>

<div class="w-full h-screen flex items-center justify-center">
  <div
    class={cn(
      "w-full max-w-md p-8 text-center border-2 border-dashed rounded-lg transition-colors duration-300 ease-in-out shadow-lg",
      dragging && !error
        ? "border-primary bg-primary/10"
        : "border-ring bg-background/20",
      error && "border-destructive bg-destructive/50"
    )}
  >
    <Upload class="mx-auto text-secondary-foreground w-12 h-12 mb-4" />
    <h2 class="text-xl font-semibold mb-2">
      {#if error}
        {error}
      {:else}
        Drop your video here
      {/if}
    </h2>
    <p class="text-sm text-muted-foreground mb-4">or click to select files</p>
    <input type="file" id="fileInput" class="sr-only" />
    <label for="fileInput">
      <Button
        onclick={() => {
          open({
            multiple: false,
            filters: [
              {
                name: "Videos",
                extensions: ["mp4", "avi", "mov", "mkv", "flv"],
              },
            ],
          }).then((file) => {
            if (file) selectFile(file);
          });
        }}>Select Files</Button
      >
    </label>
  </div>
</div>
