<script lang="ts">
  import Dropzone from "$lib/Dropzone.svelte";
  import Video from "$lib/Video.svelte";

  let file = $state("");
</script>

<main>
  {#if file}
    <Video {file} />
  {:else}
    <Dropzone
      selectFile={(newFile) => {
        file = newFile;
      }}
    />
  {/if}
</main>
