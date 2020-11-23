const express = require("express");
const router = express.Router();
const Lead = require('../models/Lead')
const moment = require('moment')
const { Parser } = require("json2csv");
const nodemailer = require("nodemailer");
const utf8 = require('utf8');
const { v4: uuidv4 } = require('uuid');


//Add the records and create mailkey filter by mailkey email records with dup mailkey in list send dups to react app as buttons with x 
router.post("/", async  (req,res) =>{


const leads = []

  if(Object.keys(req.body[0]).toString().includes("entityName")){
  
   req.body.map(({entityName1, entityName2, address, city, state, zip, filingDate, amount, stateFiled, countyFiled}) => {

  const nameString = entityName1.split(' ')  

  let lastnm 

  if(nameString[nameString.length-1].toLowerCase !== "jr" || nameString[nameString.length-1].toLowerCase !== "sr" || nameString[nameString.length-1].toLowerCase !== "iii" ){
    lastnm = nameString[nameString.length-1] 
  }else {
    lastnm = nameString[nameString.length-2] 
  }
  let obj = {
  fullName: entityName1.includes("&") ? entityName1.substr(entityName1.indexOf("&")+2, entityName1.length) : entityName1,
  firstName: entityName1.includes("&") ? entityName1.substr(entityName1.indexOf("&")+2, entityName1.length).split(' ')[0].toString() : entityName1.split(' ')[0].toString(),
  lastName:  nameString[nameString.length-1].toLowerCase !== "jr" || nameString[nameString.length-1].toLowerCase !== "sr" || nameString[nameString.length-1].toLowerCase !== "iii" ?  nameString[nameString.length-1] :  nameString[nameString.length-2],
  address: address,
  city: city,
  dupId: uuidv4(),
  state: state,
  zip: zip.substring(0,5),
  filingDate:filingDate,
  amount:amount,
  county: countyFiled,
  plaintiff: "Internal Revenue Service",
  fileType: "Federal Tax Lien",
  mailKey: address.split(' ')[0].toString().trim().toLowerCase() + amount.replace("$","").replace(",", "").substr(0,amount.indexOf(".")-1).replace(".",'').trim() + lastnm.toLowerCase(),
  lexisQuery: `type(federal tax lien) and amount (btw ${parseInt(amount.replace("$","").replace(",", "").substr(0,amount.indexOf(".")-1).replace(".",'').trim())-500} and ${parseInt(amount.replace("$","").replace(",", "").substr(0,amount.indexOf(".")-1).replace(".",'').trim())+500}) AND filing-date(is ${filingDate})`,
  loadDate: Intl.DateTimeFormat(
      "en-US",
      { timeZone: "America/Los_Angeles" },
      {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }
    ).format(new Date(Date.now())) 
  }
  return leads.push(obj);
})
} else {
    req.body.map(({fileType, filingDate, loadDate, address, city, state, zip, zip4, plaintiff, amount, entityType, plantiff, deliveryAddress, county, rmsid, firstName, midInit, lastName, suffix, fullName }) => {
    


  let obj = {
  fullName: fullName ? fullName : firstName + midInit + lastName + suffix ,
  firstName: firstName,
  lastName: lastName,
  address: deliveryAddress ? deliveryAddress : address,
  city: city,
  state: state,
  zip: zip4 ? zip4 : zip,
  filingDate:filingDate,
  amount:amount,
  county: county,
  plaintiff: plantiff ? plantiff : plaintiff,
  fileType: fileType,
  mailKey: deliveryAddress ? deliveryAddress.substr(0,deliveryAddress.indexOf(' ')) + amount + lastName.toLowerCase() : address.substr(0,address.indexOf(' ')-1) + amount + lastName.toLowerCase()  ,
  lexisQuery: `type(${fileType}) and amount (btw ${parseInt(amount)-500} and ${parseInt(amount)+500}) AND filing-date(is ${filingDate})`,
  loadDate: loadDate,
  entityType: entityType,
  dupId: uuidv4(),
  county: county, 
  pinCode: rmsid,

  }
  return leads.push(obj);
})
}

var uniq = leads
  .map((lead) => {
    return {
      count: 1,
      mailKey: lead.mailKey
    }
  })
  .reduce((a, b) => {
    a[b.mailKey] = (a[b.mailKey] || 0) + b.count
    return a
  }, {})

  var duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1)

  const dupLeads = leads.filter((lead) => duplicates.includes(lead.mailKey))

  const newLeads = leads.filter((lead)=> !duplicates.includes(lead.mailKey))

  await Lead.insertMany(newLeads)

  res.json(dupLeads)
}) 

