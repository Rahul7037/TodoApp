const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Login = require('../models/data');

router.get('/', (req, res) => {
    res.render('login');
})

router.get('/login', (req, res) => {
    res.render('login');
})
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const login = await Login.findOne({ email: email });
        if (login) {
            if (login.password == password) {
                req.flash("success","Successful Login");
                // console.log("Successful Login");
                return res.redirect('/users');
            }
            req.flash("error","Password Not Match");
            console.log("Password Not Match");
            return res.redirect('back');
        }
        else {
            req.flash('error',"Not Exist");
            console.log("Not Exist");
            return res.redirect('back');
        }
    }
    catch (err) {
        req.flash("error","Email Id Not exist")
        console.log('Email id Not Exist');
        return res.render('login');
    }
});


router.get('/signup', (req, res) => {
    res.render('signup');
})

router.post('/signup', (req, res) => {
    const { username, email, password, confirmPass } = req.body;
    if (password != confirmPass) {
        req.flash('error', 'Passwords not match');
        console.log('Password Not Match');
        return res.redirect('/signup');
    }

    Login.findOne({ email: email }).then(login => {
        if (login) {
            req.flash("error","Email Already Exist");
            // res.send("Email Already Exist");
            return res.redirect('/login');
        }
        const newLogin = new Login({
            username, email, password, confirmPass
        });
        newLogin.save().then(() => {
            req.flash('success','Create Successful');
            console.log('Created Sucessful')
            res.redirect('/login');
        })
            .catch((err) => {
                // console.log(err);
                req.flash('error','Enter a Valid Email');
                res.redirect('/signup');
            });
    });
});

// router.get('/', (req, res) => {
//     res.redirect('/users'); //this will redirect page to /users
// });

//users i.e index route
router.get('/users', (req, res) => {
    console.log("req made on" + req.url);
    User.find().sort({ createdAt: -1 })//it will find all data and show it in descending order
        .then(result => {
            res.render('index', { users: result, title: 'Home' }); //it will then render index page along with users
        })
        .catch(err => {
            console.log(err);
        });
})

//about route
router.get('/about', (req, res) => {
    console.log("req made on" + req.url);
    res.render('about', { title: 'About' });
})

//route for user create
router.get('/user/create', (req, res) => {
    console.log("GET req made on" + req.url);
    res.render('adduser', { title: 'Add-User' });
})

//route for users/withvar
router.get('/users/:id', (req, res) => {
    const id = req.params.id;
    User.findById(id)
        .then(result => {
            res.render('details', { user: result, action: 'edit', title: 'User Details' });
        })
        .catch(err => {
            console.log(err);
        });
});

//route for edit/name/action variable that will display current value to input field
router.get('/edit/:name/:action', (req, res) => {
    const name = req.params.name;
    console.log("req made on" + req.url);
    User.findOne({ name: name })
        .then(result => {
            res.render('edit', { user: result, title: 'Edit-User' });
        })
        .catch(err => {
            console.log(err);
        });
})

//submitting data routes
router.post('/user/create', (req, res) => {
    console.log("POST req made on" + req.url);
    console.log("Form submitted to server");


    /*Note: when you are passing form obj directly to collection using model you
            have to give same name in form of that data that is to be passed in database 
            and that name is declared inside schema*/
    const user = new User(req.body); //passing object of form data directly to collection
    user.save() //then saving this to database and this return promise
        .then(result => {
            res.redirect('/users');//is success save this will redirect to home page
        })
        .catch(err => { //if data not saved error showed
            console.log(err);
        });

})

//route for updating users data
router.post('/edit/:id', (req, res) => {
    console.log("POST req made on" + req.url);
    User.updateOne({ _id: req.params.id }, req.body) //then updating that user whose id is get from url 
        //first passing id which user is to be updated than passing update info
        .then(result => {
            res.redirect('/users');//is success save this will redirect to home page
            req.flash('success','Users Profile Updated');
            console.log("Users profile Updated");
        })
        .catch(err => { //if data not saved error showed
            console.log(err);
        });

})


//routes for deleting users by getting users name from url then finding that  users then doing delete
router.post('/users/:name', (req, res) => { //form action of details.ejs pass name of user that later is assume as name
    const name = req.params.name;
    console.log(name);
    User.deleteOne({ name: name })
        .then(result => {
            res.redirect('/users');
        })
        .catch(err => {
            console.log(err);
        });
})

//404 errors routes
//this will auto run incase no routes
//Note: must put this route at last route list
// router.use((req, res) => {
//     console.log("req made on" + req.url);
//     res.render('404', { title: 'NotFound' });
// })


router.get('/logout', (req, res) => {
    req.flash("success","Logout successful");
    console.log('Logout Successful')
    res.redirect('login');
})
module.exports = router;