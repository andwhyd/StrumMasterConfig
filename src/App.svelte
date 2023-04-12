<script>
  // Header
  import Header from "./lib/header/Header.svelte";

  // Modes
  import { modes } from "./store.js";
  import { selMode } from "./store.js";

  // Bluetooth Stuff
  import BluetoothTerminal from "./lib/js/BluetoothTerminal";
  const StrumMaster = new BluetoothTerminal();
  let connected = false;
  let deviceName = "Unconnected";
  let lastRecieved = "";
  $: if (StrumMaster.device === null) {
    connected = false;
  }
  StrumMaster.receive = (data) => {
    lastRecieved = data;
    console.log(data);
  };
  const checkInterval = 100; //ms
  const timeOut = 500; //ms
  const waitForMessage = (message, totalTime) => {
    if (lastRecieved === message) {
      return true;
    } else if (totalTime > timeOut) {
      return false;
    } else {
      setTimeout(
        waitForMessage,
        checkInterval,
        message,
        (totalTime += checkInterval)
      );
    }
  };
  $: $selMode, setMode();
  const setMode = async () => {
    if (connected) {
      await StrumMaster.send($selMode.command);
    }
  };
  const connectBluetooth = async () => {
    if (connected) {
      StrumMaster.disconnect();
      connected = false;
      deviceName = "Unconnected";
    } else {
      await StrumMaster.connect()
        .then(async () => {
          deviceName = StrumMaster.getDeviceName()
            ? StrumMaster.getDeviceName()
            : StrumMaster.defaultDeviceName;
          await StrumMaster.send("CONNECTING");
          await setMode();
          connected = true;
        })
        .catch((error) => console.log(error));
    }
  };
  const applyConfig = async () => {
    await StrumMaster.send(modes.configuring.command);
    await StrumMaster.send(JSON.stringify($currentConfig));
    await setMode();
  };

  // Live play
  const livePlay = async (event) => {
    console.log("LIVE:" + event.detail.id.toString().padStart(2, "0"));
    if (connected) {
      await StrumMaster.send(
        "LIVE:" + event.detail.id.toString().padStart(2, "0")
      );
    }
  };

  // Intial alert
  import IntialAlert from "./lib/InitialAlert.svelte";

  // Input card
  import InputCard from "./lib/InputCard.svelte";
  import { slide } from "svelte/transition";
  import { flip } from "svelte/animate";
  const anim_options = { delay: 50, duration: 100 };

  // Settings Modal
  import Settings from "./lib/modals/Settings.svelte";
  let showSettings = false;

  // Tutorial Modal
  import Tutorial from "./lib/modals/Tutorial.svelte";
  let showTutorial = false;

  // Presets
  import Presets from "./lib/modals/Presets.svelte";
  let showPresets = false;

  // Current Config
  import { currentConfig } from "./store.js";
</script>

<main>
  <Header
    {connected}
    {deviceName}
    on:connect={connectBluetooth}
    on:apply={applyConfig}
    on:settings={() => {
      showSettings = true;
    }}
    on:tutorial={() => {
      showTutorial = true;
    }}
    on:presets={() => {
      showPresets = true;
    }}
  />
  <IntialAlert />

  <div class="input_card_holder" transition:slide={anim_options}>
    {#each { length: $currentConfig.buttonNum } as _, j (j)}
      <div animate:flip={{ duration: anim_options.delay }}>
        <InputCard idx={j} on:livePlay={livePlay} />
      </div>
    {/each}
  </div>
</main>

<Settings bind:showSettings />
<Tutorial bind:showTutorial />
<Presets bind:showPresets />

<style>
  .input_card_holder {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 0.1rem;
  }
</style>
