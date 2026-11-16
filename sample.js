// ------------------------------------------------------------
// Lab 01 - From the terminal to Node.js
// ------------------------------------------------------------
// In session 1 you typed MongoDB commands directly in mongosh:
//
//   db.books.insertOne({ title: "Dune", author: "Frank Herbert" })
//   db.books.find()
//
// Here you will write the exact same operations, but as a Node.js
// script. The MongoDB driver translates your JavaScript calls into
// the same commands mongosh sends to the database.
// ------------------------------------------------------------

const { MongoClient } = require("mongodb");

// The connection string tells the driver where MongoDB is running.
// "mongodb://localhost:27017" is the default for a local installation.
const URI = "mongodb://localhost:27017";

// MongoClient is the entry point to the driver.
// You create one client per application.
const client = new MongoClient(URI);

// ------------------------------------------------------------
// Everything that talks to the database must happen inside an
// async function, because network calls take time.
// "await" pauses execution until the operation completes.
// ------------------------------------------------------------
async function main() {
  // Open the connection to MongoDB.
  await client.connect();

  // Select the database and collection to work with.
  // If they do not exist yet, MongoDB creates them on first write.
  const books = client.db("book_db").collection("books");

  // Start fresh on every run.
  await books.deleteMany({});

  // ----------------------------------------------------------
  // TODO 1: Insert a book with an embedded publisher object (name, country)
  await books.insertOne({
    title: "The Little Prince",
    author: "Antoine de Saint-Exupéry",
    publisher: {
      name: "Gallimard",
      country: "France"
    }
  });

  // ----------------------------------------------------------
  // TODO 2 - insertOne with an array
  // ----------------------------------------------------------
  await books.insertOne({
    title: "Dune",
    author: "Frank Herbert",
    tags: ["sci-fi", "classic", "space-opera"]
  });

  // Insert one book that has a tags field containing
  // an array of at least 3 strings.

  // ----------------------------------------------------------
  // TODO 3 - insertMany
  // ----------------------------------------------------------
  await books.insertMany([
    {
    title: "Les Misérables",
    author: "Victor Hugo",
    publisher: { name: "A. Lacroix", country: "France" },
    tags: ["historical", "classic", "drama"]
    },
    {
    title: "1984",
    author: "George Orwell",
    publisher: { name: "Secker & Warburg", country: "UK" }
    },
    {
    title: "Neuromancer",
    author: "William Gibson",
    tags: ["cyberpunk", "sci-fi", "hacking"]
    },
    {
    title: "The Stranger",
    author: "Albert Camus",
    publisher: { name: "Gallimard", country: "France" }
    },
    {
    title: "Clean Code",
    author: "Robert C. Martin"
    }
  ]);

  // Insert at least 5 books in a single call using insertMany.
  // Include a mix: some with a publisher object, some with tags, some with both.

  // ----------------------------------------------------------
  // TODO 4 - find all documents
  const allBooks = await books.find().toArray();
  allBooks.forEach(book => {
    console.log(book.title);
  });
  // ----------------------------------------------------------
  // Retrieve every document in the collection and log each title.
  // Hint: find() returns a cursor - call .toArray() to get an array.

  // ----------------------------------------------------------
  // TODO 5 - findOne with dot notation
  const firstFrenchBook = await books.findOne({ "publisher.country": "France" });
  if (firstFrenchBook) {
    console.log(firstFrenchBook.title);
  }

  // ----------------------------------------------------------
  // Find the first book whose publisher.country is "France".
  // Dot notation lets you filter on a field inside an embedded object:
  //   { "publisher.country": "France" }
  // Log the title of the result.

  // ----------------------------------------------------------
  // TODO 6 - find with a filter
  const frenchBooks = await books.find({ "publisher.country": "France" }).toArray();
  console.log(frenchBooks.length);

  // ----------------------------------------------------------
  // Find all books whose publisher.country is "France".
  // Log how many there are and list their titles.

  // ----------------------------------------------------------
  // TODO 7 - find with $exists
  const taggedBooks = await books.find({ tags: { $exists: true } }).toArray();
  taggedBooks.forEach(book => {
    console.log(book.title, book.tags);
  });

  // ----------------------------------------------------------
  // Find all books that have a tags field, regardless of its value.
  //   { tags: { $exists: true } }
  // Log each title and its tags array.

  // Always close the connection when you are done.
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
