<script lang="ts">
  import Dropzone from "$lib/Dropzone.svelte";
  import Video from "$lib/Video.svelte";
  import VideoProcessor from "$lib/VideoProcessor.svelte";
  import { invoke } from "@tauri-apps/api/core";
  import { getMatches } from "@tauri-apps/plugin-cli";
  import { save } from "@tauri-apps/plugin-dialog";
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
  });
</script>

<main>
  {#if file}
    <Video
      {file}
      onSave={() => {
        const newPath = file.split(".");
        newPath.pop();

        save({
          defaultPath: `${newPath.join(".")} - Clip`,
          title: "Output File",
          filters: [
            {
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
      }}
    />
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
