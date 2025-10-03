const Joi = require('joi')

module.exports.productSchema = Joi.object({
    name : Joi.string().required(),
    brand : Joi.string().allow(''),
    category : Joi.string().required(),
    material : Joi.string().required(),
    weight : Joi.number().min(0).allow(null),
    originCountry : Joi.string().allow(''),
    price : Joi.number().min(0).allow(null),
    impactAnalysis : Joi.object({
        carbonFootprint : Joi.number().min(0).required(),
        waterUsage : Joi.number().min(0).required(),
        recyclability : Joi.string().valid('Low', 'Medium', 'High').required(),
        sustainabilityScore : Joi.number().min(1).max(10).required(),
        aiExplanation : Joi.string().allow('')
    }).required()
}).required()

module.exports.productInputSchema = Joi.object({
    name : Joi.string().required(),
    brand : Joi.string().allow(''),
    category : Joi.string().required(),
    material : Joi.string().required(),
    weight : Joi.number().min(0).allow(null),
    originCountry : Joi.string().allow(''),
    price : Joi.number().min(0).allow(null)
}).required()
