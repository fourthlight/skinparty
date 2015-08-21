//includes
//app
//routes
//views
//processing
//port

//colors in console
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
    //var MongoStore = require('connect-mongo')(session);
        console.log('eric: mongostore loaded');
    //body parser
    var bodyParser = require('body-parser');
        console.log('eric: body-parser loaded');
    //unirest
    var unirest = require("unirest");
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

//###########
//### APP ###
//###########
    //define app as express
    var app = express();
    console.log('eric: app defined as an express application');
    //modules
    var api = require('./api.js');
    console.log('eric: api.js loaded');
    //global vars
    var apiProfile;
    console.log('eric: global variables defined');



//test mongo connection
mongoclient.connect('mongodb://127.0.0.1:27017/skinparty', function(err, db){
    console.log('eric: testing database connection');
    if (err){
        console.log('eric: hope you didnt get your hopes up');
        throw err;
    }else{
        console.log("eric: test connection successful");
        //console.log(db);
    }
    console.log('eric: closing test connection');
    db.close();
});

////mysql
//var mysql      = require('mysql');
//var connection = mysql.createConnection({
//host     : 'localhost',
//port     :  '8889',
//database : 'projectdb',
//user     : 'root',
//password : 'root',
//});
//connection.connect();

//set apps
app.set('views', __dirname);
app.set('view engine', 'ejs');
console.log('eric: apps have been "set"');

//use apps
app.use(cookieParser());
//app.use(session({
//     secret: 'springsteen',
//     store: new MongoStore(),
//     resave: false,
//     saveUninitialized: true
//}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'springsteen'}));
app.use(express.static(__dirname + '/public'));
console.log('eric: apps have been "used"');

//passport
app.use(passport.initialize());
console.log('eric: passport has been initialized');
app.use(passport.session());
console.log('eric: using passport sessions');

//connect to steam
passport.use(new SteamStrategy({
    returnURL: 'http://skinparty.xyz:8080/auth/steam/return',
    realm: 'http://skinparty.xyz:8080/',
    apiKey: 'D11AD87054507CDB314ACE9CFB1D5697'
  },
  function(identifier, profile, done){
    console.log('eric: using steam strategy');
    process.nextTick(function(){
        console.log('eric: connecting to mongo database');
        //start connection
        mongoclient.connect('mongodb://127.0.0.1:27017/skinparty', function(err, db){
            if(err){
                console.log('eric: hope you didnt get your hopes up');
                throw err;
            }else{
                console.log("eric: database connection successful");
                
                
                
                //db.collection('profiles').insert(profile);
                //console.log('eric: inserted profile into skinparty database');
                console.log('eric: ##########START PROFILE##########');
                console.log('profile name: ' +profile.displayName);
                console.log('steamid: ' +profile.id);
                //console.log('hires photo: ' +profile.photos[2].value);
                console.log('eric: ##########END PROFILE##########');
                
                
                
                existingId = profile.id
                console.log('EXISTING ID: ' +existingId);
                var existingProf = db.collection('profiles').find({id: existingId});
                
                //conditional checking if profile is already in db
                if(existingProf){
                    console.log('record exists, not saving to db');
                }else{
                    db.collection('profiles').insert(profile);
                    console.log('record does not exist, saved to db');
                };
                
                
                
                
                
            }
            db.close();
            console.log('eric: database connection closed');
        });
      profile.identifier = identifier;
      return done(null, profile);
    });
  }
));

//serializer
passport.serializeUser(function(user, done){
    console.log('eric: serialized user');
    done(null, user);
});
console.log('eric: serializer loaded');

//deserializer
passport.deserializeUser(function(obj, done){
    console.log('eric: deserialized user');
    done(null, obj);
});
console.log('eric: deserializer loaded');

//##############
//### ROUTES ###
//##############
// auth/steam
app.get('/auth/steam',
    passport.authenticate('steam'),
    function(req,res){
    console.log('eric: /auth/steam route used');
    //redirect to steam
    });
// auth/steam/return
app.get('/auth/steam/return',
    passport.authenticate('steam', {failureRedirect: '/splash' }),
    function(req,res){
    console.log('eric: /auth/steam/return route used');
    // Successful authentication, redirect home.
    res.redirect('/dash');
    console.log('eric: redirected to /dash');
    });

//##############
//### VIEWS ###
//##############
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
	res.sendfile(path.join(__dirname + '/views/dash.html'));
    console.log('eric: /dash served');
    console.log(profile);
});

