import config from '../../config/index.js';
import autoBind from 'auto-bind';
import { validationResult } from 'express-validator';
import recaptcha from 'express-recaptcha';
import fs from 'fs';

export default class Controller {
    constructor() {
        autoBind(this);
        this.setRecaptcha();
    }
    setRecaptcha(){
        this.recaptcha = new recaptcha.RecaptchaV2(config.google.recaptcha.SITE_KEY, config.google.recaptcha.SECRET_KEY, {'hl': 'fa'});
    }
    async completeValidation(req, res, next, func){
        let result = await this.validationForm(req);
        if(!result){
            if(req.file){
                let filePath = `${req.file.destination}/${req.file.filename}`;
                if(fs.existsSync(filePath)){
                    fs.unlinkSync(filePath);
                }
            }
            return this.back(req, res);
        }
        return func(req, res, next);
    }
    async validationForm(req){
        
        let result = validationResult(req);
        if(!result.isEmpty()){
            let array = result.array();
            let errors = [];
            for(let error of array){
                errors.push(error.msg);
            }
            req.flash('errors', errors);
            return false;
        }
        return true;
    }
    validationRecaptcha(req){
        return new Promise((resolve, reject) => {
            this.recaptcha.verify(req, (error, data) => {
                if(!error){
                    return resolve(true);
                }
                req.flash('errors', 'گزینه امنیتی فعال نمی باشد');
                return resolve(false);
            });
        });
    }
    back(req, res){
        res.redirect(req.header('referer') || '/');
    }
}