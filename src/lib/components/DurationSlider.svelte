<script lang="ts">
  let {
    duration,
    gap = 0,
    startTime = $bindable(0),
    currentTime = $bindable(0),
    endTime = $bindable(duration),
    step = 0.01,
  }: {
    duration: number;
    gap?: number;
    startTime?: number;
    currentTime?: number;
    endTime?: number;
    step?: number;
  } = $props();

  let startInput: HTMLInputElement;
  let currentInput: HTMLInputElement;
  let endInput: HTMLInputElement;

  const onCurrentInput = () => {
    const currentValue = parseFloat(currentInput.value);

    if (currentValue < startTime) {
      currentInput.value = startTime.toString();
      currentTime = startTime;
    } else if (currentValue > endTime) {
      currentInput.value = endTime.toString();
      currentTime = endTime;
    } else {
      currentTime = currentValue;
    }
  };
  const onStartInput = () => {
    const startValue = parseFloat(startInput.value);

    if (endTime - startValue <= gap) {
      startInput.value = (endTime - gap).toString();
      startTime = endTime - gap;
      currentInput.value = (endTime - gap).toString();
      currentTime = endTime - gap;
    } else {
      startTime = startValue;
      currentInput.value = startValue.toString();
      currentTime = startValue;
    }
  };
  const onEndInput = () => {
    const endValue = parseFloat(endInput.value);

    if (endValue - startTime <= gap) {
      endInput.value = (startTime + gap).toString();
      endTime = startTime + gap;
      currentInput.value = (startTime + gap).toString();
      currentTime = startTime + gap;
    } else {
      endTime = endValue;
      currentInput.value = endValue.toString();
      currentTime = endValue;
    }
  };
</script>

<svelte:window
  onkeydown={(e) => {
    if (e.altKey) return;

    // Start keybinds
    // CTRL + ArrowLeft/ArrowRight - move start by one step
    if (e.ctrlKey && !e.shiftKey && e.key === "ArrowLeft") {
      startInput.value = (parseFloat(startInput.value) - step).toString();
      onStartInput();
    }
    if (e.ctrlKey && !e.shiftKey && e.key === "ArrowRight") {
      startInput.value = (parseFloat(startInput.value) + step).toString();
      onStartInput();
    }
    if (e.ctrlKey && !e.shiftKey && e.key === " ") {
      startInput.value = currentInput.value;
      onStartInput();
    }

    // End keybinds
    // ALT + ArrowLeft/Right - move end by one step
    if (!e.ctrlKey && e.shiftKey && e.key === "ArrowLeft") {
      endInput.value = (parseFloat(endInput.value) - step).toString();
      onEndInput();
    }
    if (!e.ctrlKey && e.shiftKey && e.key === "ArrowRight") {
      endInput.value = (parseFloat(endInput.value) + step).toString();
      onEndInput();
    }
    if (!e.ctrlKey && e.shiftKey && e.key === " ") {
      endInput.value = currentInput.value;
      onEndInput();
    }

    if (e.ctrlKey || e.shiftKey) return;

    // Seek keybinds
    // ArrowLeft/ArrowRight - seek by 5 sec
    if (e.key === "ArrowLeft") {
      currentInput.value = (parseFloat(currentInput.value) - 5).toString();
      onCurrentInput();
    }
    if (e.key === "ArrowRight") {
      currentInput.value = (parseFloat(currentInput.value) + 5).toString();
      onCurrentInput();
    }

    // comma/period - seek by step
    if (e.key === ",") {
      currentInput.value = (parseFloat(currentInput.value) - step).toString();
      onCurrentInput();
    }
    if (e.key === ".") {
      currentInput.value = (parseFloat(currentInput.value) + step).toString();
      onCurrentInput();
    }

    // j/l - seek by 10 sec
    if (e.key === "j") {
      currentInput.value = (parseFloat(currentInput.value) - 10).toString();
      onCurrentInput();
    }
    if (e.key === "l") {
      currentInput.value = (parseFloat(currentInput.value) + 10).toString();
      onCurrentInput();
    }
  }}
/>

<div class="slider-container">
  <div
    class="slider-track"
    style={`
    --start-time: ${(startTime / duration) * 100}%;
    --end-time: ${(endTime / duration) * 100}%
  `}
  ></div>
  <input
    type="range"
    bind:this={currentInput}
    class="current-input"
    max={duration}
    min={0}
    {step}
    value={currentTime}
    oninput={onCurrentInput}
  />
  <div class="current-thumb-bar"></div>
  <input
    type="range"
    bind:this={startInput}
    class="start-input"
    max={duration}
    min={0}
    {step}
    value={startTime}
    oninput={onStartInput}
  />
  <input
    type="range"
    bind:this={endInput}
    class="end-input"
    max={duration}
    min={0}
    {step}
    value={endTime}
    oninput={onEndInput}
  />
</div>

<style>
  .slider-container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  input[type="range"] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 100%;
    outline: none;
    position: absolute;
    margin: auto;
    top: 0;
    bottom: 0;
    background-color: transparent;
    pointer-events: none;
  }

  .slider-track {
    width: 100%;
    height: 5px;
    position: absolute;
    margin: auto;
    top: 0;
    bottom: 0;
    border-radius: 5px;
    background: linear-gradient(
      to right,
      hsl(var(--primary) / 0.2) calc(var(--start-time) - 0.5rem),
      hsl(var(--primary) / 0.7) calc(var(--start-time) - 0.5rem),
      hsl(var(--primary) / 0.7) calc(var(--end-time) + 0.5rem),
      hsl(var(--primary) / 0.2) calc(var(--end-time) + 0.5rem)
    );
  }

  input[type="range"]::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    height: 5px;
  }
  input[type="range"]::-moz-range-track {
    -moz-appearance: none;
    height: 5px;
  }
  input[type="range"]::-ms-track {
    appearance: none;
    height: 5px;
  }

  .start-input::-webkit-slider-thumb,
  .end-input::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 1.5rem;
    width: 1rem;
    border: hsl(var(--primary)) 7px solid;
    background-color: hsl(var(--border));
    cursor: pointer;
    margin-top: -9px;
    pointer-events: auto;
    border-radius: 0.25rem;
  }

  .start-input::-webkit-slider-thumb {
    margin-left: -0.5rem;
  }

  .end-input::-webkit-slider-thumb {
    margin-right: -0.5rem;
    margin-left: 0.5rem;
  }

  .current-thumb-bar {
    position: absolute;
    width: 2px;
    height: 25px;
    background: hsl(var(--primary) / 0.7);
    top: anchor(--current-thumb bottom);
    left: anchor(--current-thumb center);
    margin-left: -1px;
  }

  .current-input::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 1rem;
    width: 1rem;
    background-color: hsl(var(--primary) / 0.7);
    border: hsl(var(--border)) 3px solid;
    cursor: pointer;
    margin-top: -40px;
    pointer-events: auto;
    border-radius: 9999px;
    anchor-name: --current-thumb;
  }
  .current-input::-webkit-slider-thumb:hover {
    border: hsl(var(--border)) 1px solid;
  }
</style>
