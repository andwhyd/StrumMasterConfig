// Based on: https://github.com/loginov-rocks/Web-Bluetooth-Terminal/blob/master/js/main.js

// UI elements.
// Bluetooth and status elements
const deviceName = document.getElementById("deviceName");
const statusAlert = document.getElementById("statusAlert");
const connectButton = document.getElementById("connectButton");
const applyButton = document.getElementById("applyButton");
const settingsButton = document.getElementById("settingsButton")
// Preset elements
const savePresetForm = document.getElementById("savePresetForm");
const managePresetsButton = document.getElementById("managePresetsButton");
const presetListGroup = document.getElementById("presetListGroup");
const presetToClone = document.getElementById("presetToClone");
const loadPresetButton = document.getElementById("loadPresetButton");
const deletePresetsButton = document.getElementById("deletePresetsButton");
const dlPresetsButton = document.getElementById("dlPresetsButton");
const dlAnchorElem = document.getElementById("dlAnchorElem");
const ulPresetsButton = document.getElementById("ulPresetsButton");
const ulAnchorElem = document.getElementById("ulAnchorElem");
// Setting elements
const buttonNumSlider = document.getElementById("buttonNumSlider");
const saveSettingsButton = document.getElementById("saveSettingsButton");
// Alert elements
const firstAlert = document.getElementById("firstAlert");
const alertCloseButton = document.getElementById("alertCloseButton");
// Input elements
const cardHolder = document.getElementById("cardHolder");
const cardToClone = document.getElementById("cardToClone");
// Toast elements
const configAppliedToast = document.getElementById("configAppliedToast");
// Tutorial navigation elements
const tutorialPrevButton = document.getElementById("tutorialPrevButton");
const tutorialNextButton = document.getElementById("tutorialNextButton");
const tutorialNavTabs = document.getElementById("tutorialNavTabs");
// Dev elements
const devButton = document.getElementById("devButton");
devButton.addEventListener("click", () => {
    localStorage.clear()
});

// Helpers.
const defaultDeviceName = "Terminal";
let alertDismissed = localStorage.getItem("alertDismissed");
let currentConfigJson = {
    "buttonNum": 6,
    "buttonConfig": [0, 0, 0, 0, 0, 0],
}
let savedPresets = localStorage.getItem("savedPresets");
const savedConfigString = localStorage.getItem("savedConfigString");

// Obtain configured instance.
const terminal = new BluetoothTerminal();

// Alert status
if (alertDismissed === null) {
    firstAlert.removeAttribute("hidden");
}
alertCloseButton.addEventListener("click", () => {
    localStorage.setItem("alertDismissed", true);
});

// Draw input cards
cardToClone.removeAttribute("id");
function drawInputCards() {
    cardHolder.innerHTML = cardToClone.outerHTML;
    for (j = 1; j < currentConfigJson.buttonNum; j++) {
        let cardCol = cardToClone.cloneNode(true);
        let checkButtons;
        cardCol.children[0].children[0].children[0].textContent = "Input " + (j + 1)
        cardCol.children[0].children[1].children[0].id = "action_B" + (j + 1);
        checkButtons = cardCol.children[0].children[1].children[1].children;
        for (k = 0; k < checkButtons.length; k++) {
            checkButtons[k].children[0].id = checkButtons[k].children[0].id.replace(/.$/, j + 1);
            checkButtons[k].children[1].setAttribute("for", checkButtons[k].children[1].getAttribute("for").replace(/.$/, j + 1));
        }
        cardHolder.appendChild(cardCol);
    }
}
drawInputCards();
// Populate current config
if (savedConfigString === null) {
    writeCurrentConfig(JSON.stringify(currentConfigJson));
} else {
    writeCurrentConfig(savedConfigString);
}

// Override `receive` method to log incoming data to the terminal.
terminal.receive = function (data) {
    logToTerminal(data, "in");
};
const logToTerminal = (message, type = "") => {
    console.log(message);
};

// Connect/Disconnect function
connectButton.addEventListener("click", () => {
    if (connectButton.textContent === "Connect") {
        terminal.connect().
            then(() => {
                deviceName.textContent = terminal.getDeviceName() ?
                    terminal.getDeviceName() : defaultDeviceName;
                statusAlert.className = "badge bg-success text-wrap";
                connectButton.textContent = "Disconnect"
                connectButton.className = "btn btn-outline-danger btn-lg me-2";
                terminal.send("Connecting");
                applyButton.removeAttribute("disabled");
            });
    } else if (connectButton.textContent === "Disconnect") {
        terminal.disconnect();
        deviceName.textContent = "Unconnected"
        statusAlert.setAttribute("class", "badge bg-warning text-wrap");
        connectButton.textContent = "Connect"
        connectButton.className = "btn btn-outline-success btn-lg me-2";
        applyButton.setAttribute("disabled", "");
    }
});

