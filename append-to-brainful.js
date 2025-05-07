// Script to perform an append to block operation in brainful.

let credential = Credential.create("brainful", "brainful companion to perform actions on your brainful account.");
credential.addTextField("username", "Username");
credential.addPasswordField("password", "API Key");
credential.authorize();

// Endpoints subject to change - https://brainful.one/api
const BRAINFUL_ADD_URL = "https://brainful.one/my/blocks/append";
const VIEW_BLOCK_URL_BASE = "https://brainful.one/@{username}/{block_luid}";

// File path to store the last used identifier
const filePath = "/last_used_identifier.txt";
let fileManager = FileManager.createCloud();

// Retrieve the last used identifier if it exists
let lastUsedIdentifier = "";
if (fileManager.exists(filePath)) {
    lastUsedIdentifier = fileManager.readString(filePath);
}

// Prompt the user for the identifier, pre-filling with the last used identifier
let prompt = Prompt.create();
prompt.title = "Provide Block Identifier";
prompt.message = "Please enter the block identifier (luid, slug, or some text fragment) to append content to.";
prompt.addTextField("identifier", "Identifier", lastUsedIdentifier, { "placeholder": "Enter identifier here" });
prompt.addButton("OK");

if (prompt.show()) {
    let identifier = prompt.fieldValues["identifier"];
    if (identifier) {
        // Save the current identifier for future use
        fileManager.writeString(filePath, identifier);
        appendToBlock(identifier);
    } else {
        alert("Identifier is required.");
    }
} else {
    context.cancel();
}

async function appendToBlock(identifier) {
    let http = HTTP.create(); // Create HTTP object

    let response = http.request({
        "url": BRAINFUL_ADD_URL,
        "method": "POST",
        "headers": {
            "Authorization": `Token ${credential.getValue("password")}`,
            "Content-Type": "application/json"
        },
        "data": {
            "identifier": identifier,
            "string": draft.content
        }
    });

    if (response.success) {
        let response_json = JSON.parse(response.responseText);
        let view_url = VIEW_BLOCK_URL_BASE.replace("{username}", credential.getValue("username")).replace("{block_luid}", response_json.luid);

        app.setClipboard(view_url);
        alert("Successfully appended content to '" + response_json.slug + "' and copied URL to clipboard.");
    } else {
        alert("Error: " + response.statusCode + " - " + response.error);
    }
}
