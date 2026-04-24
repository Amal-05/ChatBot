const mongoose = require('mongoose');
const categoryModel = require('./Model/CategoryMode');
const QuestionModel = require('./Model/QuestionModel');

async function seed() {
    try {
        const db = require('./config/db');
        await db();

        console.log("Clearing old data...");
        await categoryModel.deleteMany({});
        await QuestionModel.deleteMany({});

        console.log("Inserting new categories...");
        const categories = [
            { name: "Departments", Subname: "Explore" },
            { name: "About Us", Subname: "Info" },
            { name: "Admissions", Subname: "Apply" },
            { name: "Facilities", Subname: "Campus" }
        ];
        
        await categoryModel.insertMany(categories);

        console.log("Inserting new questions/subcategories...");
        const questions = [
            // Departments
            { category: "Departments", Subcategory: "Dept", question: "Computer Engineering", answer: "Department of Computer Engineering was established in the year 2000. It offers a Three Year Diploma in Computer Engineering." },
            { category: "Departments", Subcategory: "Dept", question: "Civil Engineering", answer: "The Department of Civil Engineering is one of the oldest and pioneer departments in the institution, producing successful technocrats and entrepreneurs." },
            { category: "Departments", Subcategory: "Dept", question: "Mechanical Engineering", answer: "Started in the year 1958, presently the department offers a Diploma programme in Mechanical Engineering." },
            { category: "Departments", Subcategory: "Dept", question: "Electrical & Electronics Engineering", answer: "This department started functioning from 1958 and provides a three year full time Diploma program." },
            { category: "Departments", Subcategory: "Dept", question: "Electronics & Communication Engineering", answer: "Department of Electronics and Communication Engineering was established in the year 2000." },
            
            // About Us
            { category: "About Us", Subcategory: "Info", question: "When was the college established?", answer: "N. S. S. Polytechnic College was established in 1958 and is one of the oldest Grant-in-aid Polytechnic Colleges in Kerala." },
            { category: "About Us", Subcategory: "Info", question: "Who founded the college?", answer: "It was started by the legend Bharatha Kesari Padmabhushan Sri Mannathu Padmanabhan under the banner of Nair Service Society." },
            { category: "About Us", Subcategory: "Info", question: "What is the vision of the college?", answer: "To impart quality technical education and develop skilled technicians with social commitment." },

            // Admissions
            { category: "Admissions", Subcategory: "Apply", question: "How can I apply for admission?", answer: "Admissions for both Regular and Lateral Entry can be applied for online through polyadmission.org." },
            { category: "Admissions", Subcategory: "Apply", question: "Where is the syllabus?", answer: "The REV2021 diploma syllabus and rules can be downloaded from the 'Downloads' section on our official website." },

            // Facilities
            { category: "Facilities", Subcategory: "Campus", question: "What facilities are on campus?", answer: "We have a Central Library, a Common Internet Lab, and an active Career Guidance & Placement Cell." },
            { category: "Facilities", Subcategory: "Campus", question: "What extracurriculars are available?", answer: "Students can participate in the National Cadet Corps (NCC), National Service Scheme (NSS), Sports/Physical Education, and the Green Club." }
        ];

        await QuestionModel.insertMany(questions);
        
        console.log("Seeding complete!");
        process.exit(0);
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
}

seed();
