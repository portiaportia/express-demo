const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
    {id:1,name:'course1'},
    {id:2,name:'course2'},
    {id:3,name:'course3'},
];

app.get('/',(req,res)=>{
    res.send('hello world!!!');
});

app.get('/api/courses',(req,res)=>{
    res.send(courses);
});

app.get('/api/courses/:id',(req,res)=>{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) {
        res.status(404).send('The course with the given ID was not found');
        return;
    }
    res.send(course);
});

app.post('/api/courses',(req,res)=>{
    const {error} = validateCourse(req.body);   //result.error
        
    if(error){
        //400 bad request
        res.status(400).send(error.details[0].message);
        return;
    }
    
    const course = {
        id: courses.length+1,
        name:req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id',(req,res)=>{
    //Look up a course
    //if not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) {
        res.status(404).send('The course with the given ID was not found');
        return;
    }

    const {error} = validateCourse(req.body);   //result.error
    
    if(error){
        //400 bad request
        res.status(400).send(error.details[0].message);
        return;
    }

    //update course
    //return the updated course to the client
    course.name = req.body.name;
    res.send(course);
});

function validateCourse(course){
    //validate the coruse
    //if invalid return 400 - bad request
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course,schema);
}

app.delete('/api/courses/:id',(req,res)=>{
    //Look up the course
    //Not exisiting, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) {
        res.status(404).send('The course with the given ID was not found');
        return;
    }

    //Delete
    const index = courses.indexOf(course);
    courses.splice(index,1);

    //Return the same course
    res.send(course);
})

const port = process.env.PORT || 3000;
app.listen(port,()=>console.log(`listening on port ${port}...`));