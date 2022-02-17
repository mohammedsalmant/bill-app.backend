const express = require ("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors')
let Bill = require('./billModal')
const {Invoice} = require('@axenda/zatca');

const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(`mongodb+srv://root:${process.env.password}@${process.env.cluster}/${process.env.db}?retryWrites=true&w=majority`, () => {
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

    const renderInvoice = async () => {
      const invoice = new Invoice({
        sellerName: 'Axenda',
        vatRegistrationNumber: '1234567891',
        invoiceTimestamp: '2021-12-04T00:00:00Z',
        invoiceTotal: '100.00',
        invoiceVatTotal: '15.00',
      });
      
      return await invoice.render();
    }

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
                console.log("Save");
                renderInvoice().then(data=> {
                  console.log(data);
                  res.send({message:"Success", bill: bill, qr: data})
                }).catch(err=> {
                  console.log(err);
                  res.send({message:"Error"})
                })
              }
            })
          }else{
            bill.invoiceId = resp.invoiceId + 1
            bill.save((err)=>{
              if(err){
                res.send({message:"Error"})
                console.log("Error:",err);
              }else{
                console.log("Save");
                renderInvoice().then(data=> {
                  console.log(data);
                  res.send({message:"Success", bill: bill, qr: data})
                }).catch(err=> {
                  console.log(err);
                  res.send({message:"Error"})
                })
              }
            })
          }
      }
    })
})


app.listen(process.env.PORT || 3001,function(){
    console.log("Server Started");
})