//upload files get suppression create mailkey new list by mailkey save new records email unique list 
 router.post("/dup", async (req,res)=>{

  const list = req.body
  const leads = await Lead.insertMany(list);

  res.json(leads);
}) 

 router.post("/new", async (req,res)=>{
 if(Object.keys(req.body[0]).toString().includes("entityName")){
  
   req.body.map(({entityName1, entityName2, address, city, state, zip, filingDate, amount, stateFiled, countyFiled}) => {

  const nameString = entityName1.split(' ')  

  let lastnm 

  if(nameString[nameString.length-1].toLowerCase !== "jr" || nameString[nameString.length-1].toLowerCase !== "sr" || nameString[nameString.length-1].toLowerCase !== "iii" ){
    lastnm = nameString[nameString.length-1] 
  }else {
    lastnm = nameString[nameString.length-2] 
  }
  let obj = {
  fullName: entityName1.includes("&") ? entityName1.substr(entityName1.indexOf("&")+2, entityName1.length) : entityName1,
  firstName: entityName1.includes("&") ? entityName1.substr(entityName1.indexOf("&")+2, entityName1.length).split(' ')[0].toString() : entityName1.split(' ')[0].toString(),
  lastName:  nameString[nameString.length-1].toLowerCase !== "jr" || nameString[nameString.length-1].toLowerCase !== "sr" || nameString[nameString.length-1].toLowerCase !== "iii" ?  nameString[nameString.length-1] :  nameString[nameString.length-2],
  address: address,
  city: city,
  dupId: uuidv4(),
  state: state,
  zip: zip.substring(0,5),
  filingDate:filingDate,
  amount:amount,
  county: countyFiled,
  plaintiff: "Internal Revenue Service",
  fileType: "Federal Tax Lien",
  mailKey: address.split(' ')[0].toString().trim().toLowerCase() + amount.replace("$","").replace(",", "").substr(0,amount.indexOf(".")-1).replace(".",'').trim() + lastnm.replace("-","").toLowerCase(),
  lexisQuery: `type(federal tax lien) and amount (btw ${parseInt(amount.replace("$","").replace(",", "").substr(0,amount.indexOf(".")-1).replace(".",'').trim())-500} and ${parseInt(amount.replace("$","").replace(",", "").substr(0,amount.indexOf(".")-1).replace(".",'').trim())+500}) AND filing-date(is ${filingDate})`,
  loadDate: Intl.DateTimeFormat(
      "en-US",
      { timeZone: "America/Los_Angeles" },
      {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }
    ).format(new Date(Date.now())) 
  }
  return leads.push(obj);
})
} else {
    req.body.map(({fileType, filingDate, loadDate, address, city, state, zip, zip4, plaintiff, amount, entityType, plantiff, deliveryAddress, county, rmsid, firstName, midInit, lastName, suffix, fullName }) => {
    


  let obj = {
  fullName: fullName ? fullName : firstName + midInit + lastName + suffix ,
  firstName: firstName,
  lastName: lastName,
  address: deliveryAddress ? deliveryAddress : address,
  city: city,
  state: state,
  zip: zip4 ? zip4 : zip,
  filingDate:filingDate,
  amount:amount,
  county: county,
  plaintiff: plantiff ? plantiff : plaintiff,
  fileType: fileType,
  mailKey: deliveryAddress ? deliveryAddress.substr(0,deliveryAddress.indexOf(' ')) + amount + lastName.replace("-","").toLowerCase() : address.substr(0,address.indexOf(' ')-1) + amount + lastName.toLowerCase()  ,
  lexisQuery: `type(${fileType}) and amount (btw ${parseInt(amount)-500} and ${parseInt(amount)+500}) AND filing-date(is ${filingDate})`,
  loadDate: loadDate,
  entityType: entityType,
  dupId: uuidv4(),
  county: county, 
  pinCode: rmsid,

  }
  return leads.push(obj);
})
}


const suppressionList = leads.map((lead) => lead.mailKey)


const suppressionLeads = await Lead.find({
    "mailKey": { "$in": suppressionList },
  });


const master = leads.concat.apply(suppressionLeads)

var uniq = master
  .map((lead) => {
    return {
      count: 1,
      mailKey: lead.mailKey
    }
  })
  .reduce((a, b) => {
    a[b.mailKey] = (a[b.mailKey] || 0) + b.count
    return a
  }, {})

  var duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1)

  const dupLeads = master.filter((lead) => duplicates.includes(lead.mailKey))

  const newLeads = master.filter((lead)=> !duplicates.includes(lead.mailKey))

  await Lead.insertMany(newLeads)

  res.json(dupLeads)

}) 




