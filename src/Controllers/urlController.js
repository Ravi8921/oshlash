const UrlModel = require('../Models/UrlModel')
const shortid = require('shortid');
const validUrl = require('valid-url')
const validator = require("../validation/validator");
const userModel = require("../Models/userModel");
const baseUrl = 'https://www.notion.so'


//==========================================================================================

const validDetail = function (value) {
  if (typeof (value) === 'undefined' || typeof (value) === 'null') { return false } //if undefined or null occur rather than what we are expecting than this particular feild will be false.
  if (value.trim().length == 0) { return false } //if user give spaces not any string eg:- "  " =>here this value is empty, only space is there so after trim if it becomes empty than false will be given. 
  if (typeof (value) === 'string' && value.trim().length > 0) { return true } //to check only string is comming and after trim value should be their than only it will be true.
}

const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId)
}

const shortenUrl = async function (req, res) {
  try {

    let data = req.body;

    const { fullUrl,
      description,
      tags } = data;
    const urlCode = shortid.generate()

    if (validUrl.isUri(fullUrl.trim())) {
      let url = await UrlModel.findOne({ fullUrl: fullUrl })
      if (url) {
        res.status(200).send({ status: true, message: "You have already created shortlink for the requested URL as given below", data: url.shortlink })

      } else {
        // join the generated short code the the base url
        const shortlink = baseUrl + '/' + urlCode.toLowerCase()

        // invoking the Url model and saving to the DB
        url = await UrlModel.create({
          fullUrl, urlCode,
          shortlink,
          description,
          tags

        })

        res.status(201).send({ status: true, data: url })
      }
    } else {
      res.status(401).send({ status: false, msg: "Invalid fullUrl" })
    }
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message })
  }
}


const userList = async function (req, res) {
  try {


    let list = await UrlModel.find().select({ _id: 0 }).populate("authenticated_user");
    return res.status(200).send({ status: true, message: `user List`, data: list })

  }
  catch (error) {
    res.status(500).send({ status: false, message: error.message })
  }
}


const getshortcut = async function (req, res) {
  try {
    let shortlink = req.query.shortlink
    let description = req.query.description
    let tags = req.query.tags

    if (!validDetail(shortlink)) {
      return res.status(400).send({ status: false, message: ' shortlink is required' })
    }

    if (shortlink) {
      let link = await UrlModel.find({ shortlink: { $regex: shortlink, $options: 'i' }, isDeleted: false })
      return res.status(200).send({ status: true, message: `Successfully shortlink Found`, data: link });
    }
    if (description) {
      let des = await UrlModel.find({ description: description, isDeleted: false })
      return res.status(200).send({ status: true, message: `Successfully description Found`, data: des });
    }
    if (tags) {
      let des = await UrlModel.find({ tags: tags, isDeleted: false })
      return res.status(200).send({ status: true, message: `tags are`, data: des });

    }
  }
  catch (error) {
    return res.status(500).send({ success: false, error: error.message });
  }
}




const deleteshortcut = async function (req, res) {
  try {
    const urlId = req.params.urlId;
     {
  let data = await UrlModel.findOneAndUpdate({ id: urlId, isDeleted: false }, { isDeleted: true, deletedAt: Date() }, { new: true })
      if (data) {
        res.status(200).send({ status: true, data: data })
      } else {
        res.status(404).send({ err: "data might have been already deleted" })
      }
    }

  }
  catch (err) {
    res.status(500).send({ status: false, message: err.message })
  }
}




module.exports.getshortcut = getshortcut;
module.exports.shortenUrl = shortenUrl
module.exports.userList = userList
module.exports.deleteshortcut = deleteshortcut



