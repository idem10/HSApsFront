import axios from 'axios';
import { BASEURL } from '../constants/constantes';

export const GetLogin = (data) =>{
    return axios 
        .post(BASEURL+"DashBoard/GetLogin", data)
        .then((res) => {
            return res.data;
        })
}

export const SetNewUser = (data) => {
    console.log(data);
    return axios 
        .post(BASEURL+"DashBoard/SetNewUser", data)
        .then((res) => {
            return res.data;
        }).catch((err) => {
            console.error(err);
        })
}