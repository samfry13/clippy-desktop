<script lang="ts">
  import Dropzone from "$lib/Dropzone.svelte";
  import Video from "$lib/Video.svelte";
  import VideoProcessor from "$lib/VideoProcessor.svelte";
  import { save } from "@tauri-apps/plugin-dialog";
  import { toast } from "svelte-sonner";

  let file = $state("");
  let outputFile = $state("");
  let error = $state("");
</script>

<main>
  {#if file}
    <Video
      {file}
      onSave={() =>
        save({
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
        })}
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
        error = reason;
        outputFile = "";
      }}
    />
  {/if}

  {#if error}
    <div class="h-screen w-screen absolute inset-0">
      {error}
    </div>
  {/if}
</main>