router.delete("/", async (req, res) => {
  try {
Lead.findOneAndRemove({dupId: req.query.q }, 
    function (err, docs) { 
    if (err){ 
        console.log(err) 
    } 
    else{ 
        console.log("Removed User : ", docs); 
    } 
}); 

    res.json({ msg: "Campaign removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});



 router.get("/today", async (req, res) => {
  // console.log(req);

  const today = Intl.DateTimeFormat(
      "en-US",
      { timeZone: "America/Los_Angeles" },
      {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }
    ).format(new Date(Date.now())) 

  const prospects = await Lead.find({
    "loadDate": today
  });




const filterUnwanted = (arr) => {
   const required = arr.filter(el => {
      return el.otherliens;
   });
   return required;
};

  const result = prospects.map(({fullName,fileType, filingDate, firstName, lastName, state,zip, county, plaintiff, amount, address, age, dob, ssn, otherliens, phones, emailAddresses}) => {
  let obj = {
    fullName: fullName,
    First_Name: firstName,
    Last_Name: lastName,
    Address: address,
    city:city,
    State: state,
    Zip_4: zip,
    file_date: filingDate,
    County: county,
    plaintiff: plaintiff,
    lien_type: fileType,
    Amount: amount,
    age: age,
    dob: dob,
    ssn: ssn
  };

 phones.forEach((phone, i) => obj[`phone${i+1}`] = phone)
 emailAddresses.forEach((addr, i) => obj[`emailAddress${i+1}`] = addr)
 otherliens.filter((e)=> e.plaintiff && e.plaintiff.includes("Internal Revenue") || e.plaintiff && e.plaintiff.includes("State of") || e.plaintiff && e.plaintiff.includes("IRS")).forEach(({plaintiff, amount}, i) => {
    obj[`plaintiff${i+1}`] = plaintiff;
    obj[`amount${i+1}`] = amount;
  });

  return obj;
})



 const json2csvParser = new Parser();
 const csv = json2csvParser.parse(result);
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'blackballedproductions@gmail.com',
    pass: 'Pay@ttention35!' // naturally, replace both with your real credentials or an application-specific password
  }
});



   const attachment2 = {
          filename: `Unique Daily File - ${today}.csv`,
          content: csv,
        };
  const mailer2 = {
    title: "list",
    from: "mickey",
    to: ["mickeygray85@hotmail.com","poakes@nattaxexperts.com","arios@nattaxexperts.com","mforde@nattaxexperts.com"],
    subject: `Unique Daily File - ${today}`,
    text: `Here are all of the unique leads with a load date of Today `,
    attachments:[attachment2]
  };

  transporter.sendMail(mailer2);

});
router.post("/lexis", async (req, res) => {
  const string = Object.keys(req.body).toString();

  let reg = /LexID\(sm\):([\S]+)/gim; // Get hashtags.

  let matches = (string.match(reg) || []).map((e) => e.replace(reg, "$1"));
  console.log(matches);
});

router.get("/dups", async (req, res) => {

  const leads = await Lead.find({})
  var uniq = leads
  .map((lead) => {
    return {
      count: 1,
      mailKey: lead.mailKey
    }
  })
  .reduce((a, b) => {
    a[b.mailKey] = (a[b.mailKey] || 0) + b.count
    return a
  }, {})

  var duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1)

  const dupLeads = leads.filter((lead) => duplicates.includes(lead.mailKey))

  res.json(dupLeads)

});

router.put("/:id", async (req, res) => {

  console.log(req.body);
});

module.exports = router;
