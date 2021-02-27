//import logo from './logo.svg';
import './App.css';
import {Typography, AppBar, Toolbar, CssBaseline, TextField, makeStyles, Button, Paper, TableContainer, TableHead, TableCell, TableBody, TableRow, Table, Select, FormControl, InputLabel, MenuItem, FormHelperText, Box} from '@material-ui/core';
import {Container} from '@material-ui/core';
import { useState, useEffect, Fragment } from 'react';
import axios from './axios';

const useStyles = makeStyles((theme) => ({
  toolbar:theme.mixins.toolbar,
  paper:{
    display:'flex',
    flexDirection:'column',
  },
  table:{
    border:'1px solid black',
    marginTop:'2rem',
  },
  tableHead:{
    background:'green',
    
  },
  tableBody:{
    background:'lightgrey',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },

}))
function App() {
  const classes = useStyles();
  const [firstName, setfirstName] = useState('');
  const [secondName, setsecondName] = useState("");
  const [relation, setrelation] = useState('');
  const [data, setdata] = useState(null);
  useEffect(() => {
    async function getData(){
      await axios.get('/users')
      .then((response,err) =>{
        if(err){
          console.log('error in geeting data ',err);
        }
        else{
          console.log('the data received ',response.data);
          setdata(response.data);
        }
      })
    }
    getData();
  },[])
  const selectArray = [];
  if(data!=null && data.length!=0){
    for (let el of data){
      if (!selectArray.includes(el.firstName)){
        selectArray.push(el.firstName);
      }
      if (!selectArray.includes(el.secondName)){
        selectArray.push(el.secondName);
      }
    }
  }
  
  console.log('select array ',selectArray);
  async function submitData(){
      await axios.post('/createuser',{
        firstName:firstName,
        secondName:secondName,
        relation:relation,
      }).then((response,err) => {
        if(err){
          console.log('error on the dusbmit data ',err);
        }
        else{
          console.log('data after submititing ',response.data);
          setfirstName('');
          setsecondName('');
          setrelation('');
        }
      })
  }
  const [selectedPersons, setselectedPersons] = useState([]);
  const [error, seterror] = useState(false);
  const handleChange  = (e) => {
    if(selectedPersons.length<2){
      setselectedPersons([...selectedPersons,e.target.value])
      seterror(false);
    }
    else{
      seterror('Only two persons can be selected');
    }   
  }
  console.log('selected persons ',selectedPersons);
  let final='';
const [result, setresult] = useState(null);  
const [relatedPersons, setrelatedPersons] = useState([]);
  const handleRelation = (e) => {
    e.preventDefault();
    let search=selectedPersons[1];
    let i=0;
    let newState = {}
    while(i<data.length){
      console.log('search',search);
      if(search == data[i].firstName){
        console.log('matched inside ',data[i].secondName)
        let name=data[i].secondName
        newState[name]=name;
        setrelatedPersons([...relatedPersons,name])
        search=data[i].secondName;
        i=0;
      }
      else if(search == data[i].secondName){
        console.log('matched inside ',data[i].firstName)
        let name=data[i].firstName
        newState[name]=name;
        setrelatedPersons([...relatedPersons,name])
        search=data[i].firstName;
        i=0;
      }
      if(search == selectedPersons[0]){
        setrelatedPersons([...relatedPersons,selectedPersons[0]]);
        console.log('mathced')
        break;
      }
      i++;
    }
    //relatedPersons([...relatedPersons,newState]);
    console.log('new state ',newState)
    setresult(newState);

  }
  console.log('realtionshiop of the persons ',relatedPersons,result);
  return (
    <div >
      <Container maxWidth="lg">
        <CssBaseline/>
          <AppBar position='absolute' >
            <Toolbar>
              <Typography variant='h4' color='inherit'>Test Bar</Typography>
            </Toolbar>
          </AppBar>
          <main>
            <Container className={classes.paper} maxWidth='sm'>
            <div className={classes.toolbar} />
              <Typography variant='body1' style={{paddingTop:'1rem'}}>First Person</Typography>
              <TextField 
                autoComplete='name'
                variant='outlined'
                margin='normal'
                name='firstName'
                value={firstName}
                onChange={(e) => setfirstName(e.target.value)}
                label='FirstName'
                autoFocus
                required
                //style={{width: '50%'}}
              />
              <Typography variant='body1' style={{paddingTop:'1rem'}}>Second Person</Typography>
              <TextField 
                autoComplete='relation'
                variant='outlined'
                margin='normal'
                name='secondName'
                label='secondName'
                value={secondName}
                onChange={(e) => setsecondName(e.target.value)}
                //style={{width: '50%'}}
              />
               <Typography variant='body1' style={{paddingTop:'1rem'}}>Add Relation</Typography>
              <TextField 
                autoComplete='relation'
                variant='outlined'
                margin='normal'
                name='relation'
                label='relation'
                value={relation}
                onChange={(e) => setrelation(e.target.value)}
                //style={{width: '50%'}}
              />
              <Button variant='contained' 
              //style={{width:'50%'}} 
              color='secondary' onClick={submitData}>
                Add
              </Button> 
              {
                data!=null && data.length>1 && (
                  <Fragment>
                  <Typography style={{paddingTop:'2rem'}}>Select Two Persons</Typography>
                  <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-helper-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {selectArray.length!=0 &&selectArray.map(ele => (
            
          //<MenuItem value={10}>Ten</MenuItem>
          //<MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={ele}>{ele}</MenuItem>
          
          ))}
          
        </Select>
        <FormHelperText>Select a person</FormHelperText>
      </FormControl>
      </Fragment>
                )
              }
              {
                error && <Box p={1} style={{color:'red'}}>{error}</Box>
              }
              {
                selectedPersons.length!==0 && selectedPersons.map(thing => (
                    <Box key={thing}>{thing}</Box>
  ))
              }
              {selectedPersons.length==2 && 
              <Button variant='contained' color='primary' onClick={handleRelation}>
                check the Relationship chain
              </Button>}
              {result!=null &&
              Object.entries(result).map(([key,value]) => {
                final=final+value+' -->'
              })}
              {final && <Box p={1} style={{color:'red'}}>{selectedPersons[1]+' --> '+final}</Box>
              }
              
            </Container>

            <TableContainer component='Paper'>
              {data!=null && (
                <Table aria-label="simple table" className={classes.table}>
                <TableHead className={classes.tableHead} >
                  <TableRow >
                    <TableCell style={{color:'white',fontSize:'1rem'}}><b>First Person</b></TableCell>
                    <TableCell style={{color:'white',fontSize:'1rem'}}><b>Relation</b></TableCell>
                    <TableCell style={{color:'white',fontSize:'1rem'}}><b>Second Person</b></TableCell>
                  </TableRow>
                  
                </TableHead>
                <TableBody className={classes.tableBody}> 
                  {data.map(item => (
                    <TableRow>
                    <TableCell><p>{item.firstName}</p></TableCell>
                    <TableCell><p>{item.relation}</p></TableCell>
                    <TableCell><p>{item.secondName}</p></TableCell>
                  </TableRow>
                  ))}
                  
                </TableBody>
              </Table>
              )}
              
            </TableContainer>
          </main>
      </Container>
    </div>
  );
}

export default App;
