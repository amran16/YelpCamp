var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");


//INDEX - Show all campground
router.get('/', function(req, res){
    Campground.find({}, function(err, allcampgrounds){
    if(err){
        console.log(err);
    } else {
        res.render('campgrounds/index', {campgrounds: allcampgrounds});
    }
  });
});

//Create - add new caampground to DB
router.post('/', middleware.isLoggedIn, function(req, res){
   //get data from form and addd to campgrounds array
   var name = req.body.name;
   var image = req.body.image;
   var desc = req.body.description;

   var author = {
     id: req.user._id,
     username: req.user.username
   }
   var newCampground = {name: name, image: image, description: desc, author: author}
   //create a new campground and save it to the new db
   console.log(req.user);
   Campground.create(newCampground, function(err, newlyCreated){
       if(err){
           console.log(err);
       }else{
           res.redirect('/campgrounds');
       }
   });
});

//NEW - Show form to create new caampground
router.get('/new', middleware.isLoggedIn, function(req, res){
    res.render('campgrounds/new');
});

//SHOW - Shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT Campground Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findById(req.params.id, function(err, foundCampground){
      res.render("campgrounds/edit", {campground: foundCampground});
   });
});

//UPDATE Campground Route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           //redirect somewhere(show page)
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

//Destroy Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/campgrounds");
      } else {
          res.redirect("/campgrounds");
      }
   });
});

module.exports = router;
