// Find all books in a specific genre
db.books.find({ genre: "Fiction" })

// Find books published after a certain year
db.books.find({ published_year: { $gt: 1950 } })

// Find books by a specific author
db.books.find({ author: "George Orwell" })

// Update the price of a specific book
db.books.updateOne(
    {title: "Animal Farm"},
    { $set: { price: 8.99}}
)

// Delete a book by title
db.books.deleteOne({title: "The Alchemist"})

// TASK 3
// Write a query to find books that are both in stock and published after 2010
db.books.find({
    in_stock: true,
    published_year: { $gt: 2010 }
})

// Use projection to return only the title, author, and price fields in your queries
db.books.find(
    { genre: "Fiction" },
    { title: 1, author: 1, price: 1, _id: 0 }
)

// Implement sorting to display books by price (both ascending and descending)
db.books.find().sort({ price: 1 }) // Ascending order by price
db.books.find().sort({ price: -1 }) // Descending order by price

// Use the `limit` and `skip` methods to implement pagination (5 books per page)
db.books.find().skip(0).limit(5) // First page (books 1-5)
db.books.find().skip(5).limit(5) // Second page (books 6-10)

// TASK 4
// - Create an aggregation pipeline to calculate the average price of books by genre
db.books.aggregate([
    {
        $group: {
            _id: "$genre",
            averagePrice: { $avg: "$price" }
        }
    },
    {
        $sort: { averagePrice: 1 } // Sort by average price in ascending order
    }
])

// - Create an aggregation pipeline to find the author with the most books in the collection
db.books.aggregate([
    {
        $group: {
            _id: "$author",
            bookCount: { $sum: 1 }
        }
    },
    {
        $sort: { bookCount: -1 } // Sort by book count in descending order
    },
    {
        $limit: 1 // Get the author with the most books
    }
])

// - Implement a pipeline that groups books by publication decade and counts them
db.books.aggregate([
    {
        $group: {
            _id: { $floor: { $divide: ["$published_year", 10] } }, // Group by decade
            bookCount: { $sum: 1 }
        }
    },
    {
        $project: {
            decade: { $multiply: ["$_id", 10] }, // Convert to actual decade
            bookCount: 1,
            _id: 0
        }
    },
    {
        $sort: { decade: 1 } // Sort by decade in ascending order
    }
])

// TASK 5
// - Create an index on the `title` field for faster searches
db.books.createIndex({ title: 1 })

// - Create a compound index on `author` and `published_year`
db.books.createIndex({ author: 1, published_year: 1 })

// - Use the `explain()` method to demonstrate the performance improvement with your indexes
db.books.find({ title: "1984" }).explain("executionStats")