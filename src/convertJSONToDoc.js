const fs = require("fs");

async function convertJSONToDoc(fileName) {
  let string = "";

  const stream = fs.createReadStream(`./data/${fileName}.json`, "utf8");

  stream.on("data", (data) => {
    string += data.toString();
  });

  stream.on("end", () => {
    console.log("Input File Read Complete.");
    const json = JSON.parse(string);

    const { responses } = json;

    let newTextFile = ``;

    for (let i = 0; i < responses.length; i += 1) {
      const { fullTextAnnotation, context } = responses[i];
      const { text } = fullTextAnnotation;
      const { pageNumber } = context;

      newTextFile = `${newTextFile}

PAGE_NUMBER: ${pageNumber};
TEXT: ${text}
`;
    }

    fs.writeFileSync(`./data/${fileName}-${Date.now()}.txt`, newTextFile);

    console.log("New File is ready in Data folder.");
  });
}

// convertJSONToDoc(
//   "An_Alphabetical_Index_of_Sanskrit_Manuscripts_in_the_Dhaka_University-output-221-to-229"
// );
