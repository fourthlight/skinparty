//CONTENTS
//includes
//app
//routes
//views
//port

console.log('colors in console'.rainbow);
var colors = require('colors');
console.log('S                    '.trap.red.bgBlue);
console.log('  K                  '.trap.red.bgBlue);
console.log('    I                '.trap.red.bgBlue);
console.log('      N              '.trap.red.bgBlue);
console.log('        P            '.trap.red.bgBlue);
console.log('          A          '.trap.red.bgBlue);
console.log('            R        '.trap.red.bgBlue);
console.log('              T      '.trap.red.bgBlue);
console.log('                Y.XYZ'.trap.red.bgBlue);
console.log(' ');
console.log('eric: colors for console loaded');

//################
//### INCLUDES ###
//################
console.log('INCLUDES'.underline);
//express
var express = require('express'),
    session = require('express-session');
    console.log('eric: express and sessions loaded');
//cookie parser
var cookieParser = require('cookie-parser');
//mongo
var mongoclient = require('mongodb').MongoClient,
    format = require('util').format;
    console.log('eric: mongoclient loaded');
//mongoose
var mongoose = require('mongoose'),
    options = {user: 'root',pass: ''},
    profileSchema = mongoose.Schema({_id: String,profileName: String,steamId: String,userPhoto: String, tradeUrl: String}),
    profileModel = mongoose.model('profiles',profileSchema); 
    mongoose.connect('mongodb://127.0.0.1:27017/skinparty',options);
    console.log('eric: mongoose loaded');
//body parser
var bodyParser = require('body-parser');
    console.log('eric: body-parser loaded');
//unirest
var unirest = require('unirest');
    console.log('eric: unirest loaded');
//web server
var http = require('http');
    console.log('eric: http webserver loaded');
//pathing
var path = require('path');
    console.log('eric: pathing loaded');
//ejs
var ejs = require('ejs');
    console.log('eric: ejs loaded');
//passport
var passport = require('passport');
    console.log('eric: passport loaded');
//passport steam
var SteamStrategy = require('passport-steam').Strategy;
    console.log('eric: passport-steam strategy loaded');
//might not need
var ObjectId = require('mongodb').ObjectID;
    console.log('eric: objectid loaded (probably dont need this)');

//###########
//### APP ###
//###########
console.log('APP'.underline);
//define app as express
var app = express();
    console.log('eric: app defined as an express application');
//global vars
var profileName = 'nas',
    mySteamId = 'nan',
    userPhoto = 'nau',
    tradeUrl = 'nas';
    console.log('eric: global variables defined');

//UNCOMMENT TO TEST MONGO DB CONNECTION
////working mongo test connection
//mongoclient.connect('mongodb://127.0.0.1:27017/skinparty', function(err, db){
//    console.log('eric: testing database connection');
//    if (err){
//        console.log('eric: hope you didnt get your hopes up');
//        throw err;
//    }else{
//        console.log("eric: test connection successful");
//        //console.log(db);
//    }
//    console.log('eric: closing test connection');
//    db.close();
//});
//set apps
app.set('views', __dirname);
app.set('view engine', 'ejs');
console.log('eric: apps have been "set"');
//use apps
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'springsteen'}));
app.use(express.static(__dirname + '/public'));
console.log('eric: apps have been "used"');
//passport
app.use(passport.initialize());
console.log('eric: passport has been initialized');
app.use(passport.session());
console.log('eric: using passport sessions');
//connect to steam with passport
passport.use(new SteamStrategy({
    returnURL: 'http://skinparty.xyz:8080/auth/steam/return',
    realm: 'http://skinparty.xyz:8080/',
    apiKey: 'private'
    },
    function(identifier, profile, done){
        console.log('eric: using steam strategy');
        process.nextTick(function(){
        console.log('eric: connecting to mongo database');
        //start connection to database
        mongoclient.connect('mongodb://127.0.0.1:27017/skinparty', function(err, db){
            if(err){
                console.log('eric: hope you didnt get your hopes up');
                throw err;
            }else{
                console.log("eric: database connection successful");
                db.collection("profiles", { }, function(err, coll){
                    if(err != null){
                        console.log('eric: hope you didnt get your hopes up');   
                    }else{
                        console.log('eric: great success!');   
                    }}
                );
                //create record to be saved to db
                var profileObj = {
                        profileName: profile.displayName,
                        steamId: profile.id,
                        userPhoto: profile.photos[2].value,
                        weapons: [],
                        fullProfile: profile
                };
                //actual db operation
                db.collection('profiles').insert(profileObj);
                console.log('eric: saved user to database');  
            } //end mongoclient else statement
            //close the database connection
            db.close();
            console.log('eric: database connection closed');
        }); //end mongoclient connect
      profile.identifier = identifier;
      return done(null, profile);
    }); //end process.nextTick
  } //end passport function
)); //end passport
//serializer (needed for passport)
passport.serializeUser(function(user, done){
    console.log('eric: serialized user');
    done(null, user);
});
console.log('eric: serializer loaded');
//deserializer (needed for passport)
passport.deserializeUser(function(obj, done){
    console.log('eric: deserialized user');
    done(null, obj);
});
console.log('eric: deserializer loaded');
//actual app logic below
console.log('APP (logic)'.underline);
//check for empty data
function isEmptyObject(data){
    return !Object.keys(data).length;
};

