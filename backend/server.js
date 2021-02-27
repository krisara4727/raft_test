import express from 'express';

import mongoose from 'mongoose';
import cors from 'cors';
import Person from './userSchema';

const app = express();
const port = process.env.PORT || 4000;
app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));
mongoose.connect('mongodb://localhost/project',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
});
app.use(cors());
app.post('/createuser',async(req,res) => {
    const person= new Person({
        firstName:req.body.firstName,
        secondName:req.body.secondName,
        relation:req.body.relation
    });
    try{
        const createdPerson = await person.save();
    res.send(createdPerson);
    }catch(err){
        res.status(400).send('Error in creating the user ',err);
    }
    

})
app.get('/',(req,res) => {
    res.send('this is the page')
})
app.get('/users',async(req,res) => {
    const persons = await Person.find();
    res.send(persons);
})
app.delete('/deleteUsers', async(req,res) => {
    await Person.deleteMany({})
    .then((resp,err) => {
        if(err){
                res.send('error in deleteing ',err);
        }
        else{
            res.send('suucefully deleted ');
        }
    })
})


        
app.listen(port , () =>{
    console.log('server started on port ' , port);
})
