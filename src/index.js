require("dotenv").config();

// Imports the Google Cloud client libraries
const vision = require("@google-cloud/vision").v1;

require("./convertJSONToDoc");

// Creates a client
const client = new vision.ImageAnnotatorClient();

// Bucket where the file resides
const BUCKET_NAME = "mayash-library";
// Path to PDF file within bucket
const fileName =
  "An_Alphabetical_Index_of_Sanskrit_Manuscripts_in_the_Dhaka_University.pdf";
// The folder to store the results
const outputPrefix =
  "An_Alphabetical_Index_of_Sanskrit_Manuscripts_in_the_Dhaka_University";

const gcsSourceUri = `gs://${BUCKET_NAME}/${fileName}`;
const gcsDestinationUri = `gs://${BUCKET_NAME}/${outputPrefix}/`;

const inputConfig = {
  // Supported mime_types are: 'application/pdf' and 'image/tiff'
  mimeType: "application/pdf",
  gcsSource: {
    uri: gcsSourceUri,
  },
};
const outputConfig = {
  gcsDestination: {
    uri: gcsDestinationUri,
  },
};
const features = [{ type: "DOCUMENT_TEXT_DETECTION" }];
const request = {
  requests: [
    {
      inputConfig,
      features,
      outputConfig,
    },
  ],
};

// (async () => {
//   const [operation] = await client.asyncBatchAnnotateFiles(request);
//   const [filesResponse] = await operation.promise();

//   const destinationUri =
//     filesResponse.responses[0].outputConfig.gcsDestination.uri;

//   console.log("Json saved to: " + destinationUri);
// })();

async function convertPDFtoText(inputFileName) {
  // Path to PDF file within bucket
  const fileName = `${inputFileName}.pdf`;

  // The folder to store the results
  const outputPrefix = `${inputFileName}`;

  const gcsSourceUri = `gs://${BUCKET_NAME}/${fileName}`;
  const gcsDestinationUri = `gs://${BUCKET_NAME}/${outputPrefix}/`;

  const inputConfig = {
    // Supported mime_types are: 'application/pdf' and 'image/tiff'
    mimeType: "application/pdf",
    gcsSource: {
      uri: gcsSourceUri,
    },
  };

  const outputConfig = {
    gcsDestination: {
      uri: gcsDestinationUri,
    },
  };

  const features = [{ type: "DOCUMENT_TEXT_DETECTION" }];
  const request = {
    requests: [
      {
        inputConfig,
        features,
        outputConfig,
      },
    ],
  };

  const [operation] = await client.asyncBatchAnnotateFiles(request);
  const [filesResponse] = await operation.promise();

  const destinationUri =
    filesResponse.responses[0].outputConfig.gcsDestination.uri;

  console.log("Json saved to: " + destinationUri);
}

// convertPDFtoText(
//   "An_Alphabetical_Index_of_Sanskrit_Manuscripts_in_the_Dhaka_University"
// );
