const Brand = require('../models/brand');
const Condition = require('../models/condition');
const Country = require('../models/country');
const Engine = require('../models/engine');
const Vehicle = require('../models/vehicle');
const User = require('../models/user');
const OrderStatus = require('../models/order-status');

exports.getOptions = async (req,res,next) => {
    const optionName = req.params.name;
    let fetchTable;
    if (optionName === 'brand') {
        fetchTable = Brand
    } else if (optionName === 'condition') {
        fetchTable = Condition
    } else if (optionName === 'country') {
        fetchTable = Country
    } else if (optionName === 'engine') {
        fetchTable = Engine
    } else if (optionName === 'vehicle') {
        fetchTable = Vehicle
    } else if (optionName === 'order-status') {
        fetchTable = OrderStatus
    } else {
        return res.status(501).json({
            message: 'Service is not available'
        })
    }
    const result = await fetchTable.findAll({
    });
    return res.status(200).json(result)
};

async function isAdmin (req, res) {
    const userId = req.userId;
    const user = await User.findByPk(userId);
    const userStatus = user.dataValues.userStatusId;
    if (!userId || userStatus === 1) {
        return res.status(400).json({
            message: 'You do not have access to do it'
        });
    }
}

exports.postBrand = async (req, res, next) => {
    await isAdmin(req, res);
    const brandName = req.body.name;
    const findSame = await Brand.findOne({where: {name: brandName}});
    if (findSame) {
        return res.status(400).json({
            message: 'Brand already exists'
        })
    }
    await Brand.create({
        name: brandName
    });
    res.status(200).json({
        message: 'Brand added'
    })
};

exports.postCountry = async (req, res, next) => {
    await isAdmin(req, res);
    const countryName = req.body.name;
    const findSame = await Country.findOne({where: {name: countryName}});
    if (findSame) {
        return res.status(400).json({
            message: 'Country already exists'
        })
    }
    await Country.create({
        name: countryName
    });
    res.status(200).json({
        message: 'Country added'
    })
};

exports.postCondition = async (req, res, next) => {
    await isAdmin(req, res);
    const conditionName = req.body.name;
    const findSame = await Condition.findOne({where: {type: conditionName}});
    if (findSame) {
        return res.status(400).json({
            message: 'Condition already exists'
        })
    }
    await Condition.create({
        type: conditionName
    });
    res.status(200).json({
        message: 'Condition added'
    })
};

exports.postVehicle = async (req, res, next) => {
    await isAdmin(req, res);
    const vehicleName = req.body.name;
    const findSame = await Vehicle.findOne({where: {type: vehicleName}});
    if (findSame) {
        return res.status(400).json({
            message: 'Vehicle already exists'
        })
    }
    await Vehicle.create({
        type: vehicleName
    });
    res.status(200).json({
        message: 'Vehicle added'
    })
};

exports.postEngine = async (req, res, next) => {
    await isAdmin(req, res);
    const engineName = req.body.name;
    const findSame = await Engine.findOne({where: {type: engineName}});
    if (findSame) {
        return res.status(400).json({
            message: 'Engine already exists'
        })
    }
    await Engine.create({
        type: engineName
    });
    res.status(200).json({
        message: 'Engine added'
    })
};
