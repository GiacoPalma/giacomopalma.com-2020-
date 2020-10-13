import {AxiosRequestConfig, AxiosResponse} from "axios";
import axios from "axios";

export default class Requester {
    private static _instance: Requester;
    private configuration: AxiosRequestConfig;
    private constructor() {
        this.configuration = {
            withCredentials: true
        };
    }
    
    public static getInstance(): Requester
    {
        if(!Requester._instance)
        {
            Requester._instance = new Requester();
        }
        
        return Requester._instance;
    }
    
    public get(url:string): Promise<AxiosResponse>
    {
        return axios.get(url);
    }
    
    public post(url: string, data: {}): Promise<AxiosResponse<any>>
    {
        return axios.post(url, data);
    }
    
    public postForm(url: string, data: FormData): Promise<AxiosResponse<any>>
    {
        return axios.post(url, data, {headers: {"Content-Type": "multipart/form-data"}});
    }
    
    public put(url: string, data: FormData, options: AxiosRequestConfig): Promise<AxiosResponse<any>>
    {
        return axios.put(url, data, options);
    }
}