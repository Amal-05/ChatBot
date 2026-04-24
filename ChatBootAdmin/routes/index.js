var express = require('express');
var router = express.Router();
var categoryModel = require('../Model/CategoryMode')
var QuestionModel = require('../Model/QuestionModel')
var AvatarMOdel = require('../Model/AvatarsModel')
// const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

const requireAuth = (req, res, next) => {
  if (req.session && req.session.isAdmin) {
    next();
  } else {
    res.redirect('/?error=unauthorized');
  }
};

/* GET home page. */
router.get('/', function(req, res, next) {
  const error = req.query.error;
  let errorMessage = null;
  if (error === 'invalid_credentials') errorMessage = "Invalid email or password.";
  if (error === 'unauthorized') errorMessage = "Please log in to access the dashboard.";
  res.render('Admin/Login', { title: 'Express', errorMessage });
});

router.get('/home', requireAuth, async (req,res)=>{
  let category =  await categoryModel.find()
  let question = await QuestionModel.find()
  let avatar = await AvatarMOdel.find()
  console.log(category)
  res.render('Admin/Home',{category,question,avatar})
})

router.post('/login',(req,res)=>{
  try {
    let {email, password} = req.body;
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@gamil.com';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '123';
    
    if(email === ADMIN_EMAIL && password === ADMIN_PASSWORD){
      req.session.isAdmin = true;
      res.redirect('/home')
    } else {
      res.redirect('/?error=invalid_credentials')
    }
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) console.log(err);
      res.redirect('/');
    });
  } else {
    res.redirect('/');
  }
});

router.post('/AddCategory', requireAuth, async (req,res)=>{
  try {
      console.log(req.body)
     await  categoryModel.create(req.body)
     res.redirect('/home')
  } catch (error) {
    console.log(error)
  }
})

router.get('/deletCategory/:id', requireAuth, async (req,res)=>{
  try {
    let id = req.params.id
    await categoryModel.deleteOne({_id:id})
    console.log("deleted")
    res.redirect('/home')
  } catch (error) {
    console.log(error)
  }
})
router.post('/addQuestion', requireAuth, async (req,res)=>{
  try {
    await QuestionModel.create(req.body)
    console.log("added questions")
    res.redirect('/home')
  } catch (error) { 
    console.log(error) 
  }
})

router.get('/delete-question/:id', requireAuth, async(req,res)=>{
  try {
    let id = req.params.id
    await QuestionModel.deleteOne({_id:id})
    console.log("deleted")
    res.redirect('/home')
  } catch (error) {
    console.log(error)
  }
})
router.post('/add-avatar', requireAuth, async(req,res)=>{
  try {
    console.log(req.body)
    await  AvatarMOdel.create(req.body)
    res.redirect('/home')
  } catch (error) {
    console.log(error); 
  }
})

router.get('/delete-avatar/:id', requireAuth, async (req,res)=>{
  try {
      let id = req.params.id
      await AvatarMOdel.deleteOne({_id:id})
      res.redirect('/home')
  } catch (error) {
    console.log(error)
  }
})
router.get('/get-avatar',async (req,res)=>{
  try {
    console.log("geting avatar")
    let avatar = await AvatarMOdel.find()
    avatar = avatar[0]
    res.json(avatar)
  } catch (error) {
    
  }
})
router.get('/Get-answer',async (req,res)=>{
  try {
    let {id} =req.body;
    let answer = await QuestionModel.find({_id:id})
    res.json(answer)
  } catch (error) {
    res.json("error while fetch data")
  }
})
router.get('/get-allCategory', async(req,res)=>{
  try {
    let category = await categoryModel.find()
    res.json(category)
  } catch (error) {
    console.log(error)
  }
})
router.get('/get-categoryBasedQuestion/:cate',async (req,res)=>{
  try {
    let cate = req.params.cate
    let question = await QuestionModel.find({category:cate})
    console.log(question)
    res.json(question)
  } catch (error) {
    console.log(error)
  }
})

const gemini_api_key = process.env.GEMINI_API_KEY;
if (!gemini_api_key) {
  console.error("WARNING: GEMINI_API_KEY is not defined in the environment variables!");
}
const googleAI = new GoogleGenerativeAI(gemini_api_key);

const path = require('path');

const websiteDataPath = path.join(__dirname, '../website_data.md');
let websiteContext = "";
try {
  websiteContext = fs.readFileSync(websiteDataPath, 'utf8');
} catch(e) {
  console.log("Could not load website_data.md");
}

router.post('/get-webisteQueston', async (req, res) => {
try {
  console.log(req.body)
  const geminiConfig = {
    temperature: 0.9,
    topP: 1,
    topK: 1,
    maxOutputTokens: 4096,
  };
  const geminiModel = googleAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    geminiConfig,
  });
  const generate = async () => {
    try {
      let {question} = req.body
      
      const prompt = `You are an expert college assistant for NSS Polytechnic College Pandalam.
Use the following information scraped directly from the official website to answer the user's question accurately and concisely.

Website Information:
${websiteContext}

User Question: ${question}`;
      
      const result = await geminiModel.generateContent(prompt);
      const response = result.response;
      console.log(response.text());
      res.json(response.text());
    } catch (error) {
      console.log("response error", error);
      res.status(500).json({ answer: "Sorry, I am having trouble connecting to my AI brain." });
    }
  };
   
  generate();
} catch (error) {
  console.log(error)
  res.status(500).json({ answer: "Server error." });
}
});
module.exports = router;
