// Composr Gmail Add-on
// Reads templates from the Composr web app's API and inserts the chosen
// template's HTML directly into the open compose draft.

var COMPOSR_BASE_URL = "https://composrr.netlify.app";
var API_KEY_PROPERTY = "COMPOSR_API_KEY";

function getStoredApiKey() {
  return PropertiesService.getUserProperties().getProperty(API_KEY_PROPERTY);
}

function fetchTemplates(apiKey) {
  var response = UrlFetchApp.fetch(COMPOSR_BASE_URL + "/api/templates", {
    method: "get",
    headers: { Authorization: "Bearer " + apiKey },
    muteHttpExceptions: true,
  });

  if (response.getResponseCode() !== 200) {
    throw new Error("Composr API error: " + response.getContentText());
  }

  return JSON.parse(response.getContentText());
}

function fetchTemplate(apiKey, id) {
  var response = UrlFetchApp.fetch(
    COMPOSR_BASE_URL + "/api/templates/" + encodeURIComponent(id),
    {
      method: "get",
      headers: { Authorization: "Bearer " + apiKey },
      muteHttpExceptions: true,
    }
  );

  if (response.getResponseCode() !== 200) {
    throw new Error("Composr API error: " + response.getContentText());
  }

  return JSON.parse(response.getContentText());
}

// Entry point for the add-on's homepage / side panel (outside compose).
function onHomepage() {
  return buildSettingsCard();
}

// Gmail calls this before showing the compose trigger; returning without
// throwing is enough to signal the add-on is authorized.
function onAuthorize() {
  return true;
}

function buildSettingsCard(message) {
  var apiKey = getStoredApiKey();

  var section = CardService.newCardSection().setHeader("Composr API key");

  if (message) {
    section.addWidget(CardService.newTextParagraph().setText(message));
  }

  section.addWidget(
    CardService.newTextParagraph().setText(
      "Generate a key from Composr's Settings page (composrr.netlify.app/settings) and paste it below."
    )
  );

  var input = CardService.newTextInput()
    .setFieldName("apiKey")
    .setTitle("API key")
    .setValue(apiKey || "");
  section.addWidget(input);

  var saveAction = CardService.newAction().setFunctionName("saveApiKey");
  section.addWidget(
    CardService.newTextButton().setText("Save").setOnClickAction(saveAction)
  );

  return CardService.newCardBuilder().addSection(section).build();
}

function saveApiKey(e) {
  var apiKey = e.formInput.apiKey;
  PropertiesService.getUserProperties().setProperty(API_KEY_PROPERTY, apiKey);

  return CardService.newActionResponseBuilder()
    .setNotification(CardService.newNotification().setText("API key saved"))
    .setNavigation(
      CardService.newNavigation().updateCard(buildSettingsCard("Saved."))
    )
    .build();
}

// Runs when the user opens the "Insert Composr template" compose action.
function onComposeTrigger(e) {
  var apiKey = getStoredApiKey();

  if (!apiKey) {
    return buildSettingsCard(
      "Add your Composr API key here first, then reopen this action."
    );
  }

  var templates;
  try {
    templates = fetchTemplates(apiKey);
  } catch (err) {
    return buildErrorCard(err);
  }

  var section = CardService.newCardSection().setHeader("Your templates");

  if (!templates.length) {
    section.addWidget(
      CardService.newTextParagraph().setText(
        "No templates yet. Create one in Composr first."
      )
    );
  }

  templates.forEach(function (template) {
    var action = CardService.newAction()
      .setFunctionName("insertTemplate")
      .setParameters({ templateId: template.id });

    section.addWidget(
      CardService.newTextButton()
        .setText(template.name)
        .setOnClickAction(action)
    );
  });

  return CardService.newCardBuilder().addSection(section).build();
}

function insertTemplate(e) {
  var apiKey = getStoredApiKey();
  var templateId = e.parameters.templateId;

  var template;
  try {
    template = fetchTemplate(apiKey, templateId);
  } catch (err) {
    return buildErrorActionResponse(err);
  }

  var updateAction = CardService.newUpdateDraftBodyAction()
    .addUpdateContent(template.html, CardService.ContentType.MUTABLE_HTML)
    .setUpdateType(CardService.UpdateDraftBodyType.INSERT_AT_START);

  var actionResponse = CardService.newUpdateDraftActionResponseBuilder()
    .setUpdateDraftBodyAction(updateAction)
    .build();

  return CardService.newComposeActionResponseBuilder()
    .setGmailCompose(actionResponse)
    .build();
}

function buildErrorCard(err) {
  var section = CardService.newCardSection().addWidget(
    CardService.newTextParagraph().setText(
      "Error loading templates: " + err.message
    )
  );
  return CardService.newCardBuilder().addSection(section).build();
}

function buildErrorActionResponse(err) {
  return CardService.newComposeActionResponseBuilder()
    .setNotification(
      CardService.newNotification().setText(
        "Failed to insert template: " + err.message
      )
    )
    .build();
}
