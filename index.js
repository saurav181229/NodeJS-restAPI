const express = require('express');
const app = express();
const bodyParser = require('body-parser') //for parsing the reqest body
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json()) // parsing json

// database related functions
const mongoose = require('mongoose');
const book = require('./models/books');
mongoose.connect("mongodb://localhost/books",{useNewUrlParser:true,useUnifiedTopology:true});
const db = mongoose.connection;
db.on('error',console.error.bind(console,"connecttion error:"));
db.once('open',()=>{
console.log("connected to db");
})


//resApi functions
app.get("/",(req,res)=>{
    res.status(200).send("<p>hello dere</p>")
})
//display the books
app.get("/books",(req,res,next)=>{
    
    book.find((err,books)=>{
        if(err) console.error(err)
        console.log(books);
        res.status(200).send(books);
    })
})
//add a book
app.post("/books/add",async(req,res,next)=>{
 const name = req.body.name;
 const author = req.body.author;
 console.log(name,author);
  const add = new book({
      name:name,
      author:author
  })
 
  console.log(add)
 await add.save((err,add)=>{
      if(err) {
          console.error(err);

    }
})
await book.find((err,books)=>{
        if(err) console.error(err);
        res.status(201).send(books);
      
       })

})

//edit the book
app.put("/books/edit/:id",(req,res)=>{
    const id = req.params.id;
    console.log(id);
    book.updateOne({"_id":id},
    {$set:{'name':req.body.name,'author':req.body.author }},(err, books)=>{
        if(err){
            console.error(err);
        res.send('<p>id error! enter valid id</p>')
        }
            
        console.log(books)       
        res.send(books);
    })

})
//delete a book
app.delete('/books/delete/:id',(req,res)=>{
    const id = req.params.id;
    book.findByIdAndDelete(id,(err,delBook)=>{
        if(err) {
            console.error(err);
            res.send('<p>id error !! enter the valid id</p>');

        }
        res.send(delBook);
    })
})

app.listen(process.env.PORT||3000,()=>{
    console.log("server up and running");
})


