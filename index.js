const express = require ("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors')
let Bill = require('./billModal')

mongoose.connect("mongodb+srv://root:salman123@cluster0.aj7wm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", () => {
  console.log("mongodb Connected");
})

const app = express();

app.use(cors())

app.use(bodyParser.urlencoded({extended:false}))

app.use(bodyParser.json())

app.get("/bill/:id",(req,res)=>{
    let id=req.params.id;
    Bill.find({invoiceId:id},(err,bill)=>{
      console.log(bill);
      res.send(bill)
    })
})

app.get("/bill", (req,res)=>{
  let id=req.params.id;

  Bill.find({},(err,bill)=>{
    res.send({bills: bill})
  })
  
})

app.post("/bill",(req,res)=>{
    console.log(req.body);
    const {name,invoiceId,date,items,total}=req.body;
    let bill = new Bill()
    bill.name=name
    bill.date = date
    bill.items=items
    bill.total=total

    Bill.findOne().sort({$natural: -1}).limit(1).exec((err, resp)=>{
      if(err){
          console.log(err);
      }
      else{
          console.log(resp);
          if(resp == null){
            bill.invoiceId = 1

            bill.save((err)=>{
              if(err){
                res.send({message:"Error"})
                console.log("Error:",err);
              }else{
                res.send({message:"Success", bill: bill})
                console.log("Save");
              }
            })
          }else{
            bill.invoiceId = resp.invoiceId + 1
            bill.save((err)=>{
              if(err){
                res.send({message:"Error"})
                console.log("Error:",err);
              }else{
                res.send({message:"Success", bill: bill})
                console.log("Save");
              }
            })
          }
      }
    })
})


app.listen(process.env.PORT || 3001,function(){
    console.log("Server Started");
})
