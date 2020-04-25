const { API_KEY } = require("./config");
const SibApiV3Sdk = require('sib-api-v3-sdk');
const defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure API key authorization: api-key
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = API_KEY;

const apiInstance = new SibApiV3Sdk.ContactsApi();

// Create a contact
var createContact = new SibApiV3Sdk.CreateContact();
createContact = { 'email': "dhessika.mineiro@gmail.com" };

apiInstance.createContact(createContact).then(function (data) {
  console.log('API called successfully. Returned data: ' + data);
}, function (error) {
  console.error(error);
});