import joi from 'joi';

export const seeder_schema_validatiions=joi.object({
    admin_secret_key:joi.string().required()
})

export const admin_login_schema=joi.object({
    email:joi.string().email().required(),
    password:joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/).required()
})