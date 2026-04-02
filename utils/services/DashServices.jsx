import axios from 'axios';
import { BASEURL } from '../constants/constantes';

export const GetAllPost = () =>{
    return axios 
        .get(BASEURL+"DashBoard/GetAllPost")
        .then((res) => {
            return res.data;
        })
}