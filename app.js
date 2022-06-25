const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

app.use(express.static("public"));
//connecting with Mongodb
mongoose.connect("mongodb://localhost:27017/wikiDB");
//Schema
const articleSchema = {
  title : String,
  content : String
};
//Model
const Article = mongoose.model("Article", articleSchema);

/////////////////Request targetting all the articles///////////////////////

app.route("/articles")
.get(function(req,res){
  Article.find(function(err, foundResults){
    if(!err){
      res.send(foundResults);
    }else {
      console.log(err);
    }
  });
})
.post(function(req,res){
  const newArticle = Article ({
    title : req.body.title,
    content : req.body.content
  });
  newArticle.save(function(err){
    if(!err){
      res.send("successfully added the new article.");
    }
  });
})
.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Successfully deleted all the articles");
    }
    else{
      console.log(err);
    }
  });
});

//////////////Request targetting a specific article////////////////////

app.route("/articles/:articleTitle")
.get(function(req,res){
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }else {
      res.send("No articles matching this title was found");
    }
  })
})

.put(function(req,res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    function(err){
      if(!err){
        res.send("Successfully updated the document");
      }
    }
  );
})

.patch(function(req,res){
  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("successfully updated the article");
      }else {
        res.send(err);
      }
    }
  );
})

.delete(function(req,res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err){
        res.send("Successfully deleted the article");
      }
    }
  );
});






app.listen("3000", function(){
  console.log("server has started on port 3000");
})
