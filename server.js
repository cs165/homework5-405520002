const express = require('express');
const bodyParser = require('body-parser');
const googleSheets = require('gsa-sheets');

const key = require('./privateSettings.json');

// TODO(you): Change the value of this string to the spreadsheet id for your
// GSA spreadsheet. See HW5 spec for more information.
const SPREADSHEET_ID = '1vGR-krxFNCCmweh7BaPhaX0Nk8vyFoKUfGrvEKGBFWk';

const app = express();
const jsonParser = bodyParser.json();
const sheet = googleSheets(key.client_email, key.private_key, SPREADSHEET_ID);

app.use(express.static('public'));

async function onGet(req, res) {
  const result = await sheet.getRows();
  const rows = result.rows;
  // }
  console.log(rows);

  // TODO(you): Finish onGet.

  res.json( rows.splice(1,rows.length) );
}
app.get('/api', onGet);

async function onPost(req, res) {
  const messageBody = req.body;
  const a=Object.values(messageBody);
  // console.log(messageBody['name']);
  console.log(JSON.stringify(messageBody));
  console.log(messageBody);
  console.log(a);
  var array= ['',''];
  console.log(a.length);
  for(let i=0;i<a.length;i++){
  if(Object.keys(messageBody)[i]=='name'||'email'){
  array[0]=messageBody['name'];
  array[1]=messageBody['email'];
  }
  }
    
    
  
  console.log(array);
  sheet.appendRow(array);


  

  // TODO(you): Implement onPost.

  res.json( { respond:'success'} );
}
app.post('/api', jsonParser, onPost);

async function onPatch(req, res) {
  const column  = req.params.column;
  const value  = req.params.value;
  const messageBody = req.body;
  console.log(column);
  console.log(value);
  const result=await sheet.getRows();
  const rows=result.rows;
  console.log(result.rows);
  const column_array=[];
  for(let i=1;i<rows.length;i++){
    column_array.push(Object.values(rows)[i][0]);
  }
  console.log(column_array);
   const update_index=column_array.indexOf(value);
   console.log(update_index);
   if(update_index!=-1){
   sheet.setRow(update_index+1,[value,messageBody['email']]);
   }
   else{
     console.log('not found');
   }
  

  // TODO(you): Implement onPatch.

  res.json( { status: 'success'} );
}
app.patch('/api/:column/:value', jsonParser, onPatch);

async function onDelete(req, res) {
  const column  = req.params.column;
  const value  = req.params.value;
  const result = await sheet.getRows();
  const rows = result.rows;
  const data=res.body;
  var delete_index=0;
  console.log(rows);
  console.log(column);
  console.log(value);
  console.log(Object.values(rows)[1][0]);
  const column_array=[];
  for(let i=1;i<rows.length;i++){
    column_array.push(Object.values(rows)[i][0]);
  }

  delete_index=column_array.indexOf(value);
  console.log(delete_index);
  
  console.log('column:'+column_array);
  if(delete_index!=-1){
  sheet.deleteRow(delete_index+1);
  }
  else{
    console.log('not found the name');
  }

  // TODO(you): Implement onDelete.

  res.json( { status: 'success'}) ;
}
app.delete('/api/:column/:value',  onDelete);


// Please don't change this; this is needed to deploy on Heroku.
const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log(`Server listening on port ${port}!`);
});
