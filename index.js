const express = require("express");
var bodyParser = require("body-parser");

//Database
const database = require("./database");

//initialise express
const booky = express();

booky.use(bodyParser.urlencoded({extended:true})); 
booky.use(bodyParser.json());



booky.get("/",(req,res) => {
    return res.json({books: database.books});
});

booky.get("/is/:isbn",(req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.ISBN === req.params.isbn
    );

    if(getSpecificBook.length === 0){
        return res.json({error: `no book found for the ISBN of ${req.params.isbn}`})
    }

    return res.json({book: getSpecificBook});
});

booky.get("/c/:category",(req,res) => {
    const getSpecificBook = database.books.filter(
      (book) => book.category.includes(req.params.category) 
    )

    if(getSpecificBook.length === 0){
        return res.json({error: `no book found for the category of ${req.params.category}`})
    }

    return res.json({book:getSpecificBook });
});

booky.get("/l/:language",(req,res) => {
    const getSpecificBook = database.books.filter(
      (book) => book.language === req.params.language
    )

    if(getSpecificBook.length === 0){
        return res.json({error: `no language found ${req.params.language}`})
    }

    return res.json({book:getSpecificBook });
})

booky.get("/author", (req,res) => {
    return res.json({authors:database.author});
})

booky.get("/author/book/:isbn", (req,res) => {
    const getSpecificAuthor = database.author.filter(
        (author) => author.books.includes(req.params.isbn)
    );

    if(getSpecificAuthor.length === 0){
        return res.json({error:`No author found for the book of ${req.params.isbn}`});
    }
    return res.json({author: getSpecificAuthor});

});

booky.get("/publications", (req,res) => {
    return res.json({publication:database.publication});
});

booky.post("/book/new",(req,res) => {
    const newBook = req.body;
    database.books.push(newBook);
    return res.json({updatedBooks: database.books});
});

booky.post("/author/new",(req,res) => {
    const newAuthor = req.body;
    database.author.push(newAuthor);
    return res.json(database.author);
});

booky.post("/publication/new",(req,res) => {
    const newPublication = req.body;
    database.publication.push(newPublication);
    return res.json(database.publication);
});

booky.put("/publication/update/book/:isbn",(req,res) => {
    database.publication.forEach((pub) => {
        if(pub.id === req.body.pubId) {
            return pub.books.push(req.params.isbn);
    }
    });
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            book.publications = req.body.pubid;
            return;
        }
    });
    return res.json(
        {
            books:database.books,
            publications:database.publication,
            message:"SUCCESSFULLY IMPLEMENTED THE SURVER"
        }
    )
});

booky.delete("/book/delete/:isbn",(req,res) => {
    const updatedBookDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn
    )
    database.books = updatedBookDatabase;
    return res.json({books: database.books});
});

booky.delete("/book/delete/author/:isbn/:authorId",(req,res) =>{
    database.books.forEach((book) =>{
        if(book.ISBM === req.params.isbm) {
            const newAuthorList = book.author.filter(
                (eachauthor) => eachauthor !== parseInt(req.params.authorId)
            );
            book.author = newAuthorList;
            return;
        }
    });
    database.author.forEach((eachauthor) => {
        if(eachauthor.id === parseInt(req.params.authorId)) {
            const newBookList = eachauthor.books.filter(
                (book) => book !== req.params.isbn
            );
            eachauthor.books = newBookList;
            return;
        }
    });

    return res.json({
        book: database.books,
        author:database.author,
        message:"Author was deleted!!!"
    })
});

booky.listen(3000,() => {
    console.log("Server is up and running");
});


