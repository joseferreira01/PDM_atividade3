import { getRepository } from 'typeorm';
import {Request,Response} from 'express';
import orphanagesView from '../views/orphanages_views';
import * as Yup from 'yup';

import Orphanage from '../models/Orphanage';

const OrphanagesController = {
    async create(req: Request, res:Response ):Promise<Orphanage | any>{
        const reqImages = req.files as Express.Multer.File[];

        
            const {
                name, 
                latitude, 
                longitude, 
                about,
                instructions, 
                opening_hours, 
                open_on_weekends,
                } = req.body;
                console.log(req.body)
        
            const orphanagesRepository =  getRepository(Orphanage);
           
            const images = reqImages.map(img => {return {
                path: img.filename
            }})
             
            const dataOrphanage = {
                name, 
                latitude, 
                longitude, 
                about,
                instructions, 
                opening_hours, 
                open_on_weekends,
                images
            }

            const schema = Yup.object().shape({
                name: Yup.string().trim().required(),
                latitude: Yup.number().required(),
                longitude: Yup.number().required(),
                about: Yup.string().required().max(300),
                instructions: Yup.string().required(),
                opening_hours: Yup.string().required(),
                open_on_weekends: Yup.boolean().required(),
                images: Yup.array(
                    Yup.object().shape({
                        path: Yup.string().required()
                    }),
                ),
            });

            await schema.validate(dataOrphanage, {
                abortEarly: false,
            });

            const orphanage = orphanagesRepository.create(dataOrphanage);
        
            await orphanagesRepository.save(orphanage);
        
            return res.status(201).json(orphanage);
        },

    async index(req: Request, res:Response ):Promise<Orphanage[] | any>{
        const orphanagesRepository =  getRepository(Orphanage);
        const orphanages = await orphanagesRepository.find({
            relations: ['images']
        });
        console.log(orphanages)

        return res.status(200).json(orphanagesView.renderMany(orphanages));
    },

    async show(req: Request, res:Response ):Promise<Orphanage[] | any>{
        const {id} = req.params;
        const orphanagesRepository =  getRepository(Orphanage);
        const orphanage = await orphanagesRepository.findOneOrFail(id, {
            relations: ['images']
        });
        console.log(orphanage)

        return res.status(200).json(orphanagesView.render(orphanage));
    }
}

export default OrphanagesController;
