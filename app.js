//
var expressSanitizer= require("express-sanitizer");
var methodOverride  = require("method-override");
var bodyParser      = require("body-parser");
var mongoose        = require("mongoose");
var express         = require("express");
var app             = express();

mongoose.connect("mongodb://localhost:27017/blog_app", {useNewUrlParser: true});

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}) );
app.use(expressSanitizer());
app.use(methodOverride("_method"));
//MONGOOSE SCHEMA

var bodySchema = new mongoose.Schema({
    title:String ,
    image: String,
    body:String,
    created: {type: Date , default: Date.now}
});

var Blog = mongoose.model("Blog",bodySchema);

//Blog.create({
//    title: "A Day Off !! " ,
//    image: "https://images.unsplash.com/photo-1497002928099-b7d092bc11b5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//    body: "It's always good to take a day's off ."
//});

//Routes 
    app.get("/",function(req, res){
        res.redirect("/Blog");
    });
    //index
    app.get("/Blog",function(req, res){
        Blog.find({},function(err, blogs){
            if(err){
                console.log(err);
            } else {
                res.render("index", {blogs : blogs});
            }
        })
    });
    //new
    app.get("/Blog/new", function(req, res){
        res.render("new");
    } );
    //create
    app.post("/Blog", function(req, res){
   
        Blog.create(req.body.blog,function(err, newBlog){
            if(err){
                console.log(err);
            } else {
                res.redirect("/Blog");
            }
        })
    });
    //show
    app.get("/Blog/:id", function(req, res){
        Blog.findById(req.params.id, function(err, foundBlog){
            if(err){
                res.redirect("/Blog");
            } else {
                res.render("show", {blog: foundBlog});
            }
        })    
    });
    //edit
    app.get("/Blog/:id/edit", function(req, res){
        Blog.findById(req.params.id, function(err, foundBlog){
            if(err){
                res.redirect("/Blog");
            } else {
                res.render("edit", {blog: foundBlog});
            }
        })      
    });
    //update
    app.put("/Blog/:id", function(req, res){
        //sanitizing the input 
        
        //merging the input
        Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
            if(err){
                console.log(err);
            } else {
                res.redirect("/Blog/" + req.params.id );
            }
        })
    })
    //destroy
    app.delete("/Blog/:id", function(req, res){
        Blog.findByIdAndRemove(req.params.id, function(err){
            if(err){
                console.log("ERROR WHILE DELETION");
            } else {
                res.redirect("/Blog");
            }
        })
    });
//server 
app.listen(8080,function(){
    console.log("Blogapp SERVER : Online");
});
