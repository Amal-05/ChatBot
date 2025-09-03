var express = require('express');
var router = express.Router();
var categoryModel = require('../Model/CategoryMode');
var QuestionModel = require('../Model/QuestionModel');
var AvatarMOdel = require('../Model/AvatarsModel');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

// Load environment variables
require("dotenv").config();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('Admin/Login', { title: 'Express' });
});

router.get('/home', async (req,res)=>{
  let category =  await categoryModel.find();
  let question = await QuestionModel.find();
  let avatar = await AvatarMOdel.find();
  res.render('Admin/Home',{category,question,avatar});
});

router.post('/login',(req,res)=>{
  try {
    let {email, password} = req.body;
    if(email === 'admin@gmail.com' && password === '123'){
      res.redirect('/home');
    } else {
      res.redirect('/');
    }
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.post('/AddCategory', async (req,res)=>{
  try {
     await categoryModel.create(req.body);
     res.redirect('/home');
  } catch (error) {
    console.log(error);
  }
});

router.get('/deletCategory/:id',async (req,res)=>{
  try {
    let id = req.params.id;
    await categoryModel.deleteOne({_id:id});
    res.redirect('/home');
  } catch (error) {
    console.log(error);
  }
});

router.post('/addQuestion',async (req,res)=>{
  try {
    await QuestionModel.create(req.body);
    res.redirect('/home');
  } catch (error) { 
    console.log(error); 
  }
});

router.get('/delete-question/:id',async(req,res)=>{
  try {
    let id = req.params.id;
    await QuestionModel.deleteOne({_id:id});
    res.redirect('/home');
  } catch (error) {
    console.log(error);
  }
});

router.post('/add-avatar', async(req,res)=>{
  try {
    await AvatarMOdel.create(req.body);
    res.redirect('/home');
  } catch (error) {
    console.log(error); 
  }
});

router.get('/delete-avatar/:id',async (req,res)=>{
  try {
      let id = req.params.id;
      await AvatarMOdel.deleteOne({_id:id});
      res.redirect('/home');
  } catch (error) {
    console.log(error);
  }
});

router.get('/get-avatar',async (req,res)=>{
  try {
    let avatar = await AvatarMOdel.find();
    avatar = avatar[0];
    res.json(avatar);
  } catch (error) {
    console.log(error);
  }
});

router.get('/Get-answer',async (req,res)=>{
  try {
    let {id} = req.body;
    let answer = await QuestionModel.find({_id:id});
    res.json(answer);
  } catch (error) {
    res.json("error while fetch data");
  }
});

router.get('/get-allCategory', async(req,res)=>{
  try {
    let category = await categoryModel.find();
    res.json(category);
  } catch (error) {
    console.log(error);
  }
});

router.get('/get-categoryBasedQuestion/:cate',async (req,res)=>{
  try {
    let cate = req.params.cate;
    let question = await QuestionModel.find({category:cate});
    res.json(question);
  } catch (error) {
    console.log(error);
  }
});

// ✅ Gemini API now from environment variable
const googleAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/get-webisteQueston', async (req, res) => {
  try {
    const geminiModel = googleAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        temperature: 0.9,
        topP: 1,
        topK: 1,
        maxOutputTokens: 4096,
      }
    });
    
    let { question } = req.body;
    const filePath = path.join(__dirname, "../public/File/Content.txt");
    
    fs.readFile(filePath, "utf8", async (err, textContent) => {
      if (err) {
        console.log("Error reading file:", err);
        return res.status(500).json({ error: "Could not read content file" });
      }
      
      const prompt = `Based on this information about NSS Polytechnic College Pandalam: ${textContent}, answer the following question: ${question}`;
      
      try {
        const result = await geminiModel.generateContent(prompt);
        const response = result.response;
        res.json(response.text());
      } catch (apiError) {
        console.log("API error:", apiError);
        res.status(500).json({ error: "Failed to get response from AI model" });
      }
    });
  } catch (error) {
    console.log("Route error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
