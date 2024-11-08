<script lang="ts">
  import Dropzone from "$lib/components/Dropzone.svelte";
  import Video from "$lib/components/Video.svelte";
  import VideoProcessor from "$lib/components/VideoProcessor.svelte";
  import { VideoType } from "$lib/constants";
  import { videoOptions } from "$lib/VideoOptionsStore.svelte";
  import { invoke } from "@tauri-apps/api/core";
  import { getCurrentWindow } from "@tauri-apps/api/window";
  import { getMatches } from "@tauri-apps/plugin-cli";
  import { open, save } from "@tauri-apps/plugin-dialog";
  import { setMode } from "mode-watcher";
  import { onMount } from "svelte";
  import { toast } from "svelte-sonner";

  let file = $state("");
  let outputFile = $state("");

  onMount(() => {
    getMatches().then(({ args }) => {
      const path = args.file.value;
      if (typeof path === "string") {
        invoke("allow_file", { path }).then(() => {
          file = path;
        });
      }
    });

    const currentWindow = getCurrentWindow();
    currentWindow.theme().then((theme) => setMode(theme ?? "system"));
    currentWindow.onThemeChanged(({ payload: theme }) => setMode(theme));
  });

  const onSave = () => {
    if (!file) return;

    const newPath = file.split(".");
    newPath.pop();

    save({
      defaultPath: `${newPath.join(".")} - Clip`,
      title: "Output File",
      filters: [
        videoOptions.config.type === VideoType.Gif
          ? {
              name: "GIF",
              extensions: ["gif"],
            }
          : {
              name: "Video",
              extensions: ["mp4", "avi", "mov", "mkv", "flv"],
            },
      ],
    }).then((newFile) => {
      if (!newFile) {
        return toast.error("Error: Could not save file");
      }
      if (newFile === file) {
        return toast.error("Error: Cannot save to the same file");
      }

      outputFile = newFile;
    });
  };
</script>

<svelte:window
  onkeydown={(e) => {
    if (e.ctrlKey && e.key === "o") {
      open({
        multiple: false,
        filters: [
          {
            name: "Videos",
            extensions: ["mp4", "avi", "mov", "mkv", "flv"],
          },
        ],
      }).then((newFile) => {
        if (newFile) {
          file = newFile;
          videoOptions.reset();
        }
      });
    }

    if (e.ctrlKey && e.key === "s") {
      onSave();
    }
  }}
/>

<main>
  {#if file}
    {#key file}
      <Video {file} {onSave} />
    {/key}
  {:else}
    <Dropzone
      selectFile={(newFile) => {
        file = newFile;
      }}
    />
  {/if}

  {#if outputFile}
    <VideoProcessor
      {file}
      {outputFile}
      onComplete={() => {
        outputFile = "";
      }}
      onError={(reason) => {
        toast.error(`Error: ${reason}`);
        outputFile = "";
      }}
    />
  {/if}
</main>
