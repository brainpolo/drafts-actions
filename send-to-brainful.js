// Script to perform an add block operation in brainful and copy URL to clipboard.

let credential = Credential.create("brainful", "brainful companion to perform actions on your brainful account.");

credential.addTextField("username", "Username");
credential.addPasswordField("password", "API Key");

credential.authorize();

// Endpoints subject to change - https://brainful.one/api
const BRAINFUL_ADD_URL = "https://brainful.one/my/blocks/add";
const VIEW_BLOCK_URL_BASE = "https://brainful.one/@{username}/{block_luid}";

async function sendBlock() {
    let http = HTTP.create(); // Create HTTP object

    let response = http.request({
        "url": BRAINFUL_ADD_URL,
        "method": "POST",
        "headers": {
            "Authorization": `Token ${credential.getValue("password")}`,
            "Content-Type": "application/json"
        },
        "data": { "string": draft.content }
    });

    if (response.success) {
        let response_json = JSON.parse(response.responseText);
        let view_url = VIEW_BLOCK_URL_BASE.replace("{username}", credential.getValue("username")).replace("{block_luid}", response_json.luid)

         app.setClipboard(view_url)
         alert("Successfully created block with slug " + response_json.slug + " and copied URL to clipboard. You have " + response_json.remaining_daily_quota + " blocks available to send today.")
        
    } else {
        alert("Error: " + response.statusCode + " - " + response.error);
    }
}

sendBlock();
