import * as React from 'react';
import Home from "./Home";
import { Container } from "reactstrap";
import {useLocation, useRouteMatch} from "react-router";
import './Layout.css';
import {useEffect, useState} from "react";

export default (props: { children?: React.ReactNode }) => {
        let match = useRouteMatch("/");
        let adminMatch = useRouteMatch("/admin");
        let location = useLocation();
        let isHomeMatch = match == undefined ? false : match.isExact;
        let isAdminMatch = adminMatch != undefined;
        const [initialLoad, setInitialLoad] = useState(true);
        const [animationClass, setAnimationClass] = useState("page-container hide");
        const [isHome, setIsHome] = useState(isHomeMatch);
        
        useEffect(() => {
                let className;
                console.log(isAdminMatch);
                
                if(isAdminMatch)
                {
                        className = "page-container tab-hide";
                        setAnimationClass(className);
                        setTimeout(() => {
                                let className = "page-container tab-show";
                                setAnimationClass(className);
                        }, 200);
                        return;
                }
                
                if(initialLoad)
                {
                        className = isHomeMatch ? "page-container initial-hide" : "page-container";
                        setAnimationClass(className);
                        setInitialLoad(false);
                        return;
                }
                // if previous page was home, we show immediatly.
                className = isHome && !isHomeMatch ? "page-container show" : "page-container hide";
                
                // if current page is not home, and previous is not home, do the show trigger in 500ms
                if(!isHomeMatch && !isHome)
                {
                        setTimeout(() => {
                                let className = "page-container show";
                                setAnimationClass(className);
                        }, 1000);       
                }
                
                if (isHomeMatch != isHome) {
                        setIsHome(isHomeMatch);
                }
                
                setAnimationClass(className);
        }, [location]);
        
        return (
            <React.Fragment>
                <Home/>
                <Container className={animationClass}>
                        <div className="page-content">
                                {props.children} 
                        </div>
                </Container>
            </React.Fragment>
        );
}