//// DELETEME view character
//app.post('/viewCharacter', function(req, res){
//	characterchoose = req.body.character;
//	console.log('==============   Character Choose ==============');
//	console.log(characterInfo[characterchoose]);
//	var characterId = characterInfo[characterchoose]['characterBase']['characterId'];
//	var memberId = characterInfo[characterchoose]['characterBase']['membershipId'];
//	var system = characterInfo[characterchoose]['characterBase']['membershipType'];
//	console.log(characterId);
//	console.log(memberId);
//	api.characterInfo(memberId,characterId,system,function(result){
//		console.log('==============   Hash Character Items ==============');
//		console.log(result['Response']['data']['buckets']['Equippable']);
//		console.log('==============   unHash Equippable ==============');
//		console.log(result['Response']['definitions']['items']);
//		//console.log(result['Response']['data']['buckets']['Equippable'][0]['items'][0]['itemHash']);
//		//console.log(result['Response']['definitions']['items']['250113089']['icon']);
//		var unHashItem  = result['Response']['definitions']['items'];
//		var hashItem= result['Response']['data']['buckets']['Equippable'];
//		console.log('==============   DeBuging ==============');
//		console.log(characterchoose)
//		console.log(characterInfo[characterchoose])
//	res.render('./views/charView',{
//			gamerTag : gamerTag,
//			character : characterInfo[characterchoose],
//			hashItem : hashItem,
//			unHashItem : unHashItem
//        });
//	});
//});

//##################
//### PROCESSING ###
//##################
//process api
app.post('/processApi', function(req, res) {
	var data;
	// Form Data
	var profileName = req.body.profileName;
	var profileId = req.body.profileId;
	console.log(steamName);
	console.log(steamUrl);
    
    //call steam api
	api.steamApi(profileName,profileId,function(result){
       console.log('logging result');
       console.log(result);
        if (result == 55) {
            res.render('./views/errors');       
        } else {
		data = result['data']['characters'];
        console.log('++++++++ characters +++++++++');
		console.log(data);
		membershipId = data[0]['characterBase']['membershipId'];
		characterOne = data[0];
		characterTwo = data[1];
		characterThree = data[2];
		for (var i = 0; i <= 2; i++) {
			characterInfo.push(data[i]);
		};
		// console.log("character Info Variable");
		// console.log(characterInfo);
//		console.log(characterTwo);
//		console.log(characterThree);
			res.render('./views/profile',{gamerTag:gamerTag,
				characterOne : characterOne,
				characterTwo:characterTwo,
				characterThree : characterThree
	          });
        }
	}); //END steam api call
}); //END processApi

////process login
//app.post('/logmein', function(req, res){
//	var data;
//	// Form Data
//	gamerTag = req.body.gamerTag;
//	var system = req.body.system;
//	console.log(gamerTag);
//	console.log(system);
//	api.steamApi(system,gamerTag,function(result){
//       console.log('++++++++ result +++++++++');
//       console.log(result);
//        if (result == 55) {
//            res.render('./views/errors');       
//        } else {
//		data = result['data']['characters'];
//        console.log('++++++++ characters +++++++++');
//		console.log(data);
//		membershipId = data[0]['characterBase']['membershipId'];
//		characterOne = data[0];
//		characterTwo = data[1];
//		characterThree = data[2];
//		for (var i = 0; i <= 2; i++) {
//			characterInfo.push(data[i]);
//		};
//			res.render('./views/profile',{gamerTag:gamerTag,
//				characterOne : characterOne,
//				characterTwo:characterTwo,
//				characterThree : characterThree
//	          });
//        }
//	});
//});

//################
//### DATABASE ###
//################
// login
app.get('/login', function(req, res) {
    res.render('./views/form');
});
//add user
app.get('/addUser', function(req, res) {
	res.render('./views/addUser');
});
//process login
app.post('/processLogin', function(req, res) {
	var name = req.body.name;
	var password = req.body.password;
	// sess = req.session;
	// sess.name = name;
	// sess.bool = true;
    
	// // SQL Query
 // 	connection.query('SELECT username from users where username = ? and password = ?',[name,password],function(err, rows) {
 //   		console.log("hello"); 
 //   		console.log(rows);
	//  });
    res.redirect('/');
});
//process add
app.post('/processAdd', function(req, res) {
	 var name = req.body.name;
	 var password = req.body.password;
     var gamertag = req.body.gamertag;
	 var system = req.body.system;
//	 sess = req.session;
//	 sess.name = name;
	// SQL Query
 	// connection.query('insert into users(username,password,gamertag,system)values(?,?,?,?)',[name,password,gamertag,system],function(err, rows) {
  //  		console.log("hello"); 
  //  		console.log(rows);
	 // });
    res.redirect('/');
});
//logout
app.get('/logout', function(req, res) {
    sess = null;
    
    res.redirect('/')
});

//############
//### PORT ###
//############
app.listen(8080);
console.log("eric: webserver listening on 8080");