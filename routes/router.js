const express = require("express")


const route = express.Router()

const siteSettingController = require('../controller/siteSettingController')
const servicePageController = require('../controller/servicePageController')
const fileManagerController = require('../controller/fileManagerController')
const userManagerController = require('../controller/userManagerController')

const userModel = require("../models/userModel")


/// Site Settings
route.post('/siteSetting', siteSettingController.addNewSiteSetting)
route.get('/siteSetting', siteSettingController.getSitSetting)
route.delete('/siteSetting', siteSettingController.removeSitSetting)

/// Service Page
route.post('/addNewServicePage', servicePageController.addNewServicePage)
route.get('/getAllServicePage', servicePageController.getAllServicePage)
route.post('/getServicePage/:catid', servicePageController.getServicePageDetail)
route.put('/updateServicePage', servicePageController.updateServicePage)
route.get('/deleteServicePage/:serviceId', servicePageController.deleteServicePage)

/// Upload File
route.post('/createAlbum', fileManagerController.createAlbum)
route.get('/getAllAlbum', fileManagerController.getAllCategory)
route.delete('/deleteAlbum', fileManagerController.deleteAlbum)
route.post('/uploadFile', fileManagerController.uploadFile)
route.post('/getFileList', fileManagerController.getFileList)
route.delete('/deleteFile', fileManagerController.deleteFile)

/// User Management
route.post('/addNewOrUpdateRoll', userManagerController.addNewOrUpdateUserRoll)
route.post('/getUserRoll', userManagerController.getUserRoll)
route.delete('/removeUserRoll', userManagerController.removeUserRoll)
///
route.post('/addNewUser', userManagerController.addNewUser)





module.exports = route