<script lang="ts">
  import Dropzone from "$lib/Dropzone.svelte";
  import Video from "$lib/Video.svelte";
  import VideoProcessor from "$lib/VideoProcessor.svelte";
  import { save } from "@tauri-apps/plugin-dialog";
  import { toast } from "svelte-sonner";

  let file = $state("");
  let outputFile = $state("");
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
