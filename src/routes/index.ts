import  { Router } from 'express';
import multer from 'multer';
import OrphanagesController from '../controller/OrphanagesController';
import UploadConfig from '../config/upload';

const uploadMulter = multer(UploadConfig);

const routes = Router();

routes.get('/orphanages', OrphanagesController.index);

routes.get('/orphanages/:id', OrphanagesController.show);
  
 
routes.post('/orphanages', uploadMulter.array('images'),  OrphanagesController.create);

export default routes;