//##############
//### ROUTES ###
//##############
console.log('ROUTES'.underline);
// auth/steam
app.get('/auth/steam',
    passport.authenticate('steam'),
    function(req,res){
    console.log('eric: /auth/steam route used');
    //redirects to steam
    });
// auth/steam/return
app.get('/auth/steam/return',
    passport.authenticate('steam', {failureRedirect: '/splash' }),
    function(req,res){
        console.log('eric: /auth/steam/return route used');
        //get session variables
        sess = req.session;
        //set profileId session variable
        sess.profileId = req.user.id;
        //redirect to dash
        res.redirect('/dash');
        console.log('eric: redirected to /dash');
    });

//##############
//### VIEWS ###
//##############
console.log('VIEWS'.underline);
//default view
app.get('/', function(req,res){
	res.sendFile(path.join(__dirname + '/views/splash.html'));
    console.log('eric: / served');
});
//splash view
app.get('/splash', function(req,res){
	res.sendfile(path.join(__dirname + '/views/splash.html'));
    console.log('eric: /splash served');
});
//dash view
app.get('/dash', function(req,res){
    //check if passport else redirect to /
    if(isEmptyObject(req.session.passport) == true){res.redirect('/');}
    //search database
    profileModel.findOne({steamId:sess.profileId},function(err,myProfile){
        //johns awesome error handling
        if(err) return console.log(err);
        //set global vars to found record info
        profileName = myProfile['profileName'];
        tradeUrl = myProfile['tradeUrl'];
        steamId = myProfile['steamId'];
        userPhoto = myProfile['userPhoto'];
    });
    //create hasd and unhash arrays
    sess.hashItemId = [];
    sess.unHashItemId=[];
    //second api call
    unirest.get('http://steamcommunity.com/profiles/' +sess.profileId +'/inventory/json/730/2')
        //type is JSON
        .type('json')
        //end response
        .end(function(response){
                var inventoryObject = response.body.rgInventory,
                    inventoryKeys = Object.keys(inventoryObject),
                    inventoryDescriptions = response.body.rgDescriptions;
                inventoryKeys.forEach(function(keys){
                    sess.hashItemId.push(keys);
                });
                for(var i = 0; i < sess.hashItemId.length;i++){
                    var inventoryId = response.body.rgInventory[sess.hashItemId[i]].classid,
                        classId = response.body.rgInventory[sess.hashItemId[i]].instanceid;
                    sess.unHashItemId.push(inventoryId +"_" +classId);   
                };
                res.render('./views/dash',{
                    profileName: profileName,
                    steamId: steamId,
                    userPhoto: userPhoto,
                    unHashItems: sess.unHashItemId,
                    inventory : inventoryDescriptions,
                    tradeUrl: tradeUrl
                });
        });
});
//tradeUrl view (goes in routes?)
app.get('/tradeUrl', function(req,res){
    res.render('./views/tradeUrl',{
        steamId: steamId
    });
    console.log('Alex: /tradeUrlSave served')
});
//tradeUrlSave (goes in routes?)
app.post('/tradeUrlSave', function(req,res){
    //redirect to dash
    res.redirect('/dash');
    console.log('eric: redirected to /dash');
});
//logout view
app.get('/logout', function(req,res){
    sess = null;
	res.sendFile(path.join(__dirname + '/views/splash.html'));
    console.log('eric: /logout served');
});

//############
//### PORT ###
//############
console.log('PORT'.underline);
app.listen(8080);
console.log("eric: webserver listening on 8080");