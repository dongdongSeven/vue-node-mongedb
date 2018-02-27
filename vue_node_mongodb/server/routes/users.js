let express = require('express');
let router = express.Router();
let User=require("./../models/user");
require("./../util/util");
/* GET users listing. */
router.get('/test', function(req, res, next) {
  res.send('respond with a resource');
});
//登录
router.post("/login",function (req, res, next) {
  let param={
    userName:req.body.userName,
    userPwd:req.body.userPwd
  };
  User.findOne(param,function (err, doc) {
    if(err){
      console.log("err");
      res.json({
        status:'1',
        msg:err.message
      })
    }else{
      if(doc){
        res.cookie("userId",doc.userId,{
          path:'/',
          maxAge:100*60*60
        });
        res.cookie("userName",doc.userName,{
          path:'/',
          maxAge:100*60*60
        });
        // req.session.user = doc;
        res.json({
          status:'0',
          msg:'',
          result:{
            userName:doc.userName
          }
        })
      }
    }
  });
});
//登出
router.post("/logout",function (req, res, next) {
  res.cookie("userId",'',{
    path:'/',
    maxAge:-1
  });
  res.json({
    status:'0',
    msg:'',
    result:''
  })
});
//检测登录
router.get("/checkLogin",function (req, res, next) {
  if(req.cookies.userId){
    res.json({
      status:'0',
      msg:'',
      result:req.cookies.userName || ''
    })
  }else {
    res.json({
      status:'1',
      msg:"未登录",
      result:''
    })
  }
});
//查询当前用户得到购物车数据
router.get('/cartList',function (req, res, next) {
  let userId=req.cookies.userId;
  User.findOne({userId:userId},function (err, doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      if(doc){
        res.json({
          status:'0',
          msg:'',
          result:doc.cartList
        })
      }
    }
  })
});
//购物车删除
router.post("/cartDel",function (req, res, next) {
  let userId=req.cookies.userId,
    productId=req.body.productId;
  User.update({
    userId:userId
  },{
    $pull:{
      'cartList':{
        'productId':productId
      }
    }
  },function (err, doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      res.json({
        status:'0',
        msg:'',
        result:'success'
      })
    }
  });
});
//修改商品数量
router.post('/cartEdit',function (req,res,next) {
  let userId=req.cookies.userId,
    productId=req.body.productId,
    productNum=req.body.productNum,
    checked=req.body.checked;
  User.update({"userId":userId,"cartList.productId":productId},{
    "cartList.$.productNum":productNum,
    "cartList.$.checked":checked
  },function (err, doc) {
    if(err){
      res.json({
        status:'1',
        msg:'',
        result:err.message
      })
    }else{
      res.json({
        status:'0',
        msg:'',
        result:'success'
      })
    }
  });
});

router.post('/editCheckAll',function (req, res, next) {
  let userId = req.cookies.userId,
      checkAll = req.body.checkAll?'1':'0';
  User.findOne({'userId':userId},function (err, doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      if(doc){
        doc.cartList.forEach(item=> {
          item.checked=checkAll
        });
        doc.save(function (err1, doc2) {
          if(err1){
            res.json({
              status:'1',
              msg:err1.message,
              result:''
            })
          }else{
            res.json({
              status:'0',
              msg:'',
              result:'success'
            })
          }
        })
      }
    }
  });
});
//查询用户地址接口
router.get('/address',function (req, res, next) {
  let userId=req.cookies.userId;
  User.findOne({userId:userId},function (err, doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      res.json({
        status:'0',
        msg:'',
        result:doc.addressList
      });
    }
  });
});
//设置默认地址接口
router.post("/setDefault",function (req, res, next) {
  let userId=req.cookies.userId,
      addressId = req.body.addressId;
  if(!addressId){
    res.json({
      status:'1003',
      msg:'addressId in null',
      result:''
    });
  }else{
    User.findOne({userId:userId},function (err, doc) {
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });
      }else{
        let addressList=doc.addressList;
        addressList.forEach(item=> {
          if(addressId==item.addressId){
            item.isDefault=true;
          }else{
            item.isDefault=false;
          }
        });
        doc.save(function (err1, doc1) {
          if(err1){
            res.json({
              status:'1',
              msg:err1.message,
              result:''
            });
          }else{
            res.json({
              status:'0',
              msg:'',
              result:''
            });
          }
        })
      }
    });
  }
});
//删除地址接口
router.post("/delAddress",function (req, res, next) {
  let userId=req.cookies.userId,
      addressId=req.body.addressId;
  User.update({userId:userId},{
    $pull:{
      'addressList':{
        'addressId':addressId
      }
    }
  },function (err, doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      res.json({
        status:'0',
        msg:'',
        result:''
      })
    }
  });
});

router.post("/payMent",function (req, res, next) {
  let userId=req.cookies.userId,
      addressId=req.body.addressId,
      orderTotal=req.body.orderTotal;
  User.findOne({userId:userId},function (err, doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      let address='',goodsList=[];
      //获取当前用户的地址信息
      doc.addressList.forEach(item=> {
        if(item.addressId==addressId){
          address=item;
        }
      });
      //获取用户购物车的购买商品
      doc.cartList.filter(item=> {
        if(item.checked=='1'){
          goodsList.push(item);
        }
      });
      let platform='622',
          r1=Math.floor(Math.random()*10),
          r2=Math.floor(Math.random()*10),
          sysDate=new Date().Format("yyyyMMddhhmmss"),
          createDate=new Date().Format('yyyy-MM-dd hh:mm:ss'),
          orderId=platform+r1+sysDate+r2,
          order={
            orderId:orderId,
            addressInfo:address,
            orderTotal:orderTotal,
            goodsList:goodsList,
            orderStatus:'1',
            createDate:createDate
          };
      doc.orderList.push(order);
      doc.save(function (err1, doc1) {
        if(err1){
          res.json({
            status:'1',
            msg:err1.message,
            result:''
          })
        }else{
          res.json({
            status:'0',
            msg:'',
            result:{
              orderId:order.orderId,
              orderTotal:order.orderTotal
            }
          });
        }
      });
    }
  });
});

router.get("/orderDetail",function (req, res, next) {
  let userId=req.cookies.userId,
      orderId=req.query.orderId;
  User.findOne({userId:userId},function (err, doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      let orderList = doc.orderList;
      if(orderList.length>0){
        let orderTotal = 0;
        orderList.forEach(item=> {
          if(item.orderId==orderId){
            orderTotal=item.orderTotal;
          }
        });
        if(orderTotal>0){
          res.json({
            status:'0',
            msg:'',
            result:{
              orderId,
              orderTotal
            }
          })
        }else{
          res.json({
            status:'120002',
            msg:'无此订单',
            result:''
          })
        }
      }else{
        res.json({
          status:'120001',
          msg:'当前用户未创建订单',
          result:''
        })
      }
    }
  });
});

router.get("/getCartCount",function (req, res, next) {
  if(req.cookies&&req.cookies.userId){
    let userId = req.cookies.userId;
    User.findOne({'userId':userId},function (err, doc) {
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        })
      }else {
        let cartCount = 0;
        doc.cartList.forEach(item=> {
          cartCount +=parseInt(item.productNum);
        });
        res.json({
          status:'0',
          msg:'',
          result:cartCount
        })
      }
    });
  }else{
    res.json({
      status:'1',
      msg:'用户未登录',
      result:''
    })
  }
});
module.exports = router;
