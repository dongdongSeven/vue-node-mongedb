/**
 * Created by Administrator on 2017/10/30.
 */
let express=require('express');
let router=express.Router();
let mongoose=require('mongoose');
let Goods=require('../models/goods');
let DB_CONN_STR='mongodb://127.0.0.1:27017/db_demo';
//连接MongoDB数据库
mongoose.connect(DB_CONN_STR);

mongoose.connection.on("connected",function () {
  console.log("MongoDB connected success.");
});

mongoose.connection.on("error",function () {
  console.log("MongoDB connected fail.");
});

mongoose.connection.on("disconnected",function () {
  console.log("MongoDB connected disconnected.");
});

//查询商品列表数据
router.get("/list",function(req,res,next){
  let page=parseInt(req.query.page);
  let pageSize=parseInt(req.query.pageSize);
  let priceLevel=req.query.priceLevel;
  let sort=req.query.sort;
  let skip=(page-1)*pageSize;
  let priceGt='',priceLte='';
  let params={};
  if(priceLevel!='all'){
    switch (priceLevel){
      case '0':priceGt=0;priceLte=100;break;
      case '1':priceGt=100;priceLte=500;break;
      case '2':priceGt=500;priceLte=1000;break;
      case '3':priceGt=1000;priceLte=5000;break;
    }
    params={
      salePrice:{
        $gt:priceGt,
        $lte:priceLte
      }
    }
  }
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({'salePrice':sort});
  goodsModel.exec(function (err, doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message
      });
    }else{
      res.json({
        status:'0',
        msg:'',
        result:{
          count:doc.length,
          list:doc
        }
      });
    }
  });
});


//加入到购物车
router.post("/addCart",function (req, res, next) {
  let userId='100000077',productId=req.body.productId;
  let User=require('../models/user');
  User.findOne({userId:userId},function (err, userDoc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message
      })
    }else{
      console.log("userDoc:"+userDoc);
      if(userDoc){
        let goodsItem='';
        userDoc.cartList.forEach(function (item) {
          if(item.productId==productId){
            goodsItem=item;
            item.productNum++;
          }
        });
        if(goodsItem){
          userDoc.save(function (err2, doc2) {
            if(err2){
              res.json({
                status:'1',
                msg:err2.message
              })
            }else{
              res.json({
                status:'0',
                msg:'',
                result:'success'
              })
            }
          })
        }else{
          Goods.findOne({productId:productId},function (err1,doc) {
            if(err1){
              res.json({
                status:'1',
                msg:err1.message
              })
            }else {
              if(doc){
                doc.productNum=1;
                doc.checked=1;
                userDoc.cartList.push(doc);
                userDoc.save(function (err2, doc2) {
                  if(err2){
                    res.json({
                      status:'1',
                      msg:err2.message
                    })
                  }else{
                    res.json({
                      status:'0',
                      msg:'',
                      result:'success'
                    })
                  }
                });
              }
            }
          })
        }
      }
    }
  })
});
module.exports = router;
