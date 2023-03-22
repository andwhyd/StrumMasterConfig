// Based on: https://github.com/loginov-rocks/Web-Bluetooth-Terminal/blob/master/js/main.js

// UI elements.
const deviceName = document.getElementById("deviceName");
const statusAlert = document.getElementById("statusAlert");
const connectButton = document.getElementById("connectButton");
const settingsButton = document.getElementById("settingsButton");
const applyButton = document.getElementById("applyButton");
const dropdownButton = document.getElementById("dropdownButton");
const savePresetForm = document.getElementById("savePresetForm");
const navbarDropdownMenu = document.getElementById("navbarDropdownMenu");
const cardHolder = document.getElementById("cardHolder")
const cardToClone = document.getElementById("cardToClone")
const configAppliedToast = document.getElementById('configAppliedToast')


// Helpers.
const defaultDeviceName = "Terminal";
var inputCardNum = 6;
var currentConfigArray = new Array(inputCardNum).fill(0);

// Obtain configured instance.
const terminal = new BluetoothTerminal();

// Draw input cards
cardToClone.removeAttribute("id");
for (j = 1; j < inputCardNum; j++) {
    var cardCol;
    var checkButtons;
    cardCol = cardToClone.cloneNode(true);
    cardCol.children[0].children[0].children[0].textContent = "Input " + (j + 1)
    cardCol.children[0].children[1].children[0].id = "action_B" + (j + 1);
    checkButtons = cardCol.children[0].children[1].children[1].children;
    for (k = 0; k < checkButtons.length; k++) {
        checkButtons[k].children[0].id = checkButtons[k].children[0].id.replace(/.$/, j + 1);
        checkButtons[k].children[1].setAttribute("for", checkButtons[k].children[1].getAttribute("for").replace(/.$/, j + 1));
    }
    cardHolder.appendChild(cardCol);
}
// Populate current config
readConfig();

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
                settingsButton.removeAttribute("disabled");
                applyButton.removeAttribute("disabled");
                dropdownButton.removeAttribute("disabled");
            });
    } else if (connectButton.textContent === "Disconnect") {
        terminal.disconnect();
        deviceName.textContent = "Unconnected"
        statusAlert.setAttribute("class", "badge bg-warning text-wrap");
        connectButton.textContent = "Connect"
        connectButton.className = "btn btn-outline-success btn-lg me-2";
        settingsButton.setAttribute("disabled", "");
        applyButton.setAttribute("disabled", "");
        dropdownButton.setAttribute("disabled", "");
        if (navbarDropdownMenu.getAttribute("class") === "dropdown-menu show") {
            dropdownButton.className = "btn btn-outline-light btn-lg dropdown-toggle dropdown-toggle-split";
            navbarDropdownMenu.className = "dropdown-menu";
        }

    }
});

// Read current configs function
function readConfig() {
    var configs;
    var action;
    var checkButtons;
    var stringBool;
    for (j = 0; j < inputCardNum; j++) {
        var configInt = 0;
        configs = cardHolder.children[j].children[0].children[1];
        action = configs.children[0].value;
        checkButtons = configs.children[1].children;
        for (k = 0; k < checkButtons.length; k++) {
            stringBool = checkButtons[k].children[0].checked === true ? 1 : 0;
            configInt += stringBool << k;
        }
        configInt += action << 6;
        currentConfigArray[j] = configInt;
    }
}

// Apply config function
applyButton.addEventListener("click", () => {
    var configJson = "{";
    readConfig();
    for (j = 0; j < inputCardNum; j++) {
        configJson += "\"" + j + "\"" + ":" + currentConfigArray[j] + ",";
    }
    configJson = configJson.replace(/.$/, "}");
    console.log(configJson);
    terminal.send(configJson).then(() => {
        const toast = new bootstrap.Toast(configAppliedToast)
        toast.show()
    });
});

// Save config function
savePresetForm.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log(event.target[0].value);
});