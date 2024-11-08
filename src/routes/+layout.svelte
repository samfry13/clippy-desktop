<script>
  import { Toaster } from "$lib/components/ui/sonner";
  import { ModeWatcher } from "mode-watcher";
  import "../app.css";
  let { children } = $props();
</script>

<Toaster position="top-right" />

<ModeWatcher />

{@render children?.()}
