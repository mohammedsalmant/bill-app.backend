const express = require ("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
let Bill = require('./billModal')


const app =express();


app.use(bodyParser.urlencoded({extended:false}))

app.use(bodyParser.json())

app.get("/bill/:id",(req,res)=>{
    let id=req.params.id;
    Bill.find({invoiceId:id},(err,bill)=>{
      console.log(bill);
      res.send(bill)
    })
})

app.post("/bill",(req,res)=>{
  console.log(req.body);
    const {name,invoiceId,date,items,total}=req.body;
    let bill = new Bill()
    bill.name=name
    bill.invoiceId=invoiceId
    bill.date = date
    bill.items=items
    bill.total=total
  
    bill.save((err)=>{
      if(err){
        res.send({message:"Error"})
        console.log("Error:",err);
      }else{
        res.send({message:"Success"})
        console.log("Save");
      }
    })
})


app.listen(3001,function(){
    console.log("Server Started");
})
