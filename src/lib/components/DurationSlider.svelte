<script lang="ts">
  import { Slider as SliderPrimitive } from "bits-ui";
  export let value: [number, number, number];
</script>

<SliderPrimitive.Root
  class="relative flex w-full touch-none select-none items-center"
  bind:value
  let:thumbs
>
  <span
    class="bg-secondary relative h-2 w-full grow overflow-hidden rounded-full"
  >
    <SliderPrimitive.Range class="bg-primary absolute h-full" />
  </span>

  {#each thumbs as thumb, i}
    <SliderPrimitive.Thumb
      {thumb}
      class="border-primary bg-background ring-offset-background focus-visible:ring-ring block h-5 w-5 rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    />
  {/each}
</SliderPrimitive.Root>
