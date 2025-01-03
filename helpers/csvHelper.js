// const { Parser } = require("json2csv");

// const response = (data, res) => {
//   try {
//     const json2csv = new Parser();
//     const csv = json2csv.parse(data);

//     res.header("Content-Type", "text/csv");
//     res.attachment("video_links.csv");
//     res.send(csv);
//   } catch (err) {
//     console.error("Error generating CSV:", err);
//     res.status(500).json({ message: "Error generating CSV" });
//   }
// };
const response = (data, res) => {
  try {
    // Check if data is an array and not empty
    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ message: "No data to export" });
    }

    // Get the keys from the first object to use as headers
    const headers = Object.keys(data[0].get ? data[0].get() : data[0]); // Use .get() if it's a Sequelize instance
    const csvRows = [];

    // Create the header row
    csvRows.push(headers.join(","));

    // Create the data rows
    for (const row of data) {
      const values = headers.map((header) => {
        // Extract the value, using .get() for Sequelize instances
        const value = row.get ? row.get(header) : row[header];
        // Escape values that contain commas or newlines
        const escapedValue = (value || "").toString().replace(/"/g, '""');
        return `"${escapedValue}"`; // Wrap in quotes
      });
      csvRows.push(values.join(","));
    }

    // Join all rows into a single string
    const csvString = csvRows.join("\n");

    // Set the response headers for CSV download
    res.header("Content-Type", "text/csv");
    res.attachment("video_links.csv"); // This tells the browser to download the file
    res.send(csvString);
  } catch (err) {
    console.error("Error generating CSV:", err);
    res.status(500).json({ message: "Error generating CSV" });
  }
};

module.exports = { response };
