const mongoose = require("mongoose");
const { Schema } = mongoose;

const leadSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    fullName: String,
    address: String,
    stateFiled: String,
    countyFiled: String,
    mailKey:String,
    entityName1:String,
    entityName2:String,
    deliveryAddress: String,
    alternateAddress1: String,
    city: String,
    state: String,
    zip4: String,
    zip: String,
    zipCode: String,
    county: String,
    dupId:String,
    ssn: String,
    fileType: String,
    fileType2: String,
    fileType3: String,
    fileType4: String,
    fileType5: String,
    amount: String,
    source: String,
    email: String,
    filingDate: String,
    loadDate: Date,
    scrapeDate:Date,
    fiveAmount: String,
    nineAmount: String,
    loadDatePlusSeven: String,
    entityType: String,
    pinCode: String,
    origDept: String,
    plaintiff: String,
    city1:String,
    address1:String,
    age: String,
    dob: String,
    phone: String,
    lexisQuery: String,
    phones: [String],
    ageRange: String,
    phone: String,
    emailAddresses: [String],
    email: String,
    emailAddress: String,
    otherliens:[{
      plaintiff:{ type: String },
      amount:{ type: String },
      filingDate:{ type: String }
    }]
  },

  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

module.exports = mongoose.model("leads", leadSchema);
