/**
 * Created by Administrator on 2017/10/30.
 */
let mongoose=require("mongoose");
let productSchema=new mongoose.Schema({
  "productId":{type:String},
  "productName":String,
  "salePrice":Number,
  "checked":String,
  "productNum":Number,
  "productImage":String
});

module.exports=mongoose.model('Good',productSchema);