// Read current configs function
function readCurrentConfig() {
    let configs;
    let action;
    let checkButtons;
    let stringBool;
    currentConfigJson.buttonConfig = [];
    for (j = 0; j < currentConfigJson.buttonNum; j++) {
        let configInt = 0;
        configs = cardHolder.children[j].children[0].children[1];
        action = configs.children[0].value;
        checkButtons = configs.children[1].children;
        for (k = 0; k < checkButtons.length; k++) {
            stringBool = checkButtons[k].children[0].checked === true ? 1 : 0;
            configInt += stringBool << k;
        }
        configInt += action << 6;
        currentConfigJson.buttonConfig[j] = configInt;
    }
    localStorage.setItem("savedConfigString", JSON.stringify(currentConfigJson));
}
// Write configs from json function
function writeCurrentConfig(configJsonString) {
    let configs;
    let checkButtons;
    let configJson = JSON.parse(configJsonString);
    currentConfigJson.buttonNum = configJson.buttonNum;
    currentConfigJson.buttonConfig = configJson.buttonConfig;
    drawInputCards();
    for (j = 0; j < currentConfigJson.buttonNum; j++) {
        let configInt = currentConfigJson.buttonConfig[j];
        if (configInt < 0 || configInt > 255) {
            console.error("Config code error");
            return;
        }
        configs = cardHolder.children[j].children[0].children[1];
        configs.children[0].value = configInt >> 6 & 0b11;
        checkButtons = configs.children[1].children;
        for (k = 0; k < checkButtons.length; k++) {
            checkButtons[k].children[0].checked = configInt >> k & 0b1;
        }
    }
    localStorage.setItem("savedConfigString", JSON.stringify(currentConfigJson));
}

// Apply config function
applyButton.addEventListener("click", () => {
    readCurrentConfig();
    let configJson = JSON.stringify(currentConfigJson);
    terminal.send(configJson).then(() => {
        const toast = new bootstrap.Toast(configAppliedToast)
        toast.show()
    });
});

// Save config function
savePresetForm.addEventListener("submit", (event) => {
    let alreadNamed = false
    event.preventDefault();
    presetName = event.target[0].value;
    savedPresets = JSON.parse(localStorage.getItem("savedPresets"));
    readCurrentConfig();
    if (savedPresets === null) {
        savedPresets = [];
    }
    for (j = 0; j < savedPresets.length; j++) {
        if (savedPresets[j].name === presetName) {
            savedPresets[j] = {
                "name": presetName,
                "preset": JSON.stringify(currentConfigJson),
            }
            alreadNamed = true;
            break;
        }
    }
    if (alreadNamed == false) {
        savedPresets.push({
            "name": presetName,
            "preset": JSON.stringify(currentConfigJson),
        });
    }
    localStorage.setItem("savedPresets", JSON.stringify(savedPresets));
});

// View presets function
presetToClone.removeAttribute("id");
function drawPresets() {
    savedPresets = JSON.parse(localStorage.getItem("savedPresets"));
    presetListGroup.innerHTML = presetToClone.outerHTML;
    if (savedPresets !== null) {
        for (j = 0; j < savedPresets.length; j++) {
            let presetItem = presetToClone.cloneNode(true);
            presetItem.children[0].children[0].id = presetItem.children[0].children[0].id.replace(/.$/, j + 1);
            presetItem.children[0].children[1].htmlFor = presetItem.children[0].children[1].htmlFor.replace(/.$/, j + 1);
            presetItem.children[0].children[1].textContent = savedPresets[j].name;
            presetItem.children[1].textContent = savedPresets[j].preset;
            presetListGroup.appendChild(presetItem);
        }
    }
}
managePresetsButton.addEventListener("click", () => {
    drawPresets();
});
// Load selected presets function
loadPresetButton.addEventListener("click", () => {
    let presetRadios = presetListGroup.getElementsByClassName("form-check-input me-1");
    let presetConfigs = presetListGroup.getElementsByClassName("preset-config");
    for (j = 0; j < presetRadios.length; j++) {
        if (presetRadios[j].checked == true) {
            writeCurrentConfig(presetConfigs[j].textContent);
            break;
        }
    }
});
// Delete selected presets function
deletePresetsButton.addEventListener("click", () => {
    let presetRadios = presetListGroup.getElementsByClassName("form-check-input me-1");
    for (j = 0; j < presetRadios.length; j++) {
        if (presetRadios[j].checked == true) {
            savedPresets.splice(j - 1, 1);
            localStorage.setItem("savedPresets", JSON.stringify(savedPresets));
            drawPresets();
            break;
        }
    }
});
// Download presets function as file
dlPresetsButton.addEventListener("click", () => {
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedPresets));
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "presets.json");
    dlAnchorElem.click();
});
// Upload presets function as file
ulPresetsButton.addEventListener("click", () => {
    ulAnchorElem.click();
});
ulAnchorElem.addEventListener("change", (event) => {
    let reader = new FileReader();
    reader.onload = function (e) {
        savedPresets = JSON.parse(e.target.result);
        localStorage.setItem("savedPresets", JSON.stringify(savedPresets));
        drawPresets();
    };
    reader.readAsBinaryString(event.target.files[0]);
});

// Settings viewer
settingsButton.addEventListener("click", () => {
    buttonNumSlider.value = currentConfigJson.buttonNum;
    buttonNumSlider.previousElementSibling.value = buttonNumSlider.value;
});
// Save settings
saveSettingsButton.addEventListener("click", () => {
    currentConfigJson.buttonNum = buttonNumSlider.value;
    drawInputCards();
});

// Tutorial tab navigation
function getCurrentTab() {
    let listElement = tutorialNavTabs.children;
    for (j = 1; j < listElement.length - 1; j++) {
        if (listElement[j].children[0].className === "page-link active") {
            return listElement[j].children[0].parentElement
        }
    }
}
tutorialPrevButton.addEventListener("click", () => {
    let targetButton = getCurrentTab().previousElementSibling
    targetButton.children[0].click();
});
tutorialNextButton.addEventListener("click", () => {
    let targetButton = getCurrentTab().nextElementSibling
    targetButton.children[0].click();
});